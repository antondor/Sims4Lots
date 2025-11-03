<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Lot;
use Inertia\Inertia;

class UserPublicController extends Controller
{
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
