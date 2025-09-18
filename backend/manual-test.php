#!/usr/bin/env php
<?php

// Script to test the SpendSwift API manually

require __DIR__ . '/vendor/autoload.php';
require __DIR__ . '/bootstrap/app.php';

use App\Models\User;
use App\Models\Request as SpendRequest;
use App\Services\RequestService;
use App\Services\NotificationService;
use App\Services\StatsService;
use Illuminate\Support\Facades\Auth;

// Create the application
$app = new Illuminate\Foundation\Application(
    $_ENV['APP_BASE_PATH'] ?? dirname(__DIR__)
);
$app->singleton(
    Illuminate\Contracts\Http\Kernel::class,
    App\Http\Kernel::class
);
$app->singleton(
    Illuminate\Contracts\Console\Kernel::class,
    App\Console\Kernel::class
);
$app->singleton(
    Illuminate\Contracts\Debug\ExceptionHandler::class,
    App\Exceptions\Handler::class
);
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$status = $kernel->handle(
    $input = new Symfony\Component\Console\Input\ArgvInput,
    new Symfony\Component\Console\Output\ConsoleOutput
);

// Helper function to print data
function printData($data, $title = null) {
    if ($title) {
        echo "\n\033[1;33m=== $title ===\033[0m\n";
    }
    
    if (is_object($data) && method_exists($data, 'toArray')) {
        $data = $data->toArray();
    }
    
    if (is_array($data)) {
        echo json_encode($data, JSON_PRETTY_PRINT) . "\n";
    } else {
        var_dump($data);
    }
}

// Test the workflow
try {
    echo "\033[1;32m=== SpendSwift API Manual Test ===\033[0m\n";
    
    // 1. Get services
    $requestService = app(RequestService::class);
    $notificationService = app(NotificationService::class);
    $statsService = app(StatsService::class);
    
    // 2. Get users for different roles
    $user = User::where('email', 'user@spendswift.com')->first();
    $manager = User::where('email', 'manager@spendswift.com')->first();
    $accountant = User::where('email', 'accountant@spendswift.com')->first();
    $finalManager = User::where('email', 'final@spendswift.com')->first();
    
    if (!$user || !$manager || !$accountant || !$finalManager) {
        echo "\033[1;31mCould not find all required users. Make sure you've run php artisan migrate:fresh --seed\033[0m\n";
        exit(1);
    }
    
    printData($user, "User");
    printData($manager, "Manager");
    printData($accountant, "Accountant");
    printData($finalManager, "Final Manager");
    
    // 3. Create a request as the regular user
    echo "\nRunning as User: {$user->name}\n";
    Auth::login($user);
    
    $request = $requestService->createRequest([
        'title' => 'Manual Test Request',
        'description' => 'This is a test request created via manual test script',
        'request_type' => 'PURCHASE',
        'department_id' => $user->department_id,
        'estimated_delivery_date' => '2025-10-15',
        'items' => [
            [
                'name' => 'Test Item 1',
                'description' => 'First test item',
                'quantity' => 2,
                'unit_price' => 150,
                'total_price' => 300,
            ],
            [
                'name' => 'Test Item 2',
                'description' => 'Second test item',
                'quantity' => 1,
                'unit_price' => 250,
                'total_price' => 250,
            ]
        ]
    ]);
    
    printData($request, "Created Request");
    
    // 4. Submit the request
    $request = $requestService->submitRequest($request, 'Please review this request at your earliest convenience');
    printData($request, "Submitted Request");
    
    // 5. Check user notifications
    $managerNotifications = $notificationService->getUserNotifications(true, 10);
    printData($managerNotifications, "Manager Notifications");
    
    // 6. Approve as direct manager
    echo "\nRunning as Manager: {$manager->name}\n";
    Auth::login($manager);
    $request = $requestService->approveByDirectManager($request, 'Approved as direct manager');
    printData($request, "Manager Approved Request");
    
    // 7. Check accountant notifications
    $accountantNotifications = $notificationService->getUserNotifications(true, 10);
    printData($accountantNotifications, "Accountant Notifications");
    
    // 8. Approve as accountant
    echo "\nRunning as Accountant: {$accountant->name}\n";
    Auth::login($accountant);
    $request = $requestService->approveByAccountant($request, 'Approved as accountant after budget verification');
    printData($request, "Accountant Approved Request");
    
    // 9. Check final manager notifications
    $finalManagerNotifications = $notificationService->getUserNotifications(true, 10);
    printData($finalManagerNotifications, "Final Manager Notifications");
    
    // 10. Approve as final manager
    echo "\nRunning as Final Manager: {$finalManager->name}\n";
    Auth::login($finalManager);
    $request = $requestService->approveByFinalManager($request, 'Approved as final manager');
    printData($request, "Final Manager Approved Request");
    
    // 11. Transfer funds
    $request = $requestService->transferFunds($request, 'Funds transferred to vendor', 'TX-MANUAL-123');
    printData($request, "Funds Transferred");
    
    // 12. Get approval history
    $approvalHistory = $request->approvalHistories;
    printData($approvalHistory, "Complete Approval History");
    
    // 13. Check stats for different roles
    Auth::login($user);
    $userStats = $statsService->getUserStats($user->id);
    printData($userStats, "User Dashboard Stats");
    
    Auth::login($manager);
    $managerStats = $statsService->getManagerStats($manager->id);
    printData($managerStats, "Manager Dashboard Stats");
    
    Auth::login($accountant);
    $accountantStats = $statsService->getAccountantStats();
    printData($accountantStats, "Accountant Dashboard Stats");
    
    Auth::login($finalManager);
    $adminStats = $statsService->getAdminStats();
    printData($adminStats, "Admin Dashboard Stats");
    
    echo "\n\033[1;32m=== Test Completed Successfully ===\033[0m\n";
    
} catch (Exception $e) {
    echo "\n\033[1;31mError: " . $e->getMessage() . "\033[0m\n";
    echo $e->getTraceAsString() . "\n";
}