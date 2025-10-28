<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('dashboard', []);
});
//Route::get('/lobbies', [CardsController::class, 'index'])->name('cards.index');
Route::get('/lots/{lot}', [LotController::class, 'show']);
