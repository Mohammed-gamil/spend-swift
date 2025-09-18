<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;

class HealthController extends Controller
{
    /**
     * Health check endpoint.
     */
    public function check(): JsonResponse
    {
        return response()->json([
            'status' => 'ok',
            'timestamp' => now(),
            'service' => 'SpendSwift API'
        ]);
    }

    /**
     * Ready check endpoint.
     */
    public function ready(): JsonResponse
    {
        return response()->json([
            'status' => 'ready',
            'timestamp' => now(),
            'database' => 'connected'
        ]);
    }

    /**
     * Live check endpoint.
     */
    public function live(): JsonResponse
    {
        return response()->json([
            'status' => 'live',
            'timestamp' => now()
        ]);
    }
}