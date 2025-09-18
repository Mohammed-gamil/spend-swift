<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Request as SpendRequest;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

class RequestTest extends TestCase
{
    use RefreshDatabase;

    public function setUp(): void
    {
        parent::setUp();
        $this->artisan('migrate:fresh --seed');
    }

    public function test_user_can_create_purchase_request()
    {
        $user = User::where('email', 'user@spendswift.com')->first();
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/requests', [
            'title' => 'Test Purchase Request',
            'description' => 'This is a test purchase request',
            'request_type' => 'PURCHASE',
            'department_id' => $user->department_id,
            'estimated_delivery_date' => '2025-10-01',
            'items' => [
                [
                    'name' => 'Test Item',
                    'description' => 'Test item description',
                    'quantity' => 2,
                    'unit_price' => 100,
                    'total_price' => 200,
                ]
            ]
        ]);

        $response->assertStatus(201)
                 ->assertJsonStructure([
                     'data' => [
                         'id',
                         'title',
                         'status',
                         'request_type',
                         'items'
                     ]
                 ]);
        
        // Verify that the request is created in the database
        $this->assertDatabaseHas('requests', [
            'title' => 'Test Purchase Request',
            'status' => 'DRAFT'
        ]);
        
        // Verify that the items are created in the database
        $request = SpendRequest::where('title', 'Test Purchase Request')->first();
        $this->assertDatabaseHas('request_items', [
            'request_id' => $request->id,
            'name' => 'Test Item'
        ]);
    }

    public function test_user_can_submit_request()
    {
        $user = User::where('email', 'user@spendswift.com')->first();
        Sanctum::actingAs($user);

        // First create a request
        $request = SpendRequest::create([
            'title' => 'Test Request',
            'description' => 'Test description',
            'request_type' => 'PURCHASE',
            'department_id' => $user->department_id,
            'user_id' => $user->id,
            'status' => 'DRAFT',
            'estimated_delivery_date' => '2025-10-01',
        ]);

        // Then submit it
        $response = $this->postJson("/api/requests/{$request->id}/submit", [
            'comments' => 'Please review this request'
        ]);

        $response->assertStatus(200)
                 ->assertJson([
                     'data' => [
                         'status' => 'SUBMITTED'
                     ]
                 ]);
        
        // Verify that the request status is updated in the database
        $this->assertDatabaseHas('requests', [
            'id' => $request->id,
            'status' => 'SUBMITTED'
        ]);
        
        // Verify that an approval history entry is created
        $this->assertDatabaseHas('approval_histories', [
            'request_id' => $request->id,
            'action' => 'SUBMITTED',
            'user_id' => $user->id
        ]);
    }
    
    public function test_direct_manager_can_approve_request()
    {
        // Login as direct manager
        $manager = User::where('email', 'manager@spendswift.com')->first();
        Sanctum::actingAs($manager);
        
        // Get a user that reports to this manager
        $user = User::where('email', 'user@spendswift.com')->first();
        
        // Create a request for that user
        $request = SpendRequest::create([
            'title' => 'Request for Manager Approval',
            'description' => 'Test description',
            'request_type' => 'PURCHASE',
            'department_id' => $user->department_id,
            'user_id' => $user->id,
            'status' => 'SUBMITTED',
            'estimated_delivery_date' => '2025-10-01',
        ]);
        
        // Create an approval history entry for submission
        $request->approvalHistories()->create([
            'user_id' => $user->id,
            'action' => 'SUBMITTED',
            'comments' => 'Request submitted',
            'status' => 'SUBMITTED'
        ]);
        
        // Manager approves the request
        $response = $this->postJson("/api/requests/{$request->id}/approve/dm", [
            'comments' => 'Approved by manager'
        ]);
        
        $response->assertStatus(200)
                 ->assertJson([
                     'data' => [
                         'status' => 'DM_APPROVED'
                     ]
                 ]);
        
        // Verify that the request status is updated in the database
        $this->assertDatabaseHas('requests', [
            'id' => $request->id,
            'status' => 'DM_APPROVED'
        ]);
        
        // Verify that an approval history entry is created
        $this->assertDatabaseHas('approval_histories', [
            'request_id' => $request->id,
            'action' => 'DM_APPROVED',
            'user_id' => $manager->id
        ]);
    }
    
    public function test_user_cannot_access_other_users_requests()
    {
        // Create two users
        $user1 = User::where('email', 'user@spendswift.com')->first();
        $user2 = User::factory()->create([
            'email' => 'another@example.com',
            'department_id' => $user1->department_id
        ]);
        
        // Login as user2
        Sanctum::actingAs($user2);
        
        // Create a request for user1
        $request = SpendRequest::create([
            'title' => 'User 1 Request',
            'description' => 'Test description',
            'request_type' => 'PURCHASE',
            'department_id' => $user1->department_id,
            'user_id' => $user1->id,
            'status' => 'DRAFT',
            'estimated_delivery_date' => '2025-10-01',
        ]);
        
        // User2 tries to access user1's request
        $response = $this->getJson("/api/requests/{$request->id}");
        
        // Should get a 403 Forbidden
        $response->assertStatus(403);
    }
    
    public function test_request_workflow()
    {
        // 1. Create users for each role
        $user = User::where('email', 'user@spendswift.com')->first();
        $manager = User::where('email', 'manager@spendswift.com')->first();
        $accountant = User::where('email', 'accountant@spendswift.com')->first();
        $finalManager = User::where('email', 'final@spendswift.com')->first();
        
        // 2. User creates and submits a request
        Sanctum::actingAs($user);
        
        $response = $this->postJson('/api/requests', [
            'title' => 'Workflow Test Request',
            'description' => 'Testing the complete workflow',
            'request_type' => 'PURCHASE',
            'department_id' => $user->department_id,
            'estimated_delivery_date' => '2025-10-01',
            'items' => [
                [
                    'name' => 'Workflow Item',
                    'description' => 'Workflow item description',
                    'quantity' => 1,
                    'unit_price' => 500,
                    'total_price' => 500,
                ]
            ]
        ]);
        
        $requestId = $response->json('data.id');
        
        // User submits the request
        $this->postJson("/api/requests/{$requestId}/submit", [
            'comments' => 'Please approve this request'
        ]);
        
        // 3. Direct Manager approves the request
        Sanctum::actingAs($manager);
        
        $this->postJson("/api/requests/{$requestId}/approve/dm", [
            'comments' => 'Approved by direct manager'
        ]);
        
        // 4. Accountant approves the request
        Sanctum::actingAs($accountant);
        
        $this->postJson("/api/requests/{$requestId}/approve/accountant", [
            'comments' => 'Approved by accountant'
        ]);
        
        // 5. Final Manager approves the request and transfers funds
        Sanctum::actingAs($finalManager);
        
        $this->postJson("/api/requests/{$requestId}/approve/final", [
            'comments' => 'Final approval granted'
        ]);
        
        $this->postJson("/api/requests/{$requestId}/transfer", [
            'comments' => 'Funds transferred',
            'transaction_reference' => 'TX-12345'
        ]);
        
        // 6. Verify the final status
        $response = $this->getJson("/api/requests/{$requestId}");
        
        $response->assertStatus(200)
                 ->assertJson([
                     'data' => [
                         'status' => 'FUNDS_TRANSFERRED',
                         'transaction_reference' => 'TX-12345'
                     ]
                 ]);
        
        // 7. Verify all approval history entries
        $this->assertDatabaseHas('approval_histories', [
            'request_id' => $requestId,
            'action' => 'SUBMITTED',
            'user_id' => $user->id
        ]);
        
        $this->assertDatabaseHas('approval_histories', [
            'request_id' => $requestId,
            'action' => 'DM_APPROVED',
            'user_id' => $manager->id
        ]);
        
        $this->assertDatabaseHas('approval_histories', [
            'request_id' => $requestId,
            'action' => 'ACCT_APPROVED',
            'user_id' => $accountant->id
        ]);
        
        $this->assertDatabaseHas('approval_histories', [
            'request_id' => $requestId,
            'action' => 'FINAL_APPROVED',
            'user_id' => $finalManager->id
        ]);
        
        $this->assertDatabaseHas('approval_histories', [
            'request_id' => $requestId,
            'action' => 'FUNDS_TRANSFERRED',
            'user_id' => $finalManager->id
        ]);
    }
}