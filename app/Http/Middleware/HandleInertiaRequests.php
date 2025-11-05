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
            'auth' => [
                'user' => $user ? [
                    'id'         => $user->getKey(),
                    'name'       => $user->name,
                    'email'      => $user->email,
                    'avatar'     => $user->avatar,
                    'avatar_url' => $user->avatar_url,
                    'is_admin'   => (bool) $user->is_admin,
                ] : null,
            ],
        ]);
    }
}
