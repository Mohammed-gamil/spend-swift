<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class FixTestUserPasswordSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::where('email', 'test@example.com')->first();
        if ($user) {
            $user->password = Hash::make('password');
            $user->save();
            
            echo "Test user password updated successfully!\n";
        } else {
            echo "Test user not found!\n";
        }
    }
}