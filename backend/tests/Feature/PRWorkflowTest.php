<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\User;
use App\Models\PurchaseRequest;

class PRWorkflowTest extends TestCase
{
    use RefreshDatabase;

    public function test_happy_path_pr_workflow()
    {
    // Create roles and users programmatically for testing
    \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'user']);
    \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'manager']);
    \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'accountant']);
    \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'admin']);

    $user = User::create(['name' => 'Test User', 'email' => 'user@example.com', 'password' => bcrypt('password')]);
    $manager = User::create(['name' => 'Manager', 'email' => 'manager@example.com', 'password' => bcrypt('password')]);
    $accountant = User::create(['name' => 'Accountant', 'email' => 'accountant@example.com', 'password' => bcrypt('password')]);

    $user->assignRole('user');
    $manager->assignRole('manager');
    $accountant->assignRole('accountant');

        // User creates PR
        $this->actingAs($user)
            ->postJson('/api/purchase-requests', ['title' => 'Test PR', 'description' => 'desc'])
            ->assertStatus(201)
            ->assertJsonPath('data.title', 'Test PR');

        $pr = PurchaseRequest::where('title', 'Test PR')->first();
        $this->assertNotNull($pr);

        // Manager approves
        $this->actingAs($manager)
            ->putJson("/api/purchase-requests/{$pr->id}/approve")
            ->assertStatus(200);

    $pr->refresh();
    // service stores simple string statuses in tests/environment
    $this->assertEquals('approved_by_manager', $pr->status);

        // Accountant adds offer
        $this->actingAs($accountant)
            ->postJson("/api/purchase-requests/{$pr->id}/offers", ['amount' => 1000])
            ->assertStatus(201);

        $this->assertCount(1, $pr->priceOffers()->get());

        // User accepts offer (take first)
        $offer = $pr->priceOffers()->first();
        $this->actingAs($user)
            ->putJson("/api/offers/{$offer->id}/accept")
            ->assertStatus(200);

    $pr->refresh();
    $this->assertEquals('user_accepted_offer', $pr->status);
    }
}
