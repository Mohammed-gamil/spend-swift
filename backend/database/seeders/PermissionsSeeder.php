<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;

class PermissionsSeeder extends Seeder
{
    /**
     * Run the seeder.
     */
    public function run(): void
    {
        // Create permissions
        $permissions = [
            // User permissions
            'user.view',
            'user.create',
            'user.update',
            'user.delete',
            
            // Department permissions
            'department.view',
            'department.create',
            'department.update',
            'department.delete',
            
            // Request permissions (matching route requirements)
            'requests.view.own',     // View own requests
            'requests.view.all',     // View all requests (admin/manager)
            'requests.create',       // Create new requests
            'requests.edit.own',     // Edit own requests
            'requests.edit.all',     // Edit all requests (admin)
            'requests.delete.own',   // Delete own requests
            'requests.delete.all',   // Delete all requests (admin)
            'requests.cancel.own',   // Cancel own requests
            'requests.submit',       // Submit requests for approval
            'requests.approve.dm',   // Direct Manager approval
            'requests.approve.acct', // Accountant approval
            'requests.approve.final',// Final Manager approval
            'requests.transfer',     // Funds transfer
            'requests.reject',       // Reject requests
            'requests.return',       // Return requests for modification
            
            // Budget permissions
            'budget.view',
            'budget.create',
            'budget.update',
            'budget.delete',
            
            // Attachment permissions
            'attachment.view',
            'attachment.create',
            'attachment.delete',
            
            // Audit trail permissions
            'audit.view',
            
            // Notification permissions
            'notification.view',
            'notification.update',
            
            // Dashboard permissions
            'dashboard.view',
            'dashboard.admin',
            
            // Report permissions
            'report.view',
            'report.export',
        ];
        
        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }
        
        // Create roles and assign permissions
        // USER role
        $userRole = Role::firstOrCreate(['name' => 'USER']);
        $userRole->syncPermissions([
            'requests.view.own',
            'requests.create',
            'requests.edit.own',
            'requests.delete.own',
            'requests.cancel.own',
            'requests.submit',
            'attachment.view',
            'attachment.create',
            'attachment.delete',
            'notification.view',
            'notification.update',
            'dashboard.view',
        ]);
        
        // ADMIN role (has all permissions)
        $adminRole = Role::firstOrCreate(['name' => 'ADMIN']);
        $adminRole->syncPermissions($permissions);
        
        // Assign USER role to existing test user
        $testUser = User::where('email', 'test@example.com')->first();
        if ($testUser) {
            $testUser->assignRole('USER');
            echo "Assigned USER role to test@example.com\n";
        }
        
        // Check if there are other users and assign ADMIN role to the first one
        $allUsers = User::all();
        if ($allUsers->count() > 1) {
            $firstUser = $allUsers->first();
            if ($firstUser->email !== 'test@example.com') {
                $firstUser->assignRole('ADMIN');
                echo "Assigned ADMIN role to {$firstUser->email}\n";
            }
        }
        
        echo "Permissions and roles created successfully!\n";
        echo "Total permissions: " . Permission::count() . "\n";
        echo "Total roles: " . Role::count() . "\n";
    }
}