<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'message' => 'Store Management API',
        'version' => '1.0.0',
        'status' => 'active',
        'endpoints' => [
            'auth' => '/api/auth/login',
            'dashboard' => '/api/dashboard',
            'products' => '/api/products',
            'sales' => '/api/sales',
            'users' => '/api/users',
            'reports' => '/api/reports',
            'settings' => '/api/settings',
        ]
    ]);
});
