<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Spatie\Permission\Models\Role;

class FixUserGuardsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'fix:user-guards {--user= : Specific user email to fix}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fix user role assignments to use the API guard';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $userEmail = $this->option('user');
        
        // Get all the roles with api guard
        $roles = Role::where('guard_name', 'api')->get()->keyBy('name');
        
        if ($roles->isEmpty()) {
            $this->error('No roles found with api guard. Run the BasePermissionsSeeder first.');
            return 1;
        }
        
        // Get users to process
        $query = User::query();
        if ($userEmail) {
            $query->where('email', $userEmail);
        }
        
        $users = $query->get();
        $count = 0;
        
        foreach ($users as $user) {
            // Get current roles (any guard)
            $currentRoles = $user->getRoleNames();
            
            if ($currentRoles->isEmpty()) {
                $this->info("User {$user->email} has no roles to fix.");
                continue;
            }
            
            // Remove all roles
            $user->syncRoles([]);
            
            // Re-add roles with api guard
            $apiRolesToAssign = [];
            foreach ($currentRoles as $roleName) {
                if ($roles->has($roleName)) {
                    $apiRolesToAssign[] = $roles[$roleName];
                    $this->info("Assigning role '{$roleName}' with api guard to {$user->email}");
                } else {
                    $this->warn("Role '{$roleName}' with api guard not found, skipping assignment to {$user->email}");
                }
            }
            
            if (!empty($apiRolesToAssign)) {
                $user->syncRoles($apiRolesToAssign);
                $count++;
            }
        }
        
        $this->info("Fixed {$count} users to use api guard for their roles.");
        return 0;
    }
}