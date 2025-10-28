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
        // тут можно добавить проверку "текущий юзер == $lot->user_id"
        // если у тебя уже есть аутентификация
        // abort_unless(auth()->id() === $lot->user_id, 403);

        $file = $request->file('image');

        // Папка вида lots/123/...
        // 'public' говорит S3 сделать объект доступным публично
        $path = Storage::disk('s3')->putFile(
            "lots/{$lot->id}",
            $file,
            'public'
        );

        // Получаем публично доступный URL
        $url = Storage::disk('s3')->url($path);

        // позицию либо берём из реквеста, либо ставим в конец
        $position = $request->input('position');

        if ($position === null) {
            $lastPos = $lot->images()->max('position');
            $position = $lastPos === null ? 0 : $lastPos + 1;
        }

        $image = LotImage::create([
            'lot_id'   => $lot->id,
            'url'      => $url,
            'position' => $position,
        ]);

        return response()->json([
            'status' => 'ok',
            'image'  => $image,
        ]);
    }

    // DELETE /api/lots/{lot}/images/{image}
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
