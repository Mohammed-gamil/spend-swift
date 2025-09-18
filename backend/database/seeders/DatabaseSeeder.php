<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use App\Models\User;
use App\Models\Department;
use App\Models\Budget;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Always seed base permissions & roles (idempotent)
        $this->call(BasePermissionsSeeder::class);

        // In production we stop here to avoid demo data
        if (app()->environment('production')) {
            return;
        }
        
        // Create departments
        $departments = [
            ['name' => 'Information Technology'],
            ['name' => 'Human Resources'],
            ['name' => 'Finance'],
            ['name' => 'Marketing'],
            ['name' => 'Operations'],
        ];
        
        foreach ($departments as $dept) {
            Department::create($dept);
        }
        
        // Create budgets for departments
        $currentYear = date('Y');
        $departments = Department::all();
        foreach ($departments as $department) {
            Budget::create([
                'department_id' => $department->id,
                'fiscal_year' => $currentYear,
                'total_amount' => rand(500000, 2000000),
                'spent_amount' => 0,
            ]);
        }
        
    // Demo users (non-production only)
        // Admin user
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@spendswift.com',
            'password' => Hash::make('password'),
            'department_id' => Department::where('name', 'Information Technology')->first()->id,
            'position' => 'System Administrator',
            'phone' => '555-123-4567',
        ]);
    $admin->assignRole('ADMIN');
        
        // Regular user
        $user = User::create([
            'name' => 'Regular User',
            'email' => 'user@spendswift.com',
            'password' => Hash::make('password'),
            'department_id' => Department::where('name', 'Marketing')->first()->id,
            'position' => 'Marketing Specialist',
            'phone' => '555-234-5678',
        ]);
    $user->assignRole('USER');
        
        // Direct manager
        $directManager = User::create([
            'name' => 'Direct Manager',
            'email' => 'manager@spendswift.com',
            'password' => Hash::make('password'),
            'department_id' => Department::where('name', 'Marketing')->first()->id,
            'position' => 'Marketing Director',
            'phone' => '555-345-6789',
            'reports_to' => null,
        ]);
    $directManager->assignRole('DIRECT_MANAGER');
        $user->reports_to = $directManager->id;
        $user->save();
        
        // Accountant
        $accountant = User::create([
            'name' => 'Accountant User',
            'email' => 'accountant@spendswift.com',
            'password' => Hash::make('password'),
            'department_id' => Department::where('name', 'Finance')->first()->id,
            'position' => 'Senior Accountant',
            'phone' => '555-456-7890',
        ]);
    $accountant->assignRole('ACCOUNTANT');
        
        // Final manager
        $finalManager = User::create([
            'name' => 'Final Approver',
            'email' => 'final@spendswift.com',
            'password' => Hash::make('password'),
            'department_id' => Department::where('name', 'Finance')->first()->id,
            'position' => 'Chief Financial Officer',
            'phone' => '555-567-8901',
        ]);
        $finalManager->assignRole('FINAL_MANAGER');
    }
}
