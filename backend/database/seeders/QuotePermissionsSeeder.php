<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class QuotePermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create new permissions for quotes workflow
        $quotePermissions = [
            'requests.quotes.add',
            'requests.quotes.edit',
            'requests.quotes.delete', 
            'requests.quotes.select',
            'requests.quotes.request',
            'requests.process.accountant',
            'requests.approve.second',
            'requests.approve.final',
        ];

        // Create permissions
        foreach ($quotePermissions as $name) {
            Permission::firstOrCreate(
                ['name' => $name, 'guard_name' => 'api']
            );
        }

        // Get roles
        $adminRole = Role::where('name', 'ADMIN')->first();
        $accountantRole = Role::where('name', 'ACCOUNTANT')->first();
        $directManagerRole = Role::where('name', 'DIRECT_MANAGER')->first();
        $userRole = Role::where('name', 'USER')->first();

        // Assign permissions to roles
        if ($adminRole) {
            // Admins get all permissions
            $adminRole->givePermissionTo($quotePermissions);
        }

        if ($accountantRole) {
            // Accountants can add, edit, delete quotes and process requests
            $accountantRole->givePermissionTo([
                'requests.quotes.add',
                'requests.quotes.edit', 
                'requests.quotes.delete',
                'requests.quotes.request',
                'requests.process.accountant',
                'requests.approve.final',
            ]);
        }

        if ($directManagerRole) {
            // Direct managers can view quotes and provide second approval
            $directManagerRole->givePermissionTo([
                'requests.approve.second',
            ]);
        }

        if ($userRole) {
            // Regular users can select quotes for their own requests
            $userRole->givePermissionTo([
                'requests.quotes.select',
            ]);
        }

        $this->command->info('Quote permissions created and assigned successfully.');
    }
}