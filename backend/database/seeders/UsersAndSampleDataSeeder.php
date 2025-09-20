<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Project;
use App\Models\PurchaseRequest;
use App\Models\PriceOffer;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class UsersAndSampleDataSeeder extends Seeder
{
    public function run(): void
    {
        // Ensure roles exist
        $roles = ['user', 'manager', 'accountant', 'admin'];
        foreach ($roles as $r) {
            Role::firstOrCreate(['name' => $r]);
        }

        // Create users with explicit credentials so we can show them after seeding.
        $seededUsers = [
            ['name' => 'Regular User', 'email' => 'user@example.com', 'role' => 'user', 'password' => 'password'],
            ['name' => 'Manager User', 'email' => 'manager@example.com', 'role' => 'manager', 'password' => 'password'],
            ['name' => 'Accountant User', 'email' => 'accountant@example.com', 'role' => 'accountant', 'password' => 'password'],
            ['name' => 'Admin User', 'email' => 'admin@example.com', 'role' => 'admin', 'password' => 'password'],
        ];

        $created = [];
        foreach ($seededUsers as $su) {
            $u = User::firstOrCreate([
                'email' => $su['email'],
            ], [
                'name' => $su['name'],
                'password' => Hash::make($su['password']),
                'role_id' => null,
            ]);

            $u->assignRole($su['role']);
            $created[$su['role']] = $u;

            // Do not print plaintext passwords during automated runs. We persist
            // seeded credentials to a local file for developer convenience and
            // provide an artisan command to display them when needed.
        }

        // Keep references for sample data creation
        $user = $created['user'];
        $manager = $created['manager'];
        $accountant = $created['accountant'];
        $admin = $created['admin'];

        // Sample project
        $project = Project::firstOrCreate([
            'title' => 'Sample Project',
        ], [
            'description' => 'A sample project for testing',
            'user_id' => $user->id,
            'manager_id' => $manager->id,
            'accountant_id' => $accountant->id,
        ]);

        // Sample purchase request
        $pr = PurchaseRequest::firstOrCreate([
            'title' => 'Sample PR',
        ], [
            'description' => 'Purchase request for testing',
            'user_id' => $user->id,
            'manager_id' => $manager->id,
        ]);

        // Sample price offers by accountant
        PriceOffer::firstOrCreate([
            'purchase_request_id' => $pr->id,
            'accountant_id' => $accountant->id,
            'amount' => 1000,
        ], [
            'description' => 'Sample offer 1',
            'status' => 'pending',
        ]);

        // Do not persist seeded credentials to disk. Use the dev command
        // `php artisan dev:show-seeded-users` in the local environment to
        // display seeded credentials when needed.

        PriceOffer::firstOrCreate([
            'purchase_request_id' => $pr->id,
            'accountant_id' => $accountant->id,
            'amount' => 1200,
        ], [
            'description' => 'Sample offer 2',
            'status' => 'pending',
        ]);
    }
}
