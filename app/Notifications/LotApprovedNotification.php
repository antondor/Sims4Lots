<?php

namespace App\Notifications;

use App\Models\Lot;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class LotApprovedNotification extends Notification
{
    use Queueable;

    public function __construct(private Lot $lot)
    {
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type'     => 'lot_approved',
            'lot_id'   => $this->lot->id,
            'lot_name' => $this->lot->name,
            'message'  => sprintf('"%s" was approved!', $this->lot->name),
            'url'      => route('lots.view', ['lot' => $this->lot->id]),
        ];
    }
}
