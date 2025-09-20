<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\PurchaseRequest;
use App\Models\ActivityLog;
use Illuminate\Support\Facades\Hash;

// Create test user
$user = User::firstOrCreate(['email' => 'testlogger@example.com'], [
    'name' => 'Test Logger',
    'password' => Hash::make('password'),
]);

// Create a PR via repository to simulate flow
$pr = PurchaseRequest::create([
    'title' => 'Test PR',
    'description' => 'Testing activity logs',
    'user_id' => $user->id,
]);

// Create log manually
ActivityLog::create([
    'loggable_type' => PurchaseRequest::class,
    'loggable_id' => $pr->id,
    'user_id' => $user->id,
    'description' => 'Manual log entry',
]);

$logs = ActivityLog::where('loggable_type', PurchaseRequest::class)->where('loggable_id', $pr->id)->get();

echo 'Log count for PR: ' . $logs->count() . PHP_EOL;
foreach ($logs as $log) {
    echo $log->id . ' - ' . $log->description . ' - by user: ' . ($log->user ? $log->user->email : 'n/a') . PHP_EOL;
}
