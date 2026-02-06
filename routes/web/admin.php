<?php

use App\Http\Controllers\LotController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'can:admin'])->middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/lots/pending', [LotController::class, 'pendingList'])->name('lots.pending');
    Route::post('/lots/{lot}/approve', [LotController::class, 'approve'])->name('lots.approve');
    Route::post('/lots/{lot}/invalidate', [LotController::class, 'invalidate'])->name('lots.invalidate');
});
