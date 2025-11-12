<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Lot;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserPublicController extends Controller
{
    public function index()
    {
        return Inertia::render('users/index');
    }

    public function search(Request $request)
    {
        $q = trim((string) $request->query('q', ''));
        if ($q === '' || mb_strlen($q) < 2) {
            return response()->json(['data' => []]);
        }

        $term = mb_strtolower($q, 'UTF-8');

        $users = User::query()
            ->select(['id', 'name', 'avatar', 'about', 'created_at'])
            ->whereRaw('LOWER(name) LIKE ?', ['%' . $term . '%'])
            ->orderBy('name')
            ->limit(20)
            ->get()
            ->map(function (User $u) {
                return [
                    'id'         => $u->id,
                    'name'       => $u->name,
                    'avatar_url' => $u->avatar_url,
                    'about'      => $u->about,
                    'created_at' => optional($u->created_at)->toISOString(),
                ];
            });

        return response()->json(['data' => $users]);
    }

    public function show(Request $request, User $user)
    {
        $viewerId = optional($request->user())->id;

        $lotsCount = Lot::where('user_id', $user->id)->count();
        $favouritesCount = $viewerId ? $request->user()->favoriteLots()->count() : 0;

        // последние лоты автора: отдаем оба алиаса
        $latestLots = Lot::query()
            ->where('user_id', $user->id)
            ->with(['images','user'])
            ->withCount([
                'favoritedBy as favorites_total',
                'favoritedBy as favorites_count',
            ])
            ->withFavorited($viewerId) // из трейта Favoritable
            ->latest()
            ->take(12)
            ->get();

        // топ по лайкам: сортируем по нашему total, а также отдаем оба алиаса
        $topLot = Lot::query()
            ->where('user_id', $user->id)
            ->with(['images','user'])
            ->withCount([
                'favoritedBy as favorites_total',
                'favoritedBy as favorites_count',
            ])
            ->withFavorited($viewerId)
            ->orderByDesc('favorites_total')
            ->orderByDesc('updated_at')
            ->first();

        return Inertia::render('profile/show', [
            'user' => $user->only([
                'id','name','avatar_url','about','external_url','sims_gallery_id','created_at'
            ]),
            'stats' => [
                'lots'       => $lotsCount,
                'favourites' => $favouritesCount,
            ],
            'latestLots' => $latestLots,
            'topLot'     => $topLot,   // объект или null
            'isOwner'    => (int) $viewerId === (int) $user->id,
        ]);
    }
}
