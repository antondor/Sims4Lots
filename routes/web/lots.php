<?php

use App\Http\Controllers\LotController;
use App\Http\Controllers\LotImageController;
use App\Http\Controllers\FavoriteController;
use Illuminate\Support\Facades\Route;

Route::prefix('lots')->name('lots.')->group(function () {
    Route::get('search', [LotController::class, 'search'])->name('search');
    Route::get('{lot}', [LotController::class, 'view'])->whereNumber('lot')->name('view');
    Route::post('{lot}/download', [LotController::class, 'incrementDownload'])->name('download');
});

Route::middleware('auth')->group(function () {
    Route::get('myLots',   [LotController::class, 'myLots'])->middleware(['auth', 'verified'])->name('myLots');
    Route::prefix('lots')->name('lots.')->middleware(['auth', 'verified'])->group(function () {
        Route::get('create', [LotController::class, 'create'])->name('create');
        Route::post('',      [LotController::class, 'store'])->name('store');
        Route::get('{lot}/edit', [LotController::class, 'edit'])->whereNumber('lot')->name('edit');
        Route::patch('{lot}',    [LotController::class, 'update'])->whereNumber('lot')->name('update');
        Route::delete('{lot}',   [LotController::class, 'destroy'])->whereNumber('lot')->name('destroy');

        Route::prefix('{lot}/images')->whereNumber('lot')->group(function () {
            Route::delete('{image}', [LotImageController::class, 'destroy'])
                ->whereNumber('image')->name('images.destroy');
            Route::patch('{image}/cover', [LotImageController::class, 'setCover'])
                ->whereNumber('image')->name('images.cover');
        });

        Route::post('{lot}/favorite', [FavoriteController::class, 'toggle'])
            ->whereNumber('lot')->name('favorite.toggle');
    });
});
