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
    ->name('favourites.index');

Route::middleware('auth')->group(function () {
    Route::prefix('profile')->name('profile.')->middleware(['auth', 'verified'])->group(function () {
        Route::get('', [ProfileController::class, 'show'])->name('show');
        Route::get('edit', [ProfileController::class, 'edit'])->name('edit');
        Route::patch('', [ProfileController::class, 'update'])->name('update');
        Route::delete('avatar', [ProfileController::class, 'destroyAvatar'])->name('avatar.destroy');
    });

    Route::get('/profile/email/verify/{hash}', [ProfileController::class, 'verifyEmailChange'])
        ->name('profile.email.verify')
        ->middleware('signed');

    Route::delete('/profile/email/cancel', [ProfileController::class, 'cancelEmailChange'])
        ->name('profile.email.cancel');

    Route::prefix('notifications')->name('notifications.')->group(function () {
        Route::post('read-all', [NotificationController::class, 'markAllAsRead'])->name('read-all');
        Route::post('{notification}/read', [NotificationController::class, 'markAsRead'])->name('read');
    });

    Route::get('/settings', [SettingsController::class, 'index'])->name('settings');
});
