<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
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
                    'id'           => $u->id,
                    'name'         => $u->name,
                    'avatar_url'   => $u->avatar_url,
                    'about'        => $u->about,
                    'short_about'  => $u->short_about,
                    'created_at'   => optional($u->created_at)->toISOString(),
                    'last_seen_at' => $u->last_seen_at?->toIso8601String(),
                    'is_online'    => $u->is_online,
                ];
            });

        return response()->json(['data' => $users]);
    }
}
