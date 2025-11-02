<?php

namespace App\Http\Controllers;

use App\Http\Requests\UploadLotImageRequest;
use App\Models\Lot;
use App\Models\LotImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class LotImageController extends Controller
{
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

    public function setCover(Request $request, Lot $lot, LotImage $image)
    {
        abort_if($image->lot_id !== $lot->id, 404);

        DB::transaction(function () use ($lot, $image) {
            $others = $lot->images()->where('id', '!=', $image->id)->orderBy('position')->get();
            $pos = 1;
            foreach ($others as $img) {
                $img->update(['position' => $pos++]);
            }
            $image->update(['position' => 0]);
        });

        if ($request->expectsJson() || $request->wantsJson()) {
            return response()->json(['status' => 'ok']);
        }

        return back()->with('success', 'Cover image updated.');
    }

    public function destroy(Request $request, Lot $lot, LotImage $image)
    {
        abort_if($image->lot_id !== $lot->id, 404);

        Storage::disk('s3')->delete($image->s3_key ?? "images/lots/{$lot->id}/{$image->filename}");
        $image->delete();

        if ($request->expectsJson() || $request->wantsJson()) {
            return response()->json(['status' => 'ok']);
        }

        return back()->with('success', 'Image deleted.');
    }

}
