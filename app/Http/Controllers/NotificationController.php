<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Notifications\DatabaseNotification;

class NotificationController extends Controller
{
    public function markAllAsRead(Request $request)
    {
        $user = $request->user();
        abort_unless($user, 403);

        $user->unreadNotifications->markAsRead();

        if ($request->wantsJson()) {
            return response()->json(['status' => 'ok']);
        }

        return back();
    }

    public function markAsRead(Request $request, DatabaseNotification $notification)
    {
        $user = $request->user();

        abort_unless(
            $user &&
            $notification->notifiable_id === $user->getKey() &&
            $notification->notifiable_type === get_class($user),
            403
        );

        if (is_null($notification->read_at)) {
            $notification->markAsRead();
        }

        if ($request->wantsJson()) {
            return response()->json(['status' => 'ok']);
        }

        return back();
    }
}
