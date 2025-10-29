<?php

use App\Http\Controllers\LotController;
use Illuminate\Support\Facades\Route;

Route::get('/dashboard', [LotController::class, 'index'])->name('dashboard');
Route::get('/', fn () => redirect()->route('dashboard'));

Route::get('/lots/{lot}', [LotController::class, 'show'])->name('lots.show');

