<?php

require __DIR__ . '/vendor/autoload.php';
require __DIR__ . '/bootstrap/app.php';

$app = app();
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Get specific users to check
$users = [
    App\Models\User::where('email', 'test@example.com')->first(),
    App\Models\User::where('email', 'admin@example.com')->first()
];

foreach ($users as $user) {
    if (!$user) continue;
    
    echo "User: {$user->name} ({$user->email})\n";
    echo "Roles: " . implode(', ', $user->getRoleNames()->toArray()) . "\n";
    
    // Check permissions
    $permissions = $user->getAllPermissions();
    echo "Permission count: " . $permissions->count() . "\n";
    
    // Check specific permissions
    echo "Has 'requests.create' permission: " . ($user->hasPermissionTo('requests.create', 'api') ? 'Yes' : 'No') . "\n";
    
    if ($permissions->count() > 0) {
        echo "First permission: " . $permissions->first()->name . "\n";
        echo "Permission guard: " . $permissions->first()->guard_name . "\n";
    }
    
    echo "-----------------------------\n";
}