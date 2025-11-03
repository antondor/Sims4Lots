<?php

namespace App\Http\Controllers;

use App\Models\Lot;
use App\Models\LotImage;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

class LotController extends Controller
{
    private const LOT_SIZES     = ['20x15','30x20','40x30','50x50','64x64'];
    private const CONTENT_TYPES = ['CC','NoCC'];
    private const FURNISHINGS   = ['Furnished','Unfurnished'];
    private const LOT_TYPES     = ['Residential','Community'];

    public function index()
    {
        $base = Lot::query()
            ->orderByRaw('CASE WHEN id = 1 THEN 0 ELSE 1 END')
            ->orderBy('updated_at', 'asc')
            ->with(['images','user']);

        $lots = $this->attachFavFlag($base)
            ->paginate(9)
            ->withQueryString();

        return Inertia::render('dashboard', ['lots' => $lots]);
    }

    private function attachFavFlag(Builder $query): Builder
    {
        if (empty($query->getQuery()->columns)) {
            $query->select('lots.*');
        }

        $uid = auth()->id();

        if (!$uid) {
            return $query->addSelect(DB::raw('0 as is_favorited'));
        }

        return $query->addSelect(DB::raw(
            'EXISTS (
            select 1
            from favorites
            where favorites.lot_id = lots.id
              and favorites.user_id = ' . (int) $uid . '
        ) as is_favorited'
        ));
    }

    public function search(Request $request)
    {
        $q = trim((string) $request->query('q', ''));
        if ($q === '' || mb_strlen($q) < 2) {
            return response()->json(['data' => []]);
        }

        $lots = Lot::query()
            ->where('name', 'like', "%{$q}%")
            ->with(['images' => fn ($q) => $q->orderBy('position')->limit(1)])
            ->orderBy('updated_at', 'desc')
            ->limit(8)
            ->get();

        $data = $lots->map(function (Lot $lot) {
            $cover = $lot->images->first();
            $coverUrl = $cover?->url ?? asset('images/lot-placeholder.jpg');
            return [
                'id'        => $lot->id,
                'name'      => $lot->name,
                'cover_url' => $coverUrl,
            ];
        });

        return response()->json(['data' => $data]);
    }

    public function view(Lot $lot)
    {
        $lot->load(['images' => fn ($q) => $q->orderBy('position'), 'user']);

        $isOwner = auth()->check() && $lot->user_id === auth()->id();
        $isFavorited = auth()->check()
            ? auth()->user()->favoriteLots()->where('lot_id', $lot->id)->exists()
            : false;

        return Inertia::render('lots/show', [
            'lot' => $lot,
            'isOwner' => $isOwner,
            'isFavorited' => $isFavorited,
        ]);
    }


    public function show(Lot $lot)
    {
        $lot->load(['images' => fn ($q) => $q->orderBy('position')]);
        return response()->json(['lot' => $lot]);
    }

    public function create()
    {
        return Inertia::render('lots/create', ['enums' => $this->enums()]);
    }

    public function edit(Lot $lot)
    {
        abort_unless(auth()->check() && auth()->id() === $lot->user_id, 403);

        $lot->load(['images' => fn($q) => $q->orderBy('position')]);

        return Inertia::render('lots/edit', [
            'lot' => $lot,
            'enums' => $this->enums(),
        ]);
    }

    public function update(Request $request, Lot $lot)
    {
        abort_unless(auth()->check() && auth()->id() === $lot->user_id, 403);

        $data = $request->validate($this->rules(true));

        $lot->update($data);

        if ($request->hasFile('images')) {
            $files = array_values($request->file('images'));
            $start = (int)$lot->images()->max('position') + 1;

            foreach ($files as $i => $file) {
                $ext  = $file->getClientOriginalExtension();
                $dir  = "images/lots/{$lot->id}";
                $name = Str::uuid().'.'.$ext;

                Storage::disk('s3')->putFileAs($dir, $file, $name);

                LotImage::create([
                    'lot_id'   => $lot->id,
                    'filename' => $name,
                    'position' => $start + $i,
                ]);
            }
        }

        return redirect()->route('lots.view', ['lot' => $lot->id])->with('success', 'Lot updated.');
    }

    public function mine()
    {
        $userId = request()->user()->id;

        $base = Lot::query()
            ->where('user_id', $userId)
            ->with([
                'coverImage:id,lot_id,filename,position,is_cover',
                'user:id,name,avatar',
            ])
            ->orderByDesc('created_at');

        $lots = $this->attachFavFlag($base)
            ->paginate(9)
            ->withQueryString();

        return Inertia::render('lots/mine', ['lots' => $lots]);
    }

    public function store(Request $request)
    {
        $data = Validator::make($request->all(), $this->rules(true))
            ->validate();

        $lot = Lot::create([
            'user_id' => $request->user()->id,
            ...$data,
        ]);

        if ($request->hasFile('images')) {
            /** @var UploadedFile[] $files */
            $files = $request->file('images');
            foreach ($files as $idx => $file) {
                $ext  = $file->getClientOriginalExtension();
                $dir  = "images/lots/{$lot->id}";
                $name = Str::uuid().'.'.$ext;

                Storage::disk('s3')->putFileAs($dir, $file, $name);

                LotImage::create([
                    'lot_id'   => $lot->id,
                    'filename' => $name,
                    'position' => $idx,
                ]);
            }
        }

        return redirect()->route('dashboard')->with('success', 'Lot created successfully.');
    }

    public function destroy(Lot $lot)
    {
        abort_unless(auth()->check() && auth()->id() === $lot->user_id, 403);
        $lot->delete();
        return redirect()->route('lots.mine')->with('success', 'Lot deleted.');
    }

    private function enums(): array
    {
        return [
            'lot_sizes'     => self::LOT_SIZES,
            'content_types' => self::CONTENT_TYPES,
            'furnishings'   => self::FURNISHINGS,
            'lot_types'     => self::LOT_TYPES,
        ];
    }

    private function rules(bool $withImages = false): array
    {
        $rules = [
            'name'         => ['required','string','max:255'],
            'description'  => ['nullable','string','max:1000'],
            'creator_id'   => ['nullable','string','max:255'],
            'creator_link' => ['nullable','url','max:255'],
            'lot_size'     => ['required','in:'.implode(',', self::LOT_SIZES)],
            'content_type' => ['required','in:'.implode(',', self::CONTENT_TYPES)],
            'furnishing'   => ['required','in:'.implode(',', self::FURNISHINGS)],
            'lot_type'     => ['required','in:'.implode(',', self::LOT_TYPES)],
            'bedrooms'     => ['nullable','integer','min:0','max:50'],
            'bathrooms'    => ['nullable','integer','min:0','max:50'],
        ];

        if ($withImages) {
            $rules['images'] = ['nullable','array','max:10'];
            $rules['images.*'] = [];
        }

        return $rules;
    }
}
