<?php

namespace App\Http\Controllers;

use App\Http\Requests\UploadLotImageRequest;
use App\Models\Lot;
use App\Models\LotImage;
use Illuminate\Support\Facades\Storage;

class LotImageController extends Controller
{
    // POST /api/lots/{lot}/images
    public function store(UploadLotImageRequest $request, Lot $lot)
    {
        $file = $request->file('image');
        $ext  = $file->getClientOriginalExtension();
        $name = Str::uuid() . '.' . $ext;
        $dir = "images/lots/{$lot->id}";

        Storage::disk('s3')->putFileAs($dir, $file, $name);

        $position = $request->input('position');
        if ($position === null) {
            $last = $lot->images()->max('position');
            $position = $last === null ? 0 : $last + 1;
        }

        $image = LotImage::create([
            'lot_id'   => $lot->id,
            'filename' => $name,
            'position' => (int) $position,
        ]);

        return response()->json([
            'status' => 'ok',
            'image'  => $image,
        ], 201);
    }

    public function destroy(Lot $lot, LotImage $image)
    {
        // проверка что эта картинка принадлежит этому лоту
        if ($image->lot_id !== $lot->id) {
            abort(404);
        }

        // По желанию можно удалять сам файл из S3,
        // Либо оставить, если не хочешь чистить бакет.
        // Если чистим:
        //
        // нам нужно получить key внутри бакета.
        // У нас в БД хранится полный URL, типа:
        // https://bucket.s3.region.amazonaws.com/lots/123/asdf.jpg
        // Нужно вырезать префикс AWS_URL.
        $bucketUrl = rtrim(config('filesystems.disks.s3.url'), '/'); // env('AWS_URL')

        if ($bucketUrl && str_starts_with($image->url, $bucketUrl)) {
            $key = ltrim(substr($image->url, strlen($bucketUrl)), '/');
            if ($key) {
                Storage::disk('s3')->delete($key);
            }
        }

        $image->delete();

        return response()->json([
            'status' => 'ok',
        ]);
    }
}
