<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class BasePermissionsSeeder extends Seeder
{
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

        foreach ($permissions as $p) {
            Permission::query()->updateOrCreate(['name'=>$p], ['guard_name'=>$guard]);
        }

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
            $role = Role::query()->updateOrCreate(['name'=>$roleName], ['guard_name'=>$guard]);
            $role->syncPermissions($perms);
        }

        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();
        $this->command?->info('Base permissions & roles seeded.');
    }
}
