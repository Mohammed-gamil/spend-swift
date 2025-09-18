<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function setUp(): void
    {
        parent::setUp();
        $this->artisan('migrate:fresh --seed');
    }

    public function test_user_can_login()
    {
        $response = $this->postJson('/api/auth/login', [
            'email' => 'user@spendswift.com',
            'password' => 'password',
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'user',
                     'token'
                 ]);
    }

    public function test_user_cannot_login_with_incorrect_credentials()
    {
        $response = $this->postJson('/api/auth/login', [
            'email' => 'user@spendswift.com',
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(401);
    }

    public function test_user_can_logout()
    {
        // First login to get a token
        $loginResponse = $this->postJson('/api/auth/login', [
            'email' => 'user@spendswift.com',
            'password' => 'password',
        ]);
        
        $token = $loginResponse->json('token');
        
        // Then logout with the token
        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
                         ->postJson('/api/auth/logout');
        
        $response->assertStatus(200)
                 ->assertJson([
                     'message' => 'Successfully logged out'
                 ]);
    }

    public function test_user_can_get_profile()
    {
        $user = User::where('email', 'user@spendswift.com')->first();
        
        $response = $this->actingAs($user)
                         ->getJson('/api/auth/user');
        
        $response->assertStatus(200)
                 ->assertJsonFragment([
                     'email' => 'user@spendswift.com',
                     'name' => $user->name
                 ]);
    }
}