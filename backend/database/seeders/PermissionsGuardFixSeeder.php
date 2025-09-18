<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use App\Models\User;

class PermissionsGuardFixSeeder extends Seeder
{
    /**
     * Run the database seeds to ensure roles/permissions use the 'api' guard
     * and that the test user has appropriate access.
     */
    public function run(): void
    {
        $guard = 'api';

        $permissions = [
            'user.view','user.create','user.update','user.delete',
            'department.view','department.create','department.update','department.delete',
            'requests.view.own','requests.view.all','requests.create','requests.edit.own','requests.edit.all',
            'requests.delete.own','requests.delete.all','requests.cancel.own','requests.submit','requests.approve.dm',
            'requests.approve.acct','requests.approve.final','requests.transfer','requests.reject','requests.return',
            'budget.view','budget.create','budget.update','budget.delete',
            'attachment.view','attachment.create','attachment.delete',
            'audit.view',
            'notification.view','notification.update',
            'dashboard.view','dashboard.admin',
            'report.view','report.export',
        ];

        // Update or create permissions with correct guard
        foreach ($permissions as $permName) {
            Permission::query()->updateOrCreate(
                ['name' => $permName],
                ['guard_name' => $guard]
            );
        }

        // Role to permissions mapping
        $rolePermissions = [
            'USER' => [
                'requests.view.own','requests.create','requests.edit.own','requests.delete.own','requests.cancel.own','requests.submit',
                'attachment.view','attachment.create','attachment.delete','notification.view','notification.update','dashboard.view'
            ],
            'DIRECT_MANAGER' => [
                'requests.view.own','requests.view.all','requests.create','requests.edit.own','requests.delete.own','requests.cancel.own','requests.submit',
                'requests.approve.dm','requests.reject','requests.return','attachment.view','attachment.create','attachment.delete',
                'notification.view','notification.update','dashboard.view','report.view'
            ],
            'ACCOUNTANT' => [
                'requests.view.all','requests.approve.acct','requests.reject','requests.return','budget.view','attachment.view',
                'notification.view','notification.update','dashboard.view','report.view','report.export'
            ],
            'FINAL_MANAGER' => [
                'requests.view.all','requests.approve.final','requests.reject','requests.return','requests.transfer','budget.view',
                'attachment.view','notification.view','notification.update','dashboard.view','report.view','report.export'
            ],
            'ADMIN' => $permissions,
        ];

        foreach ($rolePermissions as $roleName => $perms) {
            /** @var Role $role */
            $role = Role::query()->updateOrCreate(
                ['name' => $roleName],
                ['guard_name' => $guard]
            );
            // syncPermissions accepts names; underlying will match guard
            $role->syncPermissions($perms);
        }

        // Ensure test user exists and has USER role
        $testUser = User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => Hash::make('password'),
            ]
        );

        if (!$testUser->hasRole('USER')) {
            $testUser->assignRole('USER');
        }

        // Clear Spatie permission cache
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();
        $this->command?->info('Permissions and roles guard_name updated to api and test user ensured.');
    }
}
