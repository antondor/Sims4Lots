<?php

namespace App\Http\Controllers;

use App\Models\Lot;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class FavoriteController extends Controller
{
    public function index(Request $request)
    {
        $userId = $request->user()->id;

        $lots = Lot::query()
            ->join('favorites', 'favorites.lot_id', '=', 'lots.id')
            ->where('favorites.user_id', $userId)
            ->select('lots.*')
            ->withCount(['favoritedBy as favorites_count'])
            ->with(['coverImage:id,lot_id,filename,position','user:id,name,avatar'])
            ->withFavorited($userId)
            ->orderByDesc('favorites.created_at')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('favourites/index', ['lots' => $lots]);
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

        return back()->with('success', $status === 'added' ? 'Added to favourites.' : 'Removed from favourites.');
    }
}
