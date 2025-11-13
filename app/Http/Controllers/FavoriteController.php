<?php

namespace App\Http\Controllers;

use App\Models\Lot;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FavoriteController extends Controller
{
    public function index(Request $request, User $user)
    {
        $viewerId = optional($request->user())->id;

        $lots = Lot::query()
            ->join('favorites', 'favorites.lot_id', '=', 'lots.id')
            ->where('favorites.user_id', $user->id)
            ->select('lots.*')
            ->withCount(['favoritedBy as favorites_count'])
            ->with(['coverImage:id,lot_id,filename,position', 'user:id,name,avatar'])
            ->when($viewerId, fn ($q) => $q->withFavorited($viewerId))
            ->orderByDesc('favorites.created_at')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('favourites/index', [
            'lots'    => $lots,
            'owner'   => [
                'id'         => $user->id,
                'name'       => $user->name,
                'avatar_url' => $user->avatar_url,
            ],
            'isOwner' => $viewerId !== null && $viewerId === $user->id,
        ]);
    }

    public function toggle(Request $request, Lot $lot)
    {
        $user = $request->user();

        if ($user->favoriteLots()->where('lots.id', $lot->id)->exists()) {
            $user->favoriteLots()->detach($lot->id);
            $status = 'removed';
        } else {
            $user->favoriteLots()->attach($lot->id);
            $status = 'added';
        }

        if ($request->wantsJson()) {
            return response()->json(['status' => 'ok', 'action' => $status]);
        }

        return back()->with(
            'success',
            $status === 'added' ? 'Added to favourites' : 'Removed from favourites'
        );
    }
}
