<?php

namespace App\Http\Controllers;

use App\Models\Lot;
use App\Models\User;
use App\Notifications\LotLikedNotification;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FavoriteController extends Controller
{
    public function index(Request $request, User $user)
    {
        $targetUser = $user->exists ? $user : $request->user();
        abort_if(! $targetUser, 404);

        $viewerId = optional($request->user())->id;

        $lots = $targetUser->favoriteLots()
            ->withCount(['favoritedBy as favorites_count'])
            ->with(['coverImage:id,lot_id,filename,position', 'user:id,name,avatar'])
            ->when($viewerId, fn($q) => $q->withFavorited($viewerId))
            ->orderByPivot('created_at', 'desc')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('favourites/index', [
            'lots'  => $lots,
            'owner' => [
                'id'         => $targetUser->id,
                'name'       => $targetUser->name,
                'avatar_url' => $targetUser->avatar_url,
            ],
            'isOwner' => $viewerId === $targetUser->id,
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

            if ($lot->user_id !== $user->id) {
                $lot->user?->notify(new LotLikedNotification($lot, $user));
            }
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
