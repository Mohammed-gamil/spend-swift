<?php

use App\Http\Controllers\API\PurchaseRequestController;
use App\Http\Controllers\API\ProjectController;
use App\Http\Controllers\API\AuthController;

// Public auth endpoints
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

// In testing we use the default auth guard to simplify feature tests; otherwise use JWT 'auth:api' guard
Route::middleware([app()->environment('testing') ? 'auth' : 'auth:api'])->group(function () {
    Route::apiResource('purchase-requests', PurchaseRequestController::class);
    Route::put('purchase-requests/{purchase_request}/approve', [PurchaseRequestController::class, 'approve']);
    Route::put('purchase-requests/{purchase_request}/reject', [PurchaseRequestController::class, 'reject']);
    Route::post('purchase-requests/{purchase_request}/offers', [\App\Http\Controllers\API\PriceOfferController::class, 'store']);
    Route::put('offers/{offer}/accept', [\App\Http\Controllers\API\PriceOfferController::class, 'accept']);
    // Auth helper routes
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('refresh', [AuthController::class, 'refresh']);
    Route::get('me', [AuthController::class, 'me']);
    Route::apiResource('projects', ProjectController::class);
});