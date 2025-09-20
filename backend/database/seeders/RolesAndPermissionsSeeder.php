<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // Define roles
        $roles = [
            'user',
            'manager',
            'accountant',
            'admin',
        ];

        // Define permissions
        $permissions = [
            'create_pr',
            'view_own_pr',
            'edit_own_pr',
            'view_all_pr',
            'approve_pr',
            'reject_pr',
            'add_price_offer',
            'accept_price_offer',
            'track_projects',
            'manage_users',
            'manage_roles',
        ];

        // Create permissions
        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Create roles and assign permissions
        foreach ($roles as $role) {
            $roleInstance = Role::firstOrCreate(['name' => $role]);

            switch ($role) {
                case 'user':
                    $roleInstance->givePermissionTo(['create_pr', 'view_own_pr', 'edit_own_pr', 'accept_price_offer']);
                    break;
                case 'manager':
                    $roleInstance->givePermissionTo(['view_all_pr', 'approve_pr', 'reject_pr', 'track_projects']);
                    break;
                case 'accountant':
                    $roleInstance->givePermissionTo(['view_all_pr', 'add_price_offer', 'track_projects']);
                    break;
                case 'admin':
                    $roleInstance->givePermissionTo(Permission::all());
                    break;
            }
        }
    }
}