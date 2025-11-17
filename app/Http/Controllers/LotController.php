<?php

namespace App\Http\Controllers;

use App\Models\Lot;
use App\Models\LotImage;
use App\Notifications\LotApprovedNotification;
use App\Notifications\LotRejectedNotification;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Gate;
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

    // ===== Public actions ==============================================================

    public function index(Request $request)
    {
        $sizes        = (array) $request->query('sizes', []);
        $contentTypes = (array) $request->query('contentTypes', []);
        $furnishings  = (array) $request->query('furnishings', []);
        $lotType      = $request->query('lotType');

        $bMin  = $request->filled('bedroomsMin')  ? (int)$request->bedroomsMin  : null;
        $bMax  = $request->filled('bedroomsMax')  ? (int)$request->bedroomsMax  : null;
        $baMin = $request->filled('bathroomsMin') ? (int)$request->bathroomsMin : null;
        $baMax = $request->filled('bathroomsMax') ? (int)$request->bathroomsMax : null;

        $query = Lot::query()
            ->confirmed()
            ->withCount(['favoritedBy as favorites_count'])
            ->orderByRaw('CASE WHEN id = ? THEN 0 ELSE 1 END', [1])
            ->orderByDesc('favorites_count')
            ->orderBy('updated_at', 'asc')
            ->orderBy('id','asc')
            ->with(['images','user']);

        $query->when(!empty($sizes), fn($q) => $q->whereIn('lot_size', $sizes));
        $query->when(!empty($contentTypes), fn($q) => $q->whereIn('content_type', $contentTypes));
        $query->when(!empty($furnishings), fn($q) => $q->whereIn('furnishing', $furnishings));
        $query->when(in_array($lotType, ['Residential','Community']), fn($q) => $q->where('lot_type', $lotType));

        if ($lotType === 'Residential' || $lotType === null) {
            if (!is_null($bMin) && !is_null($bMax)) $query->whereBetween('bedrooms', [$bMin, $bMax]);
            elseif (!is_null($bMin)) $query->where('bedrooms', '>=', $bMin);
            elseif (!is_null($bMax)) $query->where('bedrooms', '<=', $bMax);

            if (!is_null($baMin) && !is_null($baMax)) $query->whereBetween('bathrooms', [$baMin, $baMax]);
            elseif (!is_null($baMin)) $query->where('bathrooms', '>=', $baMin);
            elseif (!is_null($baMax)) $query->where('bathrooms', '<=', $baMax);
        }

        $query = $this->attachFavFlag($query);

        return Inertia::render('dashboard', [
            'lots' => $query->paginate(9)->withQueryString(),
        ]);
    }

    public function search(Request $request)
    {
        $q = trim((string) $request->query('q', ''));
        if ($q === '' || mb_strlen($q) < 2) {
            return response()->json(['data' => []]);
        }

        $lots = Lot::query()
            ->select(['id','name','updated_at'])
            ->where('name', 'like', "%{$q}%")
            ->with(['images' => fn ($q) => $q->orderBy('position')->limit(1)])
            ->orderByDesc('updated_at')
            ->limit(8)
            ->get();

        $data = $lots->map(function (Lot $lot) {
            $cover    = $lot->images->first();
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
        $lot->loadCount(['favoritedBy as favorites_count']);
        $lot->load(['images' => fn ($q) => $q->orderBy('position'), 'user']);

        if ($lot->status !== 'confirmed') {
            $user    = auth()->user();
            $isOwner = $user && $user->id === $lot->user_id;
            $isAdmin = $user && ($user->is_admin ?? false);
            abort_unless($isOwner || $isAdmin, 403, 'This lot is not confirmed yet.');
        }

        $isOwner = auth()->check() && $lot->user_id === auth()->id();
        $isFavorited = auth()->check()
            ? auth()->user()->favoriteLots()->where('lot_id', $lot->id)->exists()
            : false;

        $isAdmin = auth()->check() && (auth()->user()->is_admin ?? false);

        $pendingIds = Lot::query()
            ->where('user_id', $lot->user_id)
            ->where('status', 'pending')
            ->pluck('id')
            ->all();

        return Inertia::render('lots/show', [
            'lot'         => $lot,
            'isOwner'     => $isOwner,
            'isFavorited' => $isFavorited,
            'isAdmin'     => $isAdmin,
            'pendingIds'  => $pendingIds,
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
        $this->abortIfNotOwner($lot);

        $lot->load(['images' => fn ($q) => $q->orderBy('position')]);

        return Inertia::render('lots/edit', [
            'lot'   => $lot,
            'enums' => $this->enums(),
        ]);
    }

    public function update(Request $request, Lot $lot)
    {
        $this->abortIfNotOwner($lot);

        $data = $request->validate($this->rules(true));
        $lot->update($data);

        if ($request->hasFile('images')) {
            $files = array_values($request->file('images'));
            $start = (int)$lot->images()->max('position') + 1;
            $this->storeLotImages($lot, $files, $start);
        }

        return redirect()
            ->route('lots.view', ['lot' => $lot->id])
            ->with('success', 'Lot updated.');
    }

    public function mine()
    {
        $userId = request()->user()->id;

        $base = Lot::query()
            ->where('user_id', $userId)
            ->with([
                'coverImage:id,lot_id,filename,position',
                'user:id,name,avatar',
            ])
            ->orderByDesc('created_at');

        $lots = $this->attachFavFlag($base)
            ->withCount(['favoritedBy as favorites_count'])
            ->paginate(9)
            ->withQueryString();

        $pendingCount = Lot::where('user_id', $userId)
            ->where('status', 'pending')
            ->count();

        return Inertia::render('lots/mine', [
            'lots'         => $lots,
            'pendingCount' => $pendingCount,
        ]);
    }


    public function pendingList(Request $request)
    {
//        abort_unless(Gate::allows('admin'), 403);

        $lots = Lot::query()
            ->pending()
            ->withCount(['favoritedBy as favorites_count'])
            ->with(['coverImage:id,lot_id,filename,position', 'user:id,name,avatar'])
            ->orderBy('created_at', 'asc')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('admin/lots/pending', ['lots' => $lots]);
    }


    public function store(Request $request)
    {
        $data = Validator::make($request->all(), $this->rules(true))->validate();

        $lot = Lot::create([
            'user_id' => $request->user()->id,
            'status'  => 'pending',
            ...$data,
        ]);

        if ($request->hasFile('images')) {
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

        return redirect()
            ->route('lots.mine')
            ->with('info', 'Your lot was submitted for review');
    }

    public function approve(Request $request, Lot $lot)
    {
        abort_unless(Gate::allows('admin'), 403);

        if ($lot->status !== 'confirmed') {
            $lot->update(['status' => 'confirmed', 'rejection_reason' => null]);

            $lot->user?->notify(new LotApprovedNotification($lot));
        }

        if ($request->wantsJson()) {
            return response()->json(['status' => 'ok', 'lot_status' => $lot->status]);
        }

        return redirect()
            ->route('admin.lots.pending')
            ->with('success', 'Lot approved.');
    }

    public function invalidate(Request $request, Lot $lot)
    {
        abort_unless(Gate::allows('admin'), 403);

        $data = $request->validate([
            'reason' => ['nullable', 'string', 'max:500'],
        ]);

        $lot->update([
            'status'            => 'invalid',
            'rejection_reason'  => $data['reason'] ?? null,
        ]);

        $lot->user?->notify(new LotRejectedNotification($lot, $data['reason'] ?? null));

        if ($request->wantsJson()) {
            return response()->json(['status' => 'ok', 'lot_status' => $lot->status]);
        }

        return redirect()
            ->route('admin.lots.pending')
            ->with('success', 'Lot marked as invalid.');
    }

    public function destroy(Lot $lot)
    {
        $this->abortIfNotOwner($lot);
        $lot->delete();

        return redirect()->route('lots.mine')->with('success', 'Lot deleted.');
    }

    // ====== Private helpers ============================================================

    private function attachFavFlag(Builder $query): Builder
    {
        // если select не задан — выберем lots.*
        if (empty($query->getQuery()->columns)) {
            $query->select('lots.*');
        }

        $uid = auth()->id();
        if (!$uid) {
            return $query->addSelect(DB::raw('0 as is_favorited'));
        }

        return $query->addSelect(DB::raw(
            'EXISTS (
                SELECT 1 FROM favorites
                WHERE favorites.lot_id = lots.id
                  AND favorites.user_id = ' . (int)$uid . '
            ) AS is_favorited'
        ));
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
            'name'          => ['required','string','max:255'],
            'description'   => ['nullable','string','max:1000'],
            'creator_id'    => ['nullable','string','max:255'],
            'creator_link'  => ['nullable','url','max:255'],
            'download_link' => ['nullable','url','max:255'],
            'lot_size'      => ['required','in:'.implode(',', self::LOT_SIZES)],
            'content_type'  => ['required','in:'.implode(',', self::CONTENT_TYPES)],
            'furnishing'    => ['required','in:'.implode(',', self::FURNISHINGS)],
            'lot_type'      => ['required','in:'.implode(',', self::LOT_TYPES)],
            'bedrooms'      => ['nullable','integer','min:0','max:50'],
            'bathrooms'     => ['nullable','integer','min:0','max:50'],
        ];

        if ($withImages) {
            $rules['images']   = ['nullable','array','max:10'];
            // мягкая валидация чтобы "ничего не сломать" — не добавляю строгие mimes
            $rules['images.*'] = ['file','max:8192'];
        }

        return $rules;
    }

    private function readRange(Request $request, string $base): array
    {
        $min = $request->filled("{$base}Min") ? (int)$request->input("{$base}Min") : null;
        $max = $request->filled("{$base}Max") ? (int)$request->input("{$base}Max") : null;
        return [$min, $max];
    }

    private function applyNumericRange(Builder $q, string $column, ?int $min, ?int $max): void
    {
        if (!is_null($min) && !is_null($max)) {
            $q->whereBetween($column, [$min, $max]);
        } elseif (!is_null($min)) {
            $q->where($column, '>=', $min);
        } elseif (!is_null($max)) {
            $q->where($column, '<=', $max);
        }
    }

    /** @param UploadedFile[] $files */
    private function storeLotImages(Lot $lot, array $files, int $startPosition = 0): void
    {
        foreach (array_values($files) as $i => $file) {
            $ext  = $file->getClientOriginalExtension();
            $dir  = "images/lots/{$lot->id}";
            $name = Str::uuid().'.'.$ext;

            Storage::disk('s3')->putFileAs($dir, $file, $name);

            LotImage::create([
                'lot_id'   => $lot->id,
                'filename' => $name,
                'position' => $startPosition + $i,
            ]);
        }
    }

    private function abortIfNotOwner(Lot $lot): void
    {
        abort_unless(auth()->check() && auth()->id() === $lot->user_id, 403);
    }
}
