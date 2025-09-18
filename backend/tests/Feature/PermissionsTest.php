<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class PermissionsTest extends TestCase
{
    use RefreshDatabase;

    protected bool $dbUnavailable = false;

    protected function setUp(): void
    {
        parent::setUp();
        // Detect DB driver availability without triggering schema queries
        try {
            $pdo = \DB::connection()->getPdo();
        } catch (\Throwable $e) {
            $this->dbUnavailable = true;
            return; // defer skip to each test method
        }
        Permission::firstOrCreate(['name' => 'requests.view.own'], ['guard_name' => 'api']);
        Role::firstOrCreate(['name' => 'USER', 'guard_name' => 'api'])->givePermissionTo('requests.view.own');
    }

    public function test_requests_requires_authentication(): void
    {
    if ($this->dbUnavailable) { $this->markTestSkipped('DB driver unavailable'); }
    $this->getJson('/api/requests')->assertStatus(401);
    }

    public function test_requests_forbidden_without_permission(): void
    {
    if ($this->dbUnavailable) { $this->markTestSkipped('DB driver unavailable'); }
    $user = User::create([
            'name' => 'No Perm',
            'email' => 'noperm@example.com',
            'password' => Hash::make('password'),
        ]);

        $token = auth('api')->attempt(['email' => 'noperm@example.com', 'password' => 'password']);
        $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson('/api/requests')
            ->assertStatus(403);
    }

    public function test_requests_success_with_permission(): void
    {
    if ($this->dbUnavailable) { $this->markTestSkipped('DB driver unavailable'); }
    $user = User::create([
            'name' => 'Has Perm',
            'email' => 'hasperm@example.com',
            'password' => Hash::make('password'),
        ]);
        $user->assignRole('USER');

        $token = auth('api')->attempt(['email' => 'hasperm@example.com', 'password' => 'password']);
        $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson('/api/requests')
            ->assertStatus(200)
            ->assertJsonStructure(['data']);
    }
}
