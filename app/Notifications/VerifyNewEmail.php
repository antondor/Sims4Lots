<?php

namespace App\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\URL;

class VerifyNewEmail extends Notification
{
    use Queueable;

    public function __construct(public int $userId, public string $newEmail) {}

    public function via(object $notifiable): array
    {
        if ($notifiable instanceof User) {
            return ['database'];
        }
        return ['mail'];
    }

    protected function verificationUrl(): string
    {
        return URL::temporarySignedRoute(
            'profile.email.verify',
            now()->addMinutes(60),
            ['hash' => sha1($this->newEmail), 'new_email' => $this->newEmail, 'user' => $this->userId]
        );
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Verify your new email address')
            ->line('You requested to change your email address to ' . $this->newEmail)
            ->action('Verify Email', $this->verificationUrl())
            ->line('If you did not make this request, please ignore this email.');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type'    => 'verify_new_email',
            'message' => "Verification link sent to {$this->newEmail}. Please check your inbox.",
            'url'     => route('profile.show'),
        ];
    }
}
