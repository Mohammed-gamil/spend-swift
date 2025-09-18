<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Services\StatsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StatsController extends Controller
{
    protected $statsService;

    /**
     * StatsController constructor.
     *
     * @param StatsService $statsService
     */
    public function __construct(StatsService $statsService)
    {
        $this->statsService = $statsService;
        
        // Apply role-based middleware with API guard
        $this->middleware('permission:reports.view.team|reports.view.financial|reports.view.all,api');
    }

    /**
     * Get dashboard statistics.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $startDate = $request->get('start_date');
        $endDate = $request->get('end_date');
        $departmentId = $request->get('department_id');
        
        // Get appropriate stats based on user role
        if ($user->hasPermissionTo('reports.view.all')) {
            $stats = $this->statsService->getAllStats($startDate, $endDate, $departmentId);
        } elseif ($user->hasPermissionTo('reports.view.financial')) {
            $stats = $this->statsService->getFinancialStats($startDate, $endDate, $departmentId);
        } elseif ($user->hasPermissionTo('reports.view.team')) {
            $stats = $this->statsService->getTeamStats($user, $startDate, $endDate);
        } else {
            $stats = $this->statsService->getUserStats($user, $startDate, $endDate);
        }
        
        return response()->json($stats);
    }
}