<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\LotController;
use App\Http\Controllers\LotImageController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\UserPublicController;
use App\Models\User;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/dashboard');

Route::get('/dashboard', [LotController::class, 'index'])->name('dashboard');

Route::get('/users', [UserPublicController::class, 'index'])->name('users.index');
Route::get('/users/search', [UserPublicController::class, 'search'])->name('users.search');
Route::get('/users/{user}', function (User $user) {
    return app(ProfileController::class)->showUser($user, auth()->user());
})->name('users.show');

Route::get('/favourites/{user}', [FavoriteController::class, 'index'])
    ->whereNumber('user')
    ->name('favourites.index');

Route::middleware(['auth'])->group(function () {
    Route::get('/admin/lots/pending', [LotController::class, 'pendingList'])
        ->name('admin.lots.pending');

    Route::post('/admin/lots/{lot}/approve', [LotController::class, 'approve'])
        ->name('admin.lots.approve')
        ->middleware('can:admin');

    Route::post('/admin/lots/{lot}/invalidate', [LotController::class, 'invalidate'])
        ->name('admin.lots.invalidate')
        ->middleware('can:admin');
});


Route::prefix('lots')->name('lots.')->group(function () {
    Route::get('search', [LotController::class, 'search'])->name('search');
    Route::get('{lot}', [LotController::class, 'view'])
        ->whereNumber('lot')
        ->name('view');
});

Route::middleware('guest')->group(function () {
    Route::get('/login',    [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login',   [AuthController::class, 'login'])->name('login.attempt');

    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/register',[AuthController::class, 'register'])->name('register.attempt');
});


Route::middleware('auth')->group(function () {
    Route::prefix('lots')->name('lots.')->group(function () {
        Route::get('create', [LotController::class, 'create'])->name('create');
        Route::get('mine',   [LotController::class, 'mine'])->name('mine');

        Route::post('',      [LotController::class, 'store'])->name('store');
        Route::get('{lot}/edit', [LotController::class, 'edit'])->whereNumber('lot')->name('edit');
        Route::patch('{lot}',    [LotController::class, 'update'])->whereNumber('lot')->name('update');
        Route::delete('{lot}',   [LotController::class, 'destroy'])->whereNumber('lot')->name('destroy');

        Route::prefix('{lot}/images')->whereNumber('lot')->group(function () {
            Route::delete('{image}',        [LotImageController::class, 'destroy'])
                ->whereNumber('image')->name('images.destroy');

            Route::patch('{image}/cover',   [LotImageController::class, 'setCover'])
                ->whereNumber('image')->name('images.cover');
        });

        Route::post('{lot}/favorite', [FavoriteController::class, 'toggle'])
            ->whereNumber('lot')->name('favorite.toggle');
    });

    Route::prefix('profile')->name('profile.')->group(function () {
        Route::get('',        [ProfileController::class, 'show'])->name('show');
        Route::get('edit',    [ProfileController::class, 'edit'])->name('edit');
        Route::patch('',      [ProfileController::class, 'update'])->name('update');
        Route::delete('avatar',[ProfileController::class, 'destroyAvatar'])->name('avatar.destroy');
    });

    Route::get('/settings',   [SettingsController::class, 'index'])->name('settings');
    Route::post('/logout',    [AuthController::class, 'logout'])->name('logout');
});
