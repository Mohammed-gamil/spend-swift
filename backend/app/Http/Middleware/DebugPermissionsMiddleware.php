<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class DebugPermissionsMiddleware
{
    public function handle(Request $request, Closure $next, $permission, $guard = null)
    {
        $user = $request->user();
        $shouldLog = config('app.debug') || env('LOG_PERMISSIONS', false);
        
        if (!$user) {
            if ($shouldLog) {
                Log::info('DebugPermissions: No authenticated user');
            }
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }
        
        // Use specified guard or fall back to default
        $guard = $guard ?? config('auth.defaults.guard');
        
        if ($shouldLog) {
            Log::info('DebugPermissions: User ' . $user->email . ' checking permission ' . $permission);
            Log::info('DebugPermissions: Using guard: ' . $guard);
            
            // Get all user permissions for debugging
            $permissions = $user->getAllPermissions();
            Log::info('DebugPermissions: User has ' . $permissions->count() . ' permissions');
            
            foreach ($permissions as $p) {
                Log::info('DebugPermissions: User has permission: ' . $p->name . ' (guard: ' . $p->guard_name . ')');
            }
        }
        
        $result = $user->hasPermissionTo($permission, $guard);
        
        if ($shouldLog) {
            Log::info('DebugPermissions: Permission check result: ' . ($result ? 'true' : 'false'));
        }
        
        if (!$result) {
            return response()->json(['message' => 'User does not have the right permissions.'], 403);
        }
        
        return $next($request);
    }
}