<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class FixUserPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // Get the 'USER' role with api guard
        $userRole = Role::where('name', 'USER')
                    ->where('guard_name', 'api')
                    ->first();
                    
        // Get the 'ADMIN' role with api guard
        $adminRole = Role::where('name', 'ADMIN')
                    ->where('guard_name', 'api')
                    ->first();
        
        if (!$userRole || !$adminRole) {
            $this->command->error('Required roles not found! Run BasePermissionsSeeder first.');
            return;
        }
        
        // Update the test user
        $user = User::where('email', 'test@example.com')->first();
        if ($user) {
            // Remove any existing roles (regardless of guard)
            $user->syncRoles([]);
            
            // Assign the role with the correct guard
            $user->assignRole($userRole);
            $this->command->info("User {$user->email} assigned USER role with api guard");
        } else {
            $this->command->warn("User test@example.com not found");
        }
        
        // Update or create a test admin user
        $adminUser = User::updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        
        // Remove any existing roles (regardless of guard)
        $adminUser->syncRoles([]);
        
        // Assign the role with the correct guard
        $adminUser->assignRole($adminRole);
        $this->command->info("User {$adminUser->email} assigned ADMIN role with api guard");
    }
}