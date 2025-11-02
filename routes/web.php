<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\LotController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SettingsController;
use Illuminate\Support\Facades\Route;

Route::get('/', fn () => redirect()->route('dashboard'));
Route::get('/dashboard', [LotController::class, 'index'])->name('dashboard');
Route::get('/lots/{lot}', [LotController::class, 'view'])->name('lots.view');

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login'])->name('login.attempt');

    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'register'])->name('register.attempt');
});

Route::middleware('auth')->group(function () {
    Route::get('/lots/create', [LotController::class, 'create'])->name('lots.create');
    Route::get('/lots/mine', [LotController::class, 'mine'])->name('lots.mine');
    Route::post('/lots/{lot}/favorite', [FavoriteController::class, 'toggle'])->name('lots.favorite.toggle');
    Route::post('/lots', [LotController::class, 'store'])->name('lots.store');
    Route::get('/lots/{lot}/edit', [LotController::class, 'edit'])->name('lots.edit');
    Route::patch('/lots/{lot}',      [LotController::class, 'update'])->name('lots.update');
    Route::delete('/lots/{lot}',     [LotController::class, 'destroy'])->name('lots.destroy');
    Route::delete('/lots/{lot}/images/{image}', [\App\Http\Controllers\LotImageController::class, 'destroy'])
        ->name('lots.images.destroy');
    Route::patch('/lots/{lot}/images/{image}/cover', [\App\Http\Controllers\LotImageController::class, 'setCover'])
        ->name('lots.images.cover');

    Route::get('/profile',        [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile',      [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile/avatar', [ProfileController::class, 'destroyAvatar'])->name('profile.avatar.destroy');

    Route::get('/favourites', [FavoriteController::class, 'index'])->name('favourites.index');
    Route::get('/settings', [SettingsController::class, 'index'])->name('settings');
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
});
