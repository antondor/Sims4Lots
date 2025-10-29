<?php

namespace App\Http\Controllers;

use App\Models\Lot;
use Inertia\Inertia;

class LotController extends Controller
{
    public function index()
    {
        return Inertia::render('dashboard', [
            'lots' => Lot::query()
                ->orderByRaw('CASE WHEN id = 1 THEN 0 ELSE 1 END')
                ->orderBy('updated_at', 'asc')
                ->with(['images', 'user'])
                ->paginate(9),
        ]);
    }

    // GET /api/lots/{lot}
    public function show(Lot $lot)
    {
        $lot->load(['images' => function ($q) {
            $q->orderBy('position');
        }]);

        return response()->json([
            'lot' => $lot,
        ]);
    }
}
