<?php

use App\Models\Lot;

class LotController extends Controller
{
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
