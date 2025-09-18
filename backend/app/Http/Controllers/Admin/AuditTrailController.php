<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\AuditTrailResource;
use App\Models\AuditTrail;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AuditTrailController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return AnonymousResourceCollection
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = AuditTrail::with(['user']);
        
        // Filter by user
        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }
        
        // Filter by action
        if ($request->has('action')) {
            $query->where('action', 'like', "%{$request->action}%");
        }
        
        // Filter by entity type
        if ($request->has('entity_type')) {
            $query->where('loggable_type', 'like', "%{$request->entity_type}%");
        }
        
        // Filter by date range
        if ($request->has('start_date')) {
            $query->whereDate('created_at', '>=', $request->start_date);
        }
        
        if ($request->has('end_date')) {
            $query->whereDate('created_at', '<=', $request->end_date);
        }
        
        // Sort by most recent first
        $query->latest();
        
        $auditTrails = $query->paginate($request->get('per_page', 15));
        
        return AuditTrailResource::collection($auditTrails);
    }

    /**
     * Display the specified resource.
     *
     * @param AuditTrail $auditTrail
     * @return JsonResponse
     */
    public function show(AuditTrail $auditTrail): JsonResponse
    {
        $auditTrail->load(['user']);
        
        return response()->json([
            'audit_trail' => new AuditTrailResource($auditTrail)
        ]);
    }
}