<?php

use App\Http\Controllers\LotController;
use App\Http\Controllers\SearchHeaderController;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/dashboard');
Route::get('/dashboard', [LotController::class, 'index'])->name('dashboard');

Route::prefix('header')->name('header.')->group(function () {
    Route::get('search', [SearchHeaderController::class, 'search'])->name('search');
});

require __DIR__ . '/web/auth.php';
require __DIR__ . '/web/lots.php';
require __DIR__ . '/web/user.php';
require __DIR__ . '/web/admin.php';
