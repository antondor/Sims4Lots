<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Http;

class CardsController extends Controller
{

    public function index()
    {
//        $lobbies = Lobby::with('users', 'owner')->get();

//        return Inertia::render('dashboard', [
//            'lobbies' => Lobby::where('is_closed', 0)
//                ->orderByRaw('CASE WHEN id = 1 THEN 0 ELSE 1 END')
//                ->orderBy('updated_at', 'asc')
//                ->with(['owner', 'users'])
//                ->paginate(9)
//        ]);

    }

    public function store(Request $request)
    {
    }

    public function show(Lobby $lobby)
    {
    }


    public function destroy(Lobby $lobby)
    {
    }
}
