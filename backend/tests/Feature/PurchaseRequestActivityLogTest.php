<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\PurchaseRequest;
use App\Models\ActivityLog;
use App\Services\PurchaseRequestService;
use App\Repositories\PurchaseRequestRepository;
use Illuminate\Support\Facades\Hash;

class PurchaseRequestActivityLogTest extends TestCase
{
    use RefreshDatabase;

    public function test_purchase_request_creation_creates_activity_log()
    {
        $user = User::factory()->create([
            'email' => 'logtest@example.com',
            'password' => Hash::make('password'),
        ]);

    // Use default guard during testing
        // Use service directly to avoid route/guard complications in test environment
        $service = new PurchaseRequestService(new PurchaseRequestRepository());

        $pr = $service->createPurchaseRequest([
            'title' => 'Test PR',
            'description' => 'Testing activity logs',
            'user_id' => $user->id,
        ]);

        $this->assertDatabaseHas('activity_logs', [
            'loggable_type' => PurchaseRequest::class,
            'loggable_id' => $pr->id,
            'description' => 'Purchase Request created',
        ]);
    }
}
