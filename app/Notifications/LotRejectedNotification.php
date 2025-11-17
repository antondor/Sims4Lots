<?php

namespace App\Notifications;

use App\Models\Lot;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class LotRejectedNotification extends Notification
{
    use Queueable;

    public function __construct(private Lot $lot, private ?string $reason = null)
    {
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        $message = sprintf('"%s" was rejected by moderation', $this->lot->name);

        if ($this->reason) {
            $message .= '. Reason: '.$this->reason;
        }

        return [
            'type'     => 'lot_rejected',
            'lot_id'   => $this->lot->id,
            'lot_name' => $this->lot->name,
            'reason'   => $this->reason,
            'message'  => $message,
            'url'      => route('lots.view', ['lot' => $this->lot->id]),
        ];
    }
}
