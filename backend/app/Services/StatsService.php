<?php

namespace App\Services;

use App\Models\Request;
use App\Models\User;
use App\Models\Department;
use App\Models\Budget;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class StatsService
{
    /**
     * Get statistics for the dashboard based on the user's role.
     *
     * @return array
     */
    public function getDashboardStats(): array
    {
        $user = Auth::user();
        
        if ($user->hasRole(['ADMIN', 'FINAL_MANAGER'])) {
            return $this->getAdminStats();
        } elseif ($user->hasRole('DIRECT_MANAGER')) {
            return $this->getManagerStats($user->id);
        } elseif ($user->hasRole('ACCOUNTANT')) {
            return $this->getAccountantStats();
        } else {
            return $this->getUserStats($user->id);
        }
    }
    
    /**
     * Get statistics for admin and final manager dashboard.
     *
     * @return array
     */
    public function getAdminStats(): array
    {
        // Get total request counts by status
        $requestCounts = Request::select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->pluck('total', 'status')
            ->toArray();
        
        // Get request count by type
        $requestTypeCount = Request::select('request_type', DB::raw('count(*) as total'))
            ->groupBy('request_type')
            ->pluck('total', 'request_type')
            ->toArray();
        
        // Get total amount by department
        $departmentAmounts = Request::join('departments', 'requests.department_id', '=', 'departments.id')
            ->where('status', 'FUNDS_TRANSFERRED')
            ->select('departments.name', DB::raw('sum(requests.total_amount) as total'))
            ->groupBy('departments.name')
            ->pluck('total', 'name')
            ->toArray();
        
        // Get request trend by month (last 6 months)
        $sixMonthsAgo = Carbon::now()->subMonths(6);
        $requestTrend = Request::select(
                DB::raw('YEAR(created_at) as year'),
                DB::raw('MONTH(created_at) as month'),
                DB::raw('count(*) as total')
            )
            ->where('created_at', '>=', $sixMonthsAgo)
            ->groupBy('year', 'month')
            ->orderBy('year')
            ->orderBy('month')
            ->get()
            ->map(function ($item) {
                return [
                    'month' => Carbon::createFromDate($item->year, $item->month, 1)->format('M Y'),
                    'count' => $item->total
                ];
            })
            ->pluck('count', 'month')
            ->toArray();
        
        // Get budget utilization
        $budgetUtilization = Budget::join('departments', 'budgets.department_id', '=', 'departments.id')
            ->select(
                'departments.name',
                'budgets.total_amount',
                'budgets.spent_amount',
                DB::raw('(budgets.spent_amount / budgets.total_amount) * 100 as percentage')
            )
            ->where('budgets.fiscal_year', date('Y'))
            ->get()
            ->map(function ($item) {
                return [
                    'department' => $item->name,
                    'total' => $item->total_amount,
                    'spent' => $item->spent_amount,
                    'remaining' => $item->total_amount - $item->spent_amount,
                    'percentage' => round($item->percentage, 2)
                ];
            })
            ->toArray();
        
        return [
            'request_counts' => $requestCounts,
            'request_type_count' => $requestTypeCount,
            'department_amounts' => $departmentAmounts,
            'request_trend' => $requestTrend,
            'budget_utilization' => $budgetUtilization,
            'total_users' => User::count(),
            'total_departments' => Department::count(),
            'total_requests' => Request::count(),
            'total_pending_approvals' => Request::whereIn('status', ['SUBMITTED', 'DM_APPROVED', 'ACCT_APPROVED'])->count()
        ];
    }
    
    /**
     * Get statistics for direct manager dashboard.
     *
     * @param int $managerId
     * @return array
     */
    public function getManagerStats(int $managerId): array
    {
        // Get team member IDs
        $teamMemberIds = User::where('reports_to', $managerId)->pluck('id')->toArray();
        $teamMemberIds[] = $managerId;
        
        // Get team requests by status
        $requestCounts = Request::whereIn('user_id', $teamMemberIds)
            ->select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->pluck('total', 'status')
            ->toArray();
        
        // Get pending approvals count
        $pendingApprovalCount = Request::where('status', 'SUBMITTED')
            ->whereIn('user_id', $teamMemberIds)
            ->count();
        
        // Get team request trend by month (last 6 months)
        $sixMonthsAgo = Carbon::now()->subMonths(6);
        $requestTrend = Request::select(
                DB::raw('YEAR(created_at) as year'),
                DB::raw('MONTH(created_at) as month'),
                DB::raw('count(*) as total')
            )
            ->whereIn('user_id', $teamMemberIds)
            ->where('created_at', '>=', $sixMonthsAgo)
            ->groupBy('year', 'month')
            ->orderBy('year')
            ->orderBy('month')
            ->get()
            ->map(function ($item) {
                return [
                    'month' => Carbon::createFromDate($item->year, $item->month, 1)->format('M Y'),
                    'count' => $item->total
                ];
            })
            ->pluck('count', 'month')
            ->toArray();
        
        // Get team member statistics
        $teamMemberStats = User::whereIn('id', $teamMemberIds)
            ->with(['requests' => function ($query) {
                $query->select('user_id', 'status', DB::raw('count(*) as total'))
                    ->groupBy('user_id', 'status');
            }])
            ->get()
            ->map(function ($user) {
                $statusCounts = collect($user->requests)->pluck('total', 'status')->toArray();
                
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'request_counts' => $statusCounts
                ];
            })
            ->toArray();
        
        return [
            'request_counts' => $requestCounts,
            'pending_approvals' => $pendingApprovalCount,
            'request_trend' => $requestTrend,
            'team_members' => $teamMemberStats,
            'total_team_members' => count($teamMemberIds) - 1, // Exclude the manager
            'total_team_requests' => Request::whereIn('user_id', $teamMemberIds)->count()
        ];
    }
    
    /**
     * Get statistics for accountant dashboard.
     *
     * @return array
     */
    public function getAccountantStats(): array
    {
        // Get pending review count
        $pendingReviewCount = Request::where('status', 'DM_APPROVED')->count();
        
        // Get budget utilization
        $budgetUtilization = Budget::join('departments', 'budgets.department_id', '=', 'departments.id')
            ->select(
                'departments.name',
                'budgets.total_amount',
                'budgets.spent_amount',
                DB::raw('(budgets.spent_amount / budgets.total_amount) * 100 as percentage')
            )
            ->where('budgets.fiscal_year', date('Y'))
            ->get()
            ->map(function ($item) {
                return [
                    'department' => $item->name,
                    'total' => $item->total_amount,
                    'spent' => $item->spent_amount,
                    'remaining' => $item->total_amount - $item->spent_amount,
                    'percentage' => round($item->percentage, 2)
                ];
            })
            ->toArray();
        
        // Get request amount by department
        $departmentAmounts = Request::join('departments', 'requests.department_id', '=', 'departments.id')
            ->where('status', 'FUNDS_TRANSFERRED')
            ->select('departments.name', DB::raw('sum(requests.total_amount) as total'))
            ->groupBy('departments.name')
            ->pluck('total', 'name')
            ->toArray();
        
        // Get monthly spending trend
        $sixMonthsAgo = Carbon::now()->subMonths(6);
        $spendingTrend = Request::select(
                DB::raw('YEAR(updated_at) as year'),
                DB::raw('MONTH(updated_at) as month'),
                DB::raw('sum(total_amount) as total')
            )
            ->where('status', 'FUNDS_TRANSFERRED')
            ->where('updated_at', '>=', $sixMonthsAgo)
            ->groupBy('year', 'month')
            ->orderBy('year')
            ->orderBy('month')
            ->get()
            ->map(function ($item) {
                return [
                    'month' => Carbon::createFromDate($item->year, $item->month, 1)->format('M Y'),
                    'amount' => $item->total
                ];
            })
            ->pluck('amount', 'month')
            ->toArray();
        
        return [
            'pending_review' => $pendingReviewCount,
            'budget_utilization' => $budgetUtilization,
            'department_amounts' => $departmentAmounts,
            'spending_trend' => $spendingTrend,
            'total_approved' => Request::whereIn('status', ['ACCT_APPROVED', 'FINAL_APPROVED', 'FUNDS_TRANSFERRED'])->count(),
            'total_rejected' => Request::where('status', 'REJECTED')->count()
        ];
    }
    
    /**
     * Get statistics for regular user dashboard.
     *
     * @param int $userId
     * @return array
     */
    public function getUserStats(int $userId): array
    {
        // Get request counts by status
        $requestCounts = Request::where('user_id', $userId)
            ->select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->pluck('total', 'status')
            ->toArray();
        
        // Get request count by type
        $requestTypeCount = Request::where('user_id', $userId)
            ->select('request_type', DB::raw('count(*) as total'))
            ->groupBy('request_type')
            ->pluck('total', 'request_type')
            ->toArray();
        
        // Get request trend by month (last 6 months)
        $sixMonthsAgo = Carbon::now()->subMonths(6);
        $requestTrend = Request::select(
                DB::raw('YEAR(created_at) as year'),
                DB::raw('MONTH(created_at) as month'),
                DB::raw('count(*) as total')
            )
            ->where('user_id', $userId)
            ->where('created_at', '>=', $sixMonthsAgo)
            ->groupBy('year', 'month')
            ->orderBy('year')
            ->orderBy('month')
            ->get()
            ->map(function ($item) {
                return [
                    'month' => Carbon::createFromDate($item->year, $item->month, 1)->format('M Y'),
                    'count' => $item->total
                ];
            })
            ->pluck('count', 'month')
            ->toArray();
        
        // Get recent requests
        $recentRequests = Request::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($request) {
                return [
                    'id' => $request->id,
                    'title' => $request->title,
                    'status' => $request->status,
                    'request_type' => $request->request_type,
                    'total_amount' => $request->total_amount,
                    'created_at' => $request->created_at->format('M d, Y')
                ];
            })
            ->toArray();
        
        return [
            'request_counts' => $requestCounts,
            'request_type_count' => $requestTypeCount,
            'request_trend' => $requestTrend,
            'recent_requests' => $recentRequests,
            'total_requests' => Request::where('user_id', $userId)->count(),
            'total_approved' => Request::where('user_id', $userId)->where('status', 'FUNDS_TRANSFERRED')->count(),
            'total_pending' => Request::where('user_id', $userId)
                ->whereIn('status', ['SUBMITTED', 'DM_APPROVED', 'ACCT_APPROVED', 'FINAL_APPROVED'])
                ->count(),
            'total_rejected' => Request::where('user_id', $userId)->where('status', 'REJECTED')->count()
        ];
    }
}