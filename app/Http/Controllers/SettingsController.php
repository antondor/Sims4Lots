<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('settings/index', [
            'user' => [
                'id'         => $request->user()->id,
                'name'       => $request->user()->name,
                'email'      => $request->user()->email,
                'avatar_url' => $request->user()->avatar_url,
            ],
        ]);
    }
}
