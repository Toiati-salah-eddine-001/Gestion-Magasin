<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\SaleController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\SettingController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Gate;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes (no authentication required)
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::put('/password', [AuthController::class, 'changePassword']);
});

// Dashboard routes
Route::prefix('dashboard')->group(function () {
    Route::get('/', [DashboardController::class, 'index']);
    Route::get('/sales-chart', [DashboardController::class, 'salesChart']);
    Route::get('/top-products', [DashboardController::class, 'topProducts']);
});

// Product routes
Route::prefix('products')->group(function () {
    Route::get('/', [ProductController::class, 'index']);
    Route::post('/', [ProductController::class, 'store']);
    Route::get('/search', [ProductController::class, 'search']);
    Route::get('/barcode', [ProductController::class, 'getByBarcode']);
    Route::get('/{product}', [ProductController::class, 'show']);
    Route::put('/{product}', [ProductController::class, 'update']);
    Route::delete('/{product}', [ProductController::class, 'destroy']);
    Route::put('/{product}/stock', [ProductController::class, 'updateStock']);
});

// Sale routes
Route::prefix('sales')->group(function () {
    Route::get('/', [SaleController::class, 'index']);
    Route::post('/', [SaleController::class, 'store']);
    Route::get('/statistics', [SaleController::class, 'statistics']);
    Route::get('/{sale}', [SaleController::class, 'show']);
    Route::put('/{sale}/status', [SaleController::class, 'updateStatus']);
});

// User management routes (admin only, now public)
Route::prefix('users')->group(function () {
    Route::get('/', [UserController::class, 'index']);
    Route::post('/', [UserController::class, 'store']);
    Route::get('/statistics', [UserController::class, 'statistics']);
    Route::get('/{user}', [UserController::class, 'show']);
    Route::put('/{user}', [UserController::class, 'update']);
    Route::delete('/{user}', [UserController::class, 'destroy']);
    Route::put('/{user}/reset-password', [UserController::class, 'resetPassword']);
    Route::put('/{user}/toggle-status', [UserController::class, 'toggleStatus']);
});

// Report routes
Route::prefix('reports')->group(function () {
    Route::get('/sales', [ReportController::class, 'salesReport']);
    Route::get('/inventory', [ReportController::class, 'inventoryReport']);
    Route::get('/profit-loss', [ReportController::class, 'profitLossReport']);
});

// Settings routes (admin only, now public)
Route::prefix('settings')->group(function () {
    Route::get('/', [SettingController::class, 'index']);
    Route::get('/{key}', [SettingController::class, 'show']);
    Route::put('/', [SettingController::class, 'update']);
    Route::put('/store', [SettingController::class, 'updateStore']);
    Route::put('/printing', [SettingController::class, 'updatePrinting']);
    Route::put('/system', [SettingController::class, 'updateSystem']);
    Route::post('/reset', [SettingController::class, 'reset']);
});

// Health check route
Route::get('/health', function () {
    return response()->json([
        'success' => true,
        'message' => 'API is working',
        'timestamp' => now()->toISOString(),
    ]);
});
