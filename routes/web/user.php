<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\UserPublicController;
use App\Http\Controllers\FavoriteController;
use App\Models\User;
use Illuminate\Support\Facades\Route;

Route::get('/users', [UserPublicController::class, 'index'])->name('users.index');
Route::get('/users/{user}', function (User $user) {
    return app(ProfileController::class)->showUser($user, auth()->user());
})->name('users.show');

Route::get('/favourites/{user}', [FavoriteController::class, 'index'])
    ->whereNumber('user')->name('favourites.index');

Route::middleware('auth')->group(function () {
    Route::prefix('profile')->name('profile.')->group(function () {
        Route::get('', [ProfileController::class, 'show'])->name('show');
        Route::get('edit', [ProfileController::class, 'edit'])->name('edit');
        Route::patch('', [ProfileController::class, 'update'])->name('update');
        Route::delete('avatar', [ProfileController::class, 'destroyAvatar'])->name('avatar.destroy');
    });

    Route::prefix('notifications')->name('notifications.')->group(function () {
        Route::post('read-all', [NotificationController::class, 'markAllAsRead'])->name('read-all');
        Route::post('{notification}/read', [NotificationController::class, 'markAsRead'])->name('read');
    });

    Route::get('/settings', [SettingsController::class, 'index'])->name('settings');
});
