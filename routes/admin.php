<?php

use App\Http\Middleware\AdminCheckMiddleware;

Route::middleware(['auth', AdminCheckMiddleware::class])->group(function () {
    Route::prefix('admin')->name('admin.')->group(function () {
    });
});
