<?php

namespace App\Http\Controllers;

use App\Models\Lot;
use App\Models\LotImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'         => ['required','string','max:255'],
            'description'  => ['nullable','string','max:1000'],
            'creator_id'   => ['required','string','max:255'],
            'creator_link' => ['nullable','url','max:255'],
            'lot_size'     => ['required','in:20x15,30x20,40x30,50x50,64x64'],
            'content_type' => ['required','in:CC,NoCC'],
            'furnishing'   => ['required','in:Furnished,Unfurnished'],
            'lot_type'     => ['required','in:Residential,Community'],
            'bedrooms'     => ['nullable','integer','min:0','max:50'],
            'bathrooms'    => ['nullable','integer','min:0','max:50'],

            // файлы:
            'images'       => ['nullable','array','max:20'],
            'images.*'     => ['image','mimes:jpg,jpeg,png,webp','max:8192'], // до ~8MB на файл
        ]);

        // временно без auth:
        $userId = $request->user()->id ?? 1;

        $lot = Lot::create([
            'user_id'      => $userId,
            ...$data,
        ]);

        // Загрузка изображений (если переданы)
        if ($request->hasFile('images')) {
            $files = $request->file('images'); // File[]|UploadedFile[]

            foreach ($files as $idx => $file) {
                // составим читаемый путь: images/lots/{lot_id}/{uuid}.{ext}
                $ext = $file->getClientOriginalExtension();
                $path = "images/lots/{$lot->id}/".Str::uuid().'.'.$ext;

                // кладём в s3 с публичной видимостью
                Storage::disk('s3')->put($path, file_get_contents($file), 'public');

                $url = Storage::disk('s3')->url($path);

                LotImage::create([
                    'lot_id'   => $lot->id,
                    'url'      => $url,
                    'position' => $idx, // порядок как на форме
                ]);
            }
        }

        return redirect()
            ->route('dashboard')
            ->with('success', 'Lot created successfully.');
    }
}
