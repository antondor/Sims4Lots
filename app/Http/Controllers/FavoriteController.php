<?php

namespace App\Http\Controllers;

use App\Models\Lot;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FavoriteController extends Controller
{
    public function index(Request $request)
    {
        $lots = $request->user()
            ->favoriteLots()
            ->with(['images','user'])
            ->orderByDesc('favorites.created_at')
            ->paginate(9)
            ->withQueryString();

        return Inertia::render('favourites/index', [
            'lots' => $lots,
        ]);
    }

    public function toggle(Request $request, Lot $lot)
    {
        $user = $request->user();

        $exists = $user->favoriteLots()->where('lot_id', $lot->id)->exists();
        if ($exists) {
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
