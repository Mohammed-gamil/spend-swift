<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

echo 'Roles: ' . Role::count() . PHP_EOL;
echo 'Permissions: ' . Permission::count() . PHP_EOL;

$roles = Role::all()->pluck('name')->toArray();
$perms = Permission::all()->pluck('name')->toArray();

echo 'Role names: ' . implode(', ', $roles) . PHP_EOL;
echo 'Permission names: ' . implode(', ', $perms) . PHP_EOL;