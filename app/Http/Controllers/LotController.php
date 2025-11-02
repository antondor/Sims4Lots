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

class LotController extends Controller
{
    public function index()
    {
        return Inertia::render('dashboard', [
            'lots' => Lot::query()
                ->orderByRaw('CASE WHEN id = 1 THEN 0 ELSE 1 END')
                ->orderBy('updated_at', 'asc')
                ->with(['images', 'user'])
                ->paginate(9),
        ]);
    }

    public function view(Lot $lot)
    {
        $lot->load([
            'images' => fn ($q) => $q->orderBy('position'),
            'user',
        ]);

        $isOwner = auth()->check() && $lot->user_id === auth()->id();

        return \Inertia\Inertia::render('lots/show', [
            'lot' => $lot,
            'isOwner' => $isOwner,
        ]);
    }

    public function show(Lot $lot)
    {
        $lot->load(['images' => fn ($q) => $q->orderBy('position')]);

        return response()->json([
            'lot' => $lot,
        ]);
    }

    public function create()
    {
        return Inertia::render('lots/create', [
            'enums' => [
                'lot_sizes'     => ['20x15','30x20','40x30','50x50','64x64'],
                'content_types' => ['CC','NoCC'],
                'furnishings'   => ['Furnished','Unfurnished'],
                'lot_types'     => ['Residential','Community'],
            ],
        ]);
    }

    public function edit(Lot $lot)
    {
        // разреши только владельцу
        abort_unless(auth()->check() && auth()->id() === $lot->user_id, 403);

        $lot->load(['images' => fn($q) => $q->orderBy('position')]);

        return \Inertia\Inertia::render('lots/edit', [
            'lot' => $lot,
            'enums' => [
                'lot_sizes'     => ['20x15','30x20','40x30','50x50','64x64'],
                'content_types' => ['CC','NoCC'],
                'furnishings'   => ['Furnished','Unfurnished'],
                'lot_types'     => ['Residential','Community'],
            ],
        ]);
    }

    public function update(Request $request, Lot $lot)
    {
        abort_unless(auth()->check() && auth()->id() === $lot->user_id, 403);

        $data = $request->validate([
            'name'         => ['required','string','max:255'],
            'description'  => ['nullable','string','max:1000'],
            'creator_id'   => ['nullable','string','max:255'],
            'creator_link' => ['nullable','url','max:255'],
            'lot_size'     => ['required','in:20x15,30x20,40x30,50x50,64x64'],
            'content_type' => ['required','in:CC,NoCC'],
            'furnishing'   => ['required','in:Furnished,Unfurnished'],
            'lot_type'     => ['required','in:Residential,Community'],
            'bedrooms'     => ['nullable','integer','min:0','max:50'],
            'bathrooms'    => ['nullable','integer','min:0','max:50'],
            // новые картинки опционально
            'images'   => ['nullable','array','max:10'],
            'images.*' => ['image','mimes:jpg,jpeg,png,webp','max:8192','dimensions:ratio=16/9,min_width=1280,min_height=720'],
        ]);

        $lot->update($data);

        // Пришли новые изображения? — добавим в конец
        if ($request->hasFile('images')) {
            $files = array_values($request->file('images'));
            $start = (int)$lot->images()->max('position') + 1;

            foreach ($files as $i => $file) {
                $ext  = $file->getClientOriginalExtension();
                $dir  = "images/lots/{$lot->id}";
                $name = \Illuminate\Support\Str::uuid().'.'.$ext;

                \Illuminate\Support\Facades\Storage::disk('s3')->putFileAs($dir, $file, $name);

                \App\Models\LotImage::create([
                    'lot_id'   => $lot->id,
                    'filename' => $name,
                    'position' => $start + $i,
                ]);
            }
        }

        return redirect()->route('lots.view', ['lot' => $lot->id])->with('success', 'Lot updated.');
    }

    public function destroy(Lot $lot)
    {
        abort_unless(auth()->check() && auth()->id() === $lot->user_id, 403);
        $lot->delete();
        return redirect()->route('lots.mine')->with('success', 'Lot deleted.');
    }

    public function mine()
    {
        $userId = request()->user()->id;

        return Inertia::render('lots/mine', [
            'lots' => Lot::query()
                ->where('user_id', $userId)
                ->with(['images', 'user'])
                ->orderByDesc('created_at')
                ->paginate(9)
                ->withQueryString(),
        ]);
    }

    public function store(Request $request)
    {
        $rules = [
            'name'         => ['required','string','max:255'],
            'description'  => ['nullable','string','max:1000'],
            'creator_id'   => ['nullable','string','max:255'],
            'creator_link' => ['nullable','url','max:255'],
            'lot_size'     => ['required','in:20x15,30x20,40x30,50x50,64x64'],
            'content_type' => ['required','in:CC,NoCC'],
            'furnishing'   => ['required','in:Furnished,Unfurnished'],
            'lot_type'     => ['required','in:Residential,Community'],
            'bedrooms'     => ['nullable','integer','min:0','max:50'],
            'bathrooms'    => ['nullable','integer','min:0','max:50'],
            'images'   => ['nullable','array','max:10'],
            'images.*' => [
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:8192',
                'dimensions:ratio=16/9,min_width=1280,min_height=720',
            ],
        ];

        $messages = [
            'images.array'        => 'Images upload must be an array of files.',
            'images.max'          => 'Upload no more than :max images at a time.',
            'images.*.image'      => 'Each file must be an image.',
            'images.*.mimes'      => 'Supported formats: JPG, JPEG, PNG, or WEBP.',
            'images.*.max'        => 'Each image must be no larger than 8 MB.',
            'images.*.dimensions' => 'Each image must be 16:9 and at least 1280×720.',
        ];

        $attributes = [
            'images'   => 'images',
            'images.*' => 'image',
        ];

        $validator = Validator::make($request->all(), $rules, $messages, $attributes);

        $validator->after(function ($v) use ($request) {
            $files = $request->file('images') ?? [];
            $total = is_array($files) ? count($files) : 0;

            $bad = [];
            foreach ($v->errors()->getMessages() as $key => $msgs) {
                if (str_starts_with($key, 'images.') && str_ends_with($key, '.dimensions')) {
                    $parts = explode('.', $key);
                    if (isset($parts[1]) && is_numeric($parts[1])) {
                        $bad[] = (int) $parts[1];
                    }
                }
            }
            $bad = array_values(array_unique($bad));

            if ($total > 0 && count($bad) > 0 && count($bad) < $total && !$v->errors()->has('images')) {
                sort($bad);
                $v->errors()->add(
                    'images',
                    'Some images are not 16:9 (≥1280×720): ' . implode(', ', $bad) . '.'
                );
            }
        });

        $data = $validator->validate();

        $lot = Lot::create([
            'user_id'      => $request->user()->id,
            ...$data,
        ]);

        if ($request->hasFile('images')) {
            /** @var UploadedFile[] $files */
            $files = $request->file('images');

            foreach ($files as $idx => $file) {
                $ext  = $file->getClientOriginalExtension();
                $dir  = "images/lots/{$lot->id}";
                $name = \Illuminate\Support\Str::uuid().'.'.$ext;

                Storage::disk('s3')->putFileAs($dir, $file, $name);

                LotImage::create([
                    'lot_id'   => $lot->id,
                    'filename' => $name,
                    'position' => $idx,
                ]);
            }
        }

        return redirect()
            ->route('dashboard')
            ->with('success', 'Lot created successfully.');
    }
}
