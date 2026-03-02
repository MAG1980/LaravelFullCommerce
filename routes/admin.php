<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Middleware\AdminCheckMiddleware;
use Inertia\Inertia;

Route::middleware(['auth', AdminCheckMiddleware::class])->group(function () {
    Route::prefix('admin')->name('admin.')
        ->group(function () {
            Route::resources([
                'users' => UserController::class,
                'admins' => AdminController::class,
            ]);
            /*        Route::get('admins', function () {
                        return Inertia::render('Admins/Admins/Index');
                    })->name('admin');*/

            Route::get('dashboard', function () {
                return Inertia::render('Admin/Dashboard/Index');
            })->name('dashboard');
        });
});
