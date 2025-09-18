<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class CheckUserPermissionsSeeder extends Seeder
{
    /**
     * Run the seeder.
     */
    public function run(): void
    {
        $user = User::where('email', 'test@example.com')->first();
        if ($user) {
            echo "User: {$user->name} ({$user->email})\n";
            echo "Roles: " . $user->roles->pluck('name')->join(', ') . "\n";
            echo "Permissions:\n";
            foreach ($user->getAllPermissions() as $permission) {
                echo "  - {$permission->name}\n";
            }
            
            echo "\nChecking specific permissions:\n";
            echo "  - requests.view.own: " . ($user->can('requests.view.own') ? 'YES' : 'NO') . "\n";
            echo "  - requests.create: " . ($user->can('requests.create') ? 'YES' : 'NO') . "\n";
        } else {
            echo "User test@example.com not found\n";
        }
    }
}