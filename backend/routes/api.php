<?php

use App\Http\Controllers\Admin\DepartmentController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\BudgetController;
use App\Http\Controllers\Admin\AuditTrailController;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\Dashboard\StatsController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\RequestController;
use App\Http\Controllers\AttachmentController;
use App\Http\Controllers\HealthController;
use Illuminate\Support\Facades\Route;

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

// Health Check Routes (no authentication required)
Route::get('/health', [HealthController::class, 'check']);
Route::get('/ready', [HealthController::class, 'ready']);
Route::get('/live', [HealthController::class, 'live']);

// Authentication Routes
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    
    // Protected routes
    Route::middleware('auth:api')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/profile', [AuthController::class, 'profile']);
        Route::post('/refresh', [AuthController::class, 'refresh']);
    });
});

// Protected API Routes
Route::middleware('auth:api')->group(function () {
    // Request Routes
    Route::prefix('requests')->group(function () {
        // Basic CRUD operations
        Route::get('/', [RequestController::class, 'index'])->middleware('permission:requests.view.own,api');
        Route::post('/', [RequestController::class, 'store'])->middleware('permission:requests.create,api');
        Route::get('/{request}', [RequestController::class, 'show'])->middleware('permission:requests.view.own,api');
        Route::put('/{request}', [RequestController::class, 'update'])->middleware('permission:requests.edit.own,api');
        Route::delete('/{request}', [RequestController::class, 'destroy'])->middleware('permission:requests.delete.own,api');
        
        // State Machine Actions
        Route::post('/{request}/submit', [RequestController::class, 'submit'])
            ->middleware('permission:requests.submit.own,api');
        Route::post('/{request}/approve', [RequestController::class, 'approve'])
            ->middleware('permission:requests.approve,api');
        Route::post('/{request}/reject', [RequestController::class, 'reject'])
            ->middleware('permission:requests.reject,api');
        Route::post('/{request}/return', [RequestController::class, 'return'])
            ->middleware('permission:requests.return,api');
        Route::post('/{request}/cancel', [RequestController::class, 'cancel'])->middleware('permission:requests.cancel.own,api');
        
        // Attachments
        Route::post('/{request}/attachments', [AttachmentController::class, 'store'])
            ->middleware('permission:requests.attachments.add,api');
        Route::delete('/attachments/{attachment}', [AttachmentController::class, 'destroy'])
            ->middleware('permission:requests.attachments.delete,api');
    });
    
    // Attachment download
    Route::get('/attachments/{attachment}/download', [AttachmentController::class, 'download'])
        ->middleware('permission:requests.attachments.view,api');
    
    // Dashboard & Analytics
    Route::prefix('dashboard')->group(function () {
        Route::get('/stats', [StatsController::class, 'index'])
            ->middleware('permission:dashboard.view,api');
    });
    
    // Notifications
    Route::prefix('notifications')->group(function () {
        Route::get('/', [NotificationController::class, 'index'])
            ->middleware('permission:notifications.view,api');
        Route::post('/{notification}/read', [NotificationController::class, 'markAsRead'])
            ->middleware('permission:notifications.update,api');
        Route::post('/read-all', [NotificationController::class, 'markAllAsRead'])
            ->middleware('permission:notifications.update,api');
    });
    
    // Admin routes
    Route::prefix('admin')->middleware('role:ADMIN')->group(function () {
        // Users
        Route::apiResource('users', UserController::class);
        Route::post('/users/{user}/assign-role', [UserController::class, 'assignRole']);
        
        // Roles and permissions
        Route::apiResource('roles', RoleController::class);
        
        // Departments
        Route::apiResource('departments', DepartmentController::class);
        
        // Budgets
        Route::apiResource('budgets', BudgetController::class);
        
        // Audit Trail
        Route::get('/audit-trail', [AuditTrailController::class, 'index']);
        Route::get('/audit-trail/{auditTrail}', [AuditTrailController::class, 'show']);
    });
});