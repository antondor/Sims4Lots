<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LotImageController;

Route::prefix('lots/{lot}')->group(function () {
    Route::post('/images', [LotImageController::class, 'store']);     // загрузить новую фотку
    Route::delete('/images/{image}', [LotImageController::class, 'destroy']); // удалить фотку
});
