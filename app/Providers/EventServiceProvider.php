<?php

namespace App\Providers;

use App\Listeners\SendVerifyEmailDatabaseNotification;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        Registered::class => [
            SendEmailVerificationNotification::class,
            SendVerifyEmailDatabaseNotification::class,
        ],
    ];

    public function boot(): void
    {
        //
    }
}
