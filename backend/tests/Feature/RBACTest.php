<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\User;
use App\Models\PurchaseRequest;
use App\Models\Project;

class RBACTest extends TestCase
{
    use RefreshDatabase;

    public function test_accountant_can_create_price_offer_but_others_cannot()
    {
        \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'user']);
        \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'manager']);
        \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'accountant']);
        \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'admin']);

        $user = User::create(['name' => 'User', 'email' => 'u@example.com', 'password' => bcrypt('password')]);
        $accountant = User::create(['name' => 'Accountant', 'email' => 'a@example.com', 'password' => bcrypt('password')]);
        $user->assignRole('user');
        $accountant->assignRole('accountant');

        $pr = PurchaseRequest::create(['title' => 'RBAC PR', 'description' => 'x', 'user_id' => $user->id]);

        // Non-accountant should not be allowed to create an offer
        $this->actingAs($user)
            ->postJson("/api/purchase-requests/{$pr->id}/offers", ['amount' => 500])
            ->assertStatus(403);

        // Accountant can
        $this->actingAs($accountant)
            ->postJson("/api/purchase-requests/{$pr->id}/offers", ['amount' => 500])
            ->assertStatus(201);
    }

    public function test_manager_can_approve_pr_but_non_manager_cannot()
    {
        \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'manager']);
        \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'user']);

        $user = User::create(['name' => 'User', 'email' => 'u2@example.com', 'password' => bcrypt('password')]);
        $manager = User::create(['name' => 'Manager', 'email' => 'm@example.com', 'password' => bcrypt('password')]);
        $user->assignRole('user');
        $manager->assignRole('manager');

        $pr = PurchaseRequest::create(['title' => 'Approvals PR', 'description' => 'x', 'user_id' => $user->id]);

        $this->actingAs($user)
            ->putJson("/api/purchase-requests/{$pr->id}/approve")
            ->assertStatus(403);

        $this->actingAs($manager)
            ->putJson("/api/purchase-requests/{$pr->id}/approve")
            ->assertStatus(200);
    }

    public function test_project_policy_create_and_update()
    {
    \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'manager']);
    \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'user']);

    $user = User::create(['name' => 'User', 'email' => 'u3@example.com', 'password' => bcrypt('password')]);
        $manager = User::create(['name' => 'Manager', 'email' => 'm2@example.com', 'password' => bcrypt('password')]);
        $user->assignRole('user');
        $manager->assignRole('manager');
        // Test policies directly via Gate to avoid controller constructor dependencies
        $this->assertTrue(\Illuminate\Support\Facades\Gate::forUser($user)->allows('create', Project::class));

        $project = Project::create(['title' => 'New Project', 'description' => 'p', 'user_id' => $user->id, 'manager_id' => $manager->id]);

        // Manager should be allowed to update
        $this->assertTrue(\Illuminate\Support\Facades\Gate::forUser($manager)->allows('update', $project));

        // Owner should be allowed to update
        $this->assertTrue(\Illuminate\Support\Facades\Gate::forUser($user)->allows('update', $project));
    }
}
