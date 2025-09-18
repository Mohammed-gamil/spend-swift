<?php

require __DIR__ . '/vendor/autoload.php';
require __DIR__ . '/bootstrap/app.php';

$app = app();
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Simulate a user authenticating and then checking permissions
$user = App\Models\User::where('email', 'test@example.com')->first();

if (!$user) {
    echo "User test@example.com not found!\n";
    exit(1);
}

echo "User: {$user->name} ({$user->email})\n";
echo "Roles: " . implode(', ', $user->getRoleNames()->toArray()) . "\n";

// Test request.create permission
if ($user->hasPermissionTo('requests.create', 'api')) {
    echo "✅ User has 'requests.create' permission with 'api' guard\n";
} else {
    echo "❌ User does not have 'requests.create' permission with 'api' guard\n";
}

// Test if the permission middleware would pass
// This mimics what the permission middleware does
try {
    if ($user->hasPermissionTo('requests.create')) {
        echo "✅ Default permission check passed\n";
    } else {
        echo "❌ Default permission check failed\n";
    }
} catch (Exception $e) {
    echo "❌ Error in permission check: " . $e->getMessage() . "\n";
}

// Check which guard is used by default for this user
$permGuard = $user->guard_name ?? 'Not set';
echo "User guard_name: {$permGuard}\n";

// Show the current auth configuration
echo "Default guard: " . config('auth.defaults.guard') . "\n";
$guards = implode(', ', array_keys(config('auth.guards')));
echo "Available guards: {$guards}\n";

// Check what guard would be used by the middleware
$guardName = config('auth.defaults.guard');
echo "Testing with guard '{$guardName}' (default guard):\n";
if ($user->hasPermissionTo('requests.create', $guardName)) {
    echo "✅ Permission check passed with default guard\n";
} else {
    echo "❌ Permission check failed with default guard\n";
}

// Check with explicit API guard
$guardName = 'api';
echo "Testing with guard '{$guardName}':\n";
if ($user->hasPermissionTo('requests.create', $guardName)) {
    echo "✅ Permission check passed with API guard\n";
} else {
    echo "❌ Permission check failed with API guard\n";
}