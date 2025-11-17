<?php

namespace App\Providers;

use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Gate::define('admin', fn ($user) => (bool) ($user->is_admin ?? false));

        if (!app()->runningInConsole()) {
            if (request()->isSecure() || request()->header('x-forwarded-proto') === 'https') {
                URL::forceScheme('https');
            }
        }
    }
}
