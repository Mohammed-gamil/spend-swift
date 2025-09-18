<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionsAudit extends Command
{
    protected $signature = 'permissions:audit {--fix : Automatically fix guard_name mismatches to api}';
    protected $description = 'Audit (and optionally fix) Spatie roles & permissions guard alignment with api guard';

    public function handle(): int
    {
        $targetGuard = 'api';
        $this->info("Auditing roles & permissions against guard '$targetGuard'");

        $permMismatches = [];
        foreach (Permission::all() as $perm) {
            if ($perm->guard_name !== $targetGuard) {
                $permMismatches[] = $perm;
            }
        }

        $roleMismatches = [];
        foreach (Role::all() as $role) {
            if ($role->guard_name !== $targetGuard) {
                $roleMismatches[] = $role;
            }
        }

        if (empty($permMismatches) && empty($roleMismatches)) {
            $this->info('All roles & permissions already use guard: '.$targetGuard);
        } else {
            if ($permMismatches) {
                $this->warn('Permission guard mismatches:');
                $this->table(['ID','Name','Current Guard'], collect($permMismatches)->map(fn($p)=>[$p->id,$p->name,$p->guard_name]));
            }
            if ($roleMismatches) {
                $this->warn('Role guard mismatches:');
                $this->table(['ID','Name','Current Guard'], collect($roleMismatches)->map(fn($r)=>[$r->id,$r->name,$r->guard_name]));
            }
        }

        if ($this->option('fix') && (!empty($permMismatches) || !empty($roleMismatches))) {
            if (!$this->confirm('Apply guard_name="'.$targetGuard.'" to all mismatches?', true)) {
                $this->info('Aborted fix.');
                return self::SUCCESS;
            }
            foreach ($permMismatches as $p) { $p->guard_name = $targetGuard; $p->save(); }
            foreach ($roleMismatches as $r) { $r->guard_name = $targetGuard; $r->save(); }
            app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();
            $this->info('Updated guard_name and cleared permission cache.');
        }

        return self::SUCCESS;
    }
}
