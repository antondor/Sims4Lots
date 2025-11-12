<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Lot;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
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


    public function show(User $user)
    {
        $lotsCount = Lot::where('user_id', $user->id)->count();
        $favouritesCount = 0;

        $latestLots = Lot::with(['images','user'])
            ->where('user_id', $user->id)
            ->latest()
            ->take(6)
            ->get();

        return Inertia::render('profile/show', [
            'user' => $user->only([
                'id','name','avatar_url','about','external_url','sims_gallery_id','created_at'
            ]),
            'stats' => [
                'lots' => $lotsCount,
                'favourites' => $favouritesCount,
            ],
            'latestLots' => $latestLots,
            'isOwner' => auth()->check() && auth()->id() === $user->id,
        ]);
    }
}
