<?php

require __DIR__ . '/vendor/autoload.php';
require __DIR__ . '/bootstrap/app.php';

$app = app();
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Get all users
$users = App\Models\User::all();
foreach ($users as $user) {
    echo "User: {$user->name} ({$user->email})\n";
    echo "Roles: " . implode(', ', $user->getRoleNames()->toArray()) . "\n";
    
    // Check permissions
    $permissions = $user->getAllPermissions();
    echo "Permission count: " . $permissions->count() . "\n";
    
    if ($permissions->count() > 0) {
        echo "Permission guard: " . $permissions->first()->guard_name . "\n";
        echo "Has 'requests.create': " . ($user->hasPermissionTo('requests.create') ? 'Yes' : 'No') . "\n";
    } else {
        echo "No permissions assigned\n";
    }
    
    echo "-----------------------------\n";
}

// Check what guard is being used for permission checks
echo "Auth guard used in middleware: " . config('auth.defaults.guard') . "\n";
echo "Available guards: " . implode(', ', array_keys(config('auth.guards'))) . "\n";
echo "Permission default guard: " . config('permission.defaults.guard') . "\n";