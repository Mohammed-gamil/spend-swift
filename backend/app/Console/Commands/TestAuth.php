<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class TestAuth extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:test-auth';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test authentication';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Testing authentication...');
        
        // Check if test user exists
        $user = User::where('email', 'test@example.com')->first();
        if (!$user) {
            $this->error('Test user not found!');
            return;
        }
        
        $this->info('Test user found: ' . $user->email);
        $this->info('User ID: ' . $user->id);
        
        // Test password
        $password = 'password';
        $this->info('Testing password: ' . $password);
        $this->info('Stored hash: ' . $user->password);
        $this->info('Password check: ' . (Hash::check($password, $user->password) ? 'PASS' : 'FAIL'));
        
        // Test JWT auth
        $token = Auth::guard('api')->attempt(['email' => 'test@example.com', 'password' => 'password']);
        if ($token) {
            $this->info('JWT token generated successfully: ' . $token);
            $authUser = Auth::guard('api')->user();
            $this->info('Authenticated user: ' . $authUser->email);
            
            // Test permissions
            $this->info('Testing permissions...');
            $this->info('Can view own requests: ' . ($authUser->can('requests.view.own') ? 'YES' : 'NO'));
            $this->info('Can create requests: ' . ($authUser->can('requests.create') ? 'YES' : 'NO'));
            $this->info('Has USER role: ' . ($authUser->hasRole('USER') ? 'YES' : 'NO'));
            
            // List all permissions
            $permissions = $authUser->getAllPermissions();
            $this->info('All permissions: ' . $permissions->pluck('name')->implode(', '));
            
        } else {
            $this->error('JWT authentication failed!');
        }
    }
}
