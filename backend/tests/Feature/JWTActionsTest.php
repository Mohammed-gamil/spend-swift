<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\User;

class JWTActionsTest extends TestCase
{
    use RefreshDatabase;

    public function test_logout_blacklists_token()
    {
        // Create a user
        $user = User::create(['name' => 'JWT User', 'email' => 'jwtuser@example.com', 'password' => bcrypt('password')]);

        // Login via API guard
        $response = $this->postJson('/api/login', ['email' => 'jwtuser@example.com', 'password' => 'password']);
        $response->assertStatus(200);

        $token = $response->json('access_token');
        $this->assertNotEmpty($token);

        // Use the jwt guard programmatically because the API routes in testing
        // use the session 'auth' guard by default. Verify that the token works
        // via the JWT guard, then logout (which should blacklist the token),
        // and finally verify the token is invalid.

        // Set token on the jwt guard and verify user can be resolved
        $jwt = auth('api')->setToken($token);
        $this->assertNotNull($jwt->user());

        // Logout via the jwt guard (this should blacklist the token)
        auth('api')->setToken($token)->logout();

        // After logout, attempting to resolve the user with the same token
        // should fail. The jwt library may throw an exception for a blacklisted
        // token, or return null — handle both cases.
        try {
            $userAfter = auth('api')->setToken($token)->user();
        } catch (\Tymon\JWTAuth\Exceptions\TokenBlacklistedException $e) {
            $userAfter = null;
        }

        $this->assertNull($userAfter, 'Token should be invalid after logout');
    }
}
