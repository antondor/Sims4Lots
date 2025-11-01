<?php

use App\Http\Controllers\LotController;
use Illuminate\Support\Facades\Route;

Route::get('/dashboard', [LotController::class, 'index'])->name('dashboard');
Route::get('/', fn () => redirect()->route('dashboard'));

//Route::middleware('auth')->group(function () {
Route::get('/lots/create', [LotController::class, 'create'])->name('lots.create');
Route::post('/lots', [LotController::class, 'store'])->name('lots.store');
//});

Route::get('/lots/{lot}', [LotController::class, 'show'])->name('lots.show');
