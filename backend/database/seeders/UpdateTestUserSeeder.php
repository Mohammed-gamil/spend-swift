<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UpdateTestUserSeeder extends Seeder
{
    /**
     * Run the seeder.
     */
    public function run(): void
    {
        $user = User::where('email', 'test@example.com')->first();
        if ($user) {
            $user->password = Hash::make('password123');
            $user->save();
            echo "Password updated for test@example.com to 'password123'\n";
        } else {
            echo "User test@example.com not found\n";
        }
    }
}