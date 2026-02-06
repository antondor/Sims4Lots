<?php

namespace App\Http\Controllers;

use App\Models\Lot;
use Inertia\Inertia;
use App\Models\LotImage;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Intervention\Image\ImageManager;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Validator;
use Intervention\Image\Drivers\Gd\Driver;
use App\Notifications\LotApprovedNotification;
use App\Notifications\LotRejectedNotification;
use Illuminate\Http\File;

class LotController extends Controller
{
    private const LOT_SIZES     = ['20x15','30x20','40x30','50x50','64x64'];
    private const CONTENT_TYPES = ['CC','NoCC'];
    private const FURNISHINGS   = ['Furnished','Unfurnished'];
    private const LOT_TYPES     = ['Residential','Community'];

    // ===== Public actions ==============================================================

    public function index(Request $request)
    {
        $filters = [
            'sizes'        => (array) $request->query('sizes', []),
            'contentTypes' => (array) $request->query('contentTypes', []),
            'furnishings'  => (array) $request->query('furnishings', []),
            'lotType'      => $request->query('lotType'),
            'bMin'         => $request->filled('bedroomsMin') ? (int)$request->bedroomsMin : null,
            'bMax'         => $request->filled('bedroomsMax') ? (int)$request->bedroomsMax : null,
            'baMin'        => $request->filled('bathroomsMin') ? (int)$request->bathroomsMin : null,
            'baMax'        => $request->filled('bathroomsMax') ? (int)$request->bathroomsMax : null,
            'sort'         => $request->query('sort', 'newest'),
            'source'       => $request->query('source'),
        ];

        $query = Lot::query()
            ->confirmed()
            ->withCount(['favoritedBy as favorites_count'])
            ->with(['images', 'user']);

        $query->when($filters['sizes'], fn($q) => $q->whereIn('lot_size', $filters['sizes']));
        $query->when($filters['contentTypes'], fn($q) => $q->whereIn('content_type', $filters['contentTypes']));
        $query->when($filters['furnishings'], fn($q) => $q->whereIn('furnishing', $filters['furnishings']));

        $query->when(in_array($filters['lotType'], ['Residential', 'Community']), fn($q) => $q->where('lot_type', $filters['lotType']));

        $query->when($filters['source'], function ($q, $source) {
            if ($source === 'file') {
                $q->whereNotNull('download_link')->where('download_link', '!=', '');
            } elseif ($source === 'gallery') {
                $q->whereNotNull('gallery_id')->where('gallery_id', '!=', '');
            }
        });

        if (in_array($filters['lotType'], ['Residential', null])) {
            if ($filters['bMin']) $query->where('bedrooms', '>=', $filters['bMin']);
            if ($filters['bMax']) $query->where('bedrooms', '<=', $filters['bMax']);

            if ($filters['baMin']) $query->where('bathrooms', '>=', $filters['baMin']);
            if ($filters['baMax']) $query->where('bathrooms', '<=', $filters['baMax']);
        }

        match ($filters['sort']) {
            'popular' => $query->orderByDesc('favorites_count')->orderByDesc('created_at'),
            'oldest'  => $query->orderBy('created_at', 'asc'),
            default   => $query->orderByDesc('created_at'),
        };

        $query->orderByDesc('id');

        $query = $this->attachFavFlag($query);

        return Inertia::render('dashboard', [
            'lots' => $query->paginate(9)->withQueryString(),
            'filters' => $filters,
        ]);
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

        $validator = Validator::make($request->all(), $this->rules(isNew: false));

        $validator->after(function ($validator) use ($request, $lot) {
            $newImagesCount = $request->hasFile('images') ? count($request->file('images')) : 0;
            $existingImagesCount = $lot->images()->count();

            if ($newImagesCount + $existingImagesCount === 0) {
                $validator->errors()->add('images', 'В лоте должно быть хотя бы одно изображение.');
            }
        });

        $data = $validator->validate();

        $lot->update(collect($data)->except('images')->toArray());

        if ($request->hasFile('images')) {
            $start = (int)$lot->images()->max('position') + 1;
            $this->storeLotImages($lot, $request->file('images'), $start);
        }

        return redirect()->route('lots.view', $lot->id)->with('success', 'Lot updated.');
    }

    public function myLots()
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

        return Inertia::render('lots/myLots', [
            'lots'         => $lots,
            'pendingCount' => $pendingCount,
        ]);
    }


    public function pendingList(Request $request)
    {
        abort_unless(Gate::allows('admin'), 403);

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
            $this->storeLotImages($lot, $request->file('images'));
        }

        return redirect()
            ->route('myLots')
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

        $files = Storage::disk('s3')->allFiles("images/lots/{$lot->id}");

        if (!empty($files)) {
            Storage::disk('s3')->delete($files);
        }

        $lot->images()->delete();
        $lot->delete();

        return redirect()->route('myLots')->with('success', 'Lot deleted.');
    }

    public function destroyImage(Lot $lot, LotImage $image)
    {
        $this->abortIfNotOwner($lot);

        if ($image->lot_id !== $lot->id) {
            abort(403);
        }

        if ($lot->images()->count() <= 1) {
            return back()->withErrors(['images' => 'Нельзя удалить последнюю фотографию. Добавьте новую, прежде чем удалять эту.']);
        }

        Storage::disk('s3')->delete("images/lots/{$lot->id}/{$image->filename}");
        $image->delete();

        return back()->with('success', 'Изображение удалено.');
    }

    // ====== Private helpers ============================================================

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

    private function rules(bool $isNew = true): array
    {
        return [
            'name'          => ['required', 'string', 'max:255'],
            'description'   => ['nullable', 'string', 'max:65535'],
            'gallery_id'    => ['required_without:download_link', 'nullable', 'string', 'max:255'],
            'download_link' => ['required_without:gallery_id', 'nullable', 'url', 'max:255'],
            'creator_link'  => ['nullable', 'url', 'max:255'],
            'lot_size'      => ['required', 'in:' . implode(',', self::LOT_SIZES)],
            'content_type'  => ['required', 'in:' . implode(',', self::CONTENT_TYPES)],
            'furnishing'    => ['required', 'in:' . implode(',', self::FURNISHINGS)],
            'lot_type'      => ['required', 'in:' . implode(',', self::LOT_TYPES)],
            'bedrooms'      => ['nullable', 'integer', 'min:0', 'max:50'],
            'bathrooms'     => ['nullable', 'integer', 'min:0', 'max:50'],
            'images'        => [$isNew ? 'required' : 'nullable', 'array', 'min:1', 'max:10'],
            'images.*'      => ['image', 'mimes:jpg,jpeg,png', 'max:5120'],
        ];
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

    private function abortIfNotOwner(Lot $lot): void
    {
        abort_unless(auth()->check() && auth()->id() === $lot->user_id, 403);
    }

    private function storeLotImages(Lot $lot, array $files, int $startPosition = 0): void
    {
        $manager = new ImageManager(new Driver());

        $tempDir = storage_path('app/temp_thumbs');
        if (!file_exists($tempDir)) {
            mkdir($tempDir, 0777, true);
        }

        foreach (array_values($files) as $i => $file) {
            $extension = $file->getClientOriginalExtension();
            $uuid = Str::uuid();

            $dirInS3 = "images/lots/{$lot->id}";
            $originalName = "{$uuid}.{$extension}";
            $thumbName    = "{$uuid}_thumb.jpg";

            $localThumbPath = $tempDir . '/' . $thumbName;

            $image = $manager->read($file);
            $image->scale(width: 400);
            $image->toJpeg(quality: 80)->save($localThumbPath);

            Storage::disk('s3')->putFileAs(
                $dirInS3,
                new File($localThumbPath),
                $thumbName
            );

            @unlink($localThumbPath);

            Storage::disk('s3')->putFileAs($dirInS3, $file, $originalName);

            LotImage::create([
                'lot_id'   => $lot->id,
                'filename' => $originalName,
                'position' => $startPosition + $i,
            ]);
        }
    }
}
