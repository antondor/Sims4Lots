<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $user = $request->user();

        return array_merge(parent::share($request), [
            'auth' => fn () => [
                'user' => $user ? [
                    'id'          => $user->id,
                    'name'        => $user->name,
                    'email'       => $user->email,
                    'avatar'      => $user->avatar,
                    'avatar_url'  => $user->avatar_url,
                ] : null,
            ],
            'csrf_token' => csrf_token(),
            'flash' => [
                'success' => fn () => session('success'),
                'error'   => fn () => session('error'),
            ],
        ]);
    }
}
