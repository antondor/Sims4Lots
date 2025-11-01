<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\LotController;
use Illuminate\Support\Facades\Route;

Route::get('/', fn () => redirect()->route('dashboard'));
Route::get('/dashboard', [LotController::class, 'index'])->name('dashboard');

Route::get('/lots/{lot}', [LotController::class, 'show'])
    ->whereNumber('lot')
    ->name('lots.show');

// Гостевые (только для незалогиненных)
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login'])->name('login.attempt');

    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'register'])->name('register.attempt');
});

// Только для залогиненных
Route::middleware('auth')->group(function () {
    Route::get('/lots/create', [LotController::class, 'create'])->name('lots.create');
    Route::post('/lots', [LotController::class, 'store'])->name('lots.store');

    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
});
