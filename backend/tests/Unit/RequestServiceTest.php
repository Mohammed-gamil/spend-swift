<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\User;
use App\Models\Request as SpendRequest;
use App\Services\RequestService;
use App\Exceptions\InvalidRequestStateException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;

class RequestServiceTest extends TestCase
{
    use RefreshDatabase;

    protected $requestService;
    protected $user;
    protected $manager;
    protected $accountant;
    protected $finalManager;

    public function setUp(): void
    {
        parent::setUp();
        $this->artisan('migrate:fresh --seed');
        
        // Get the request service from the container
        $this->requestService = app(RequestService::class);
        
        // Get users for each role
        $this->user = User::where('email', 'user@spendswift.com')->first();
        $this->manager = User::where('email', 'manager@spendswift.com')->first();
        $this->accountant = User::where('email', 'accountant@spendswift.com')->first();
        $this->finalManager = User::where('email', 'final@spendswift.com')->first();
    }
    
    public function test_create_request()
    {
        // Act as the user
        Auth::login($this->user);
        
        // Create a request
        $request = $this->requestService->createRequest([
            'title' => 'Test Service Request',
            'description' => 'Testing the request service',
            'request_type' => 'PURCHASE',
            'department_id' => $this->user->department_id,
            'estimated_delivery_date' => '2025-10-01',
            'items' => [
                [
                    'name' => 'Service Item',
                    'description' => 'Service item description',
                    'quantity' => 3,
                    'unit_price' => 100,
                    'total_price' => 300,
                ]
            ]
        ]);
        
        // Assert the request was created correctly
        $this->assertEquals('Test Service Request', $request->title);
        $this->assertEquals('DRAFT', $request->status);
        $this->assertEquals('PURCHASE', $request->request_type);
        $this->assertEquals($this->user->id, $request->user_id);
        
        // Assert items were created
        $this->assertEquals(1, $request->items->count());
        $this->assertEquals('Service Item', $request->items[0]->name);
        $this->assertEquals(3, $request->items[0]->quantity);
    }
    
    public function test_submit_request()
    {
        // Act as the user
        Auth::login($this->user);
        
        // Create a request
        $request = SpendRequest::create([
            'title' => 'Submit Test',
            'description' => 'Testing submit functionality',
            'request_type' => 'PURCHASE',
            'department_id' => $this->user->department_id,
            'user_id' => $this->user->id,
            'status' => 'DRAFT',
            'estimated_delivery_date' => '2025-10-01',
        ]);
        
        // Submit the request
        $submittedRequest = $this->requestService->submitRequest($request, 'Please review this');
        
        // Assert the request was submitted correctly
        $this->assertEquals('SUBMITTED', $submittedRequest->status);
        
        // Assert an approval history entry was created
        $this->assertEquals(1, $submittedRequest->approvalHistories->count());
        $this->assertEquals('SUBMITTED', $submittedRequest->approvalHistories[0]->action);
        $this->assertEquals($this->user->id, $submittedRequest->approvalHistories[0]->user_id);
    }
    
    public function test_full_approval_flow()
    {
        // Create a request as the user
        Auth::login($this->user);
        $request = $this->requestService->createRequest([
            'title' => 'Flow Test Request',
            'description' => 'Testing full approval flow',
            'request_type' => 'PURCHASE',
            'department_id' => $this->user->department_id,
            'estimated_delivery_date' => '2025-10-01',
            'items' => [
                [
                    'name' => 'Flow Item',
                    'description' => 'Flow item description',
                    'quantity' => 1,
                    'unit_price' => 200,
                    'total_price' => 200,
                ]
            ]
        ]);
        
        // User submits the request
        $request = $this->requestService->submitRequest($request, 'Please approve');
        $this->assertEquals('SUBMITTED', $request->status);
        
        // Manager approves the request
        Auth::login($this->manager);
        $request = $this->requestService->approveByDirectManager($request, 'Manager approved');
        $this->assertEquals('DM_APPROVED', $request->status);
        
        // Accountant approves the request
        Auth::login($this->accountant);
        $request = $this->requestService->approveByAccountant($request, 'Accountant approved');
        $this->assertEquals('ACCT_APPROVED', $request->status);
        
        // Final manager approves the request
        Auth::login($this->finalManager);
        $request = $this->requestService->approveByFinalManager($request, 'Final approval');
        $this->assertEquals('FINAL_APPROVED', $request->status);
        
        // Transfer funds
        $request = $this->requestService->transferFunds($request, 'Funds transferred', 'TX-54321');
        $this->assertEquals('FUNDS_TRANSFERRED', $request->status);
        $this->assertEquals('TX-54321', $request->transaction_reference);
        
        // Assert all approval history entries exist
        $actions = $request->approvalHistories->pluck('action')->toArray();
        $this->assertContains('CREATED', $actions);
        $this->assertContains('SUBMITTED', $actions);
        $this->assertContains('DM_APPROVED', $actions);
        $this->assertContains('ACCT_APPROVED', $actions);
        $this->assertContains('FINAL_APPROVED', $actions);
        $this->assertContains('FUNDS_TRANSFERRED', $actions);
    }
    
    public function test_invalid_state_transitions_throw_exceptions()
    {
        // Create and submit a request
        Auth::login($this->user);
        $request = $this->requestService->createRequest([
            'title' => 'Invalid State Test',
            'description' => 'Testing invalid state transitions',
            'request_type' => 'PURCHASE',
            'department_id' => $this->user->department_id,
            'estimated_delivery_date' => '2025-10-01',
        ]);
        
        // Try to approve as direct manager while still in DRAFT
        Auth::login($this->manager);
        $this->expectException(InvalidRequestStateException::class);
        $this->requestService->approveByDirectManager($request, 'Should fail');
    }
    
    public function test_reject_request()
    {
        // Create and submit a request
        Auth::login($this->user);
        $request = $this->requestService->createRequest([
            'title' => 'Reject Test',
            'description' => 'Testing rejection flow',
            'request_type' => 'PURCHASE',
            'department_id' => $this->user->department_id,
            'estimated_delivery_date' => '2025-10-01',
        ]);
        
        $request = $this->requestService->submitRequest($request);
        
        // Direct manager rejects the request
        Auth::login($this->manager);
        $request = $this->requestService->rejectRequest($request, 'Rejected due to insufficient justification');
        
        $this->assertEquals('REJECTED', $request->status);
    }
    
    public function test_return_request_for_revision()
    {
        // Create and submit a request
        Auth::login($this->user);
        $request = $this->requestService->createRequest([
            'title' => 'Return Test',
            'description' => 'Testing return for revision flow',
            'request_type' => 'PURCHASE',
            'department_id' => $this->user->department_id,
            'estimated_delivery_date' => '2025-10-01',
        ]);
        
        $request = $this->requestService->submitRequest($request);
        
        // Direct manager returns the request
        Auth::login($this->manager);
        $request = $this->requestService->returnRequest($request, 'Please add more details');
        
        $this->assertEquals('RETURNED', $request->status);
        
        // User resubmits with updates
        Auth::login($this->user);
        $request = $this->requestService->resubmitRequest($request, [
            'title' => 'Return Test - Updated',
            'description' => 'Added more details as requested',
            'request_type' => 'PURCHASE',
            'department_id' => $this->user->department_id,
            'estimated_delivery_date' => '2025-10-01',
        ], 'Updated as requested');
        
        $this->assertEquals('SUBMITTED', $request->status);
        $this->assertEquals('Return Test - Updated', $request->title);
    }
}