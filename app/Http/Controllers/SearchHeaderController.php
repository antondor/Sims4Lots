<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Lot;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SearchHeaderController extends Controller
{
    public function search(Request $request)
    {
        $queryStr = $request->string('q')->trim();

        if ($queryStr->length() < 2) {
            return response()->json(['users' => [], 'lots' => []]);
        }

        $searchTerm = "%{$queryStr}%";

        $lots = Lot::query()
            ->select(['id', 'name', 'updated_at'])
            ->where(function ($q) use ($searchTerm) {
                $q->where('name', 'LIKE', $searchTerm)
                  ->orWhere('description', 'LIKE', $searchTerm);
            })
            ->with(['images' => fn($q) => $q->select('lot_id', 'filename', 'position')->orderBy('position')->limit(1)])
            ->orderByDesc('updated_at')
            ->limit(5)
            ->get()
            ->map(function (Lot $lot) {
                $cover = $lot->images->first();
                if ($cover) {
                    $pathInfo = pathinfo($cover->filename);
                    $thumbFilename = $pathInfo['filename'] . '_thumb.jpg';

                    $coverUrl = Storage::disk('s3')->url("images/lots/{$lot->id}/{$thumbFilename}");
                }

                return [
                    'id'        => $lot->id,
                    'name'      => $lot->name,
                    'cover_url' => $coverUrl,
                ];
            });

        $users = User::query()
            ->select(['id', 'name', 'avatar', 'about', 'short_about', 'created_at', 'last_seen_at'])
            ->where(function ($q) use ($searchTerm) {
                $q->where('name', 'LIKE', $searchTerm);
            })
            ->orderBy('name')
            ->limit(5)
            ->get()
            ->map(fn(User $user) => [
                'id'           => $user->id,
                'name'         => $user->name,
                'avatar_url'   => $user->avatar_url,
                'about'        => $user->about,
                'short_about'  => $user->short_about,
                'created_at'   => $user->created_at?->toIso8601String(),
                'last_seen_at' => $user->last_seen_at?->toIso8601String(),
                'is_online'    => $user->is_online,
            ]);

        return response()->json([
            'users' => $users,
            'lots'  => $lots
        ]);
    }
}
