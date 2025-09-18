<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Department;
use App\Models\Budget;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

class DashboardStatsTest extends TestCase
{
    use RefreshDatabase;

    public function setUp(): void
    {
        parent::setUp();
        $this->artisan('migrate:fresh --seed');
    }

    public function test_admin_can_access_dashboard_stats()
    {
        $admin = User::where('email', 'admin@spendswift.com')->first();
        Sanctum::actingAs($admin);

        $response = $this->getJson('/api/dashboard/stats');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'data' => [
                         'request_counts',
                         'request_type_count',
                         'department_amounts',
                         'request_trend',
                         'budget_utilization',
                         'total_users',
                         'total_departments',
                         'total_requests',
                         'total_pending_approvals'
                     ]
                 ]);
    }

    public function test_direct_manager_can_access_team_stats()
    {
        $manager = User::where('email', 'manager@spendswift.com')->first();
        Sanctum::actingAs($manager);

        $response = $this->getJson('/api/dashboard/stats');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'data' => [
                         'request_counts',
                         'pending_approvals',
                         'request_trend',
                         'team_members',
                         'total_team_members',
                         'total_team_requests'
                     ]
                 ]);
    }

    public function test_accountant_can_access_finance_stats()
    {
        $accountant = User::where('email', 'accountant@spendswift.com')->first();
        Sanctum::actingAs($accountant);

        $response = $this->getJson('/api/dashboard/stats');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'data' => [
                         'pending_review',
                         'budget_utilization',
                         'department_amounts',
                         'spending_trend',
                         'total_approved',
                         'total_rejected'
                     ]
                 ]);
    }

    public function test_regular_user_can_access_own_stats()
    {
        $user = User::where('email', 'user@spendswift.com')->first();
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/dashboard/stats');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'data' => [
                         'request_counts',
                         'request_type_count',
                         'request_trend',
                         'recent_requests',
                         'total_requests',
                         'total_approved',
                         'total_pending',
                         'total_rejected'
                     ]
                 ]);
    }
}