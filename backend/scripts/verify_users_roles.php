<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use Spatie\Permission\Models\Role;

echo 'Users: ' . User::count() . PHP_EOL;
echo 'Roles: ' . Role::count() . PHP_EOL;
foreach (User::all() as $u) {
    echo $u->email . ' => ' . implode(',', $u->getRoleNames()->toArray()) . PHP_EOL;
}
