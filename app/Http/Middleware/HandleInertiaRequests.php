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
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error'   => fn () => $request->session()->get('error'),
                'warning' => fn () => $request->session()->get('warning'),
                'info'    => fn () => $request->session()->get('info'),
            ],
            'notifications' => $user ? fn () => [
                'unread_count' => $user->unreadNotifications()->count(),
                'items'        => $user->notifications()
                    ->latest()
                    ->limit(10)
                    ->get()
                    ->map(function ($notification) {
                        $data = $notification->data ?? [];

                        return [
                            'id'         => $notification->id,
                            'type'       => $data['type'] ?? $notification->type,
                            'message'    => $data['message'] ?? '',
                            'url'        => $data['url'] ?? null,
                            'created_at' => $notification->created_at,
                            'read_at'    => $notification->read_at,
                        ];
                    })
                    ->values()
                    ->all(),
            ] : null,
        ]);
    }
}
