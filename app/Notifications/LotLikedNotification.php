<?php

namespace App\Notifications;

use App\Models\Lot;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class LotLikedNotification extends Notification
{
    use Queueable;

    public function __construct(private Lot $lot, private User $liker)
    {
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type'       => 'lot_liked',
            'lot_id'     => $this->lot->id,
            'lot_name'   => $this->lot->name,
            'liker_id'   => $this->liker->id,
            'liker_name' => $this->liker->name,
            'message'    => sprintf('%s liked your lot "%s"', $this->liker->name, $this->lot->name),
            'url'        => route('lots.view', ['lot' => $this->lot->id]),
        ];
    }
}
