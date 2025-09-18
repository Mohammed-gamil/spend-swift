# Action-g API Testing Guide

This document outlines how to test the SpendSwift backend API implementation.

## Prerequisites

Before testing, ensure you have:

1. PHP 8.2+ installed
2. Composer installed
3. Database configured (MySQL/PostgreSQL)
4. Laravel environment set up (.env file)

## Setup for Testing

1. Install required packages:
```bash
cd d:\pojects\TT\backend
composer require --dev phpunit/phpunit
```

2. Run database migrations and seeders:
```bash
php artisan migrate:fresh --seed
```
This will create all tables and seed them with test data, including:
- Roles and permissions
- Test users for all roles
- Departments and budgets

## Testing Methods

### 1. Using Laravel's Built-in Testing Framework

Laravel provides a powerful testing framework based on PHPUnit. You can create feature tests for each of your API endpoints.

#### Example Feature Test for Authentication

Create a test file at `tests/Feature/AuthTest.php`:

```php
<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_login()
    {
        // Run migrations and seeders for test database
        $this->artisan('migrate:fresh --seed');
        
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
}
```

#### Example Feature Test for Request Creation

Create a test file at `tests/Feature/RequestTest.php`:

```php
<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Request as SpendRequest;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

class RequestTest extends TestCase
{
    use RefreshDatabase;

    public function setUp(): void
    {
        parent::setUp();
        $this->artisan('migrate:fresh --seed');
    }

    public function test_user_can_create_purchase_request()
    {
        $user = User::where('email', 'user@spendswift.com')->first();
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/requests', [
            'title' => 'Test Purchase Request',
            'description' => 'This is a test purchase request',
            'request_type' => 'PURCHASE',
            'department_id' => $user->department_id,
            'estimated_delivery_date' => '2025-10-01',
            'items' => [
                [
                    'name' => 'Test Item',
                    'description' => 'Test item description',
                    'quantity' => 2,
                    'unit_price' => 100,
                    'total_price' => 200,
                ]
            ]
        ]);

        $response->assertStatus(201)
                 ->assertJsonStructure([
                     'data' => [
                         'id',
                         'title',
                         'status',
                         'request_type',
                         'items'
                     ]
                 ]);
    }

    public function test_user_can_submit_request()
    {
        $user = User::where('email', 'user@spendswift.com')->first();
        Sanctum::actingAs($user);

        // First create a request
        $request = SpendRequest::create([
            'title' => 'Test Request',
            'description' => 'Test description',
            'request_type' => 'PURCHASE',
            'department_id' => $user->department_id,
            'user_id' => $user->id,
            'status' => 'DRAFT',
            'estimated_delivery_date' => '2025-10-01',
        ]);

        // Then submit it
        $response = $this->postJson("/api/requests/{$request->id}/submit", [
            'comments' => 'Please review this request'
        ]);

        $response->assertStatus(200)
                 ->assertJson([
                     'data' => [
                         'status' => 'SUBMITTED'
                     ]
                 ]);
    }
}
```

#### Running the Tests

To run all tests:
```bash
cd d:\pojects\TT\backend
php artisan test
```

To run a specific test:
```bash
php artisan test --filter=AuthTest
```

### 2. Using API Testing Tools

#### Postman

Postman is an excellent tool for testing APIs manually. Here's how to set it up:

1. Create a new Postman Collection named "SpendSwift API"

2. Set up an Environment with variables:
   - `base_url`: http://localhost:8000/api
   - `token`: (to be populated after login)

3. Create a login request:
   - Method: POST
   - URL: {{base_url}}/auth/login
   - Body (JSON):
     ```json
     {
       "email": "user@spendswift.com",
       "password": "password"
     }
     ```
   - Add a test script to capture the token:
     ```js
     var jsonData = JSON.parse(responseBody);
     pm.environment.set("token", jsonData.token);
     ```

4. Create request examples:

   a. Get user profile:
   - Method: GET
   - URL: {{base_url}}/auth/user
   - Auth: Bearer Token {{token}}

   b. Create a request:
   - Method: POST
   - URL: {{base_url}}/requests
   - Auth: Bearer Token {{token}}
   - Body (JSON):
     ```json
     {
       "title": "New Equipment Request",
       "description": "Need new monitors for the team",
       "request_type": "PURCHASE",
       "department_id": 1,
       "estimated_delivery_date": "2025-10-15",
       "items": [
         {
           "name": "Monitor",
           "description": "27-inch 4K Monitor",
           "quantity": 3,
           "unit_price": 300,
           "total_price": 900
         }
       ]
     }
     ```

   c. Submit a request:
   - Method: POST
   - URL: {{base_url}}/requests/1/submit
   - Auth: Bearer Token {{token}}
   - Body (JSON):
     ```json
     {
       "comments": "Urgent need for the team"
     }
     ```

   d. Approve a request (as direct manager):
   - Method: POST
   - URL: {{base_url}}/requests/1/approve/dm
   - Auth: Bearer Token {{token}} (use manager's token)
   - Body (JSON):
     ```json
     {
       "comments": "Approved by manager"
     }
     ```

#### Tinker

Laravel Tinker provides a REPL environment to test your code interactively:

```bash
cd d:\pojects\TT\backend
php artisan tinker
```

Example commands:

```php
// Get a user
$user = \App\Models\User::where('email', 'user@spendswift.com')->first();

// Create a request service instance
$requestService = app(\App\Services\RequestService::class);

// Create a new request
$request = $requestService->createRequest([
    'title' => 'Tinker Test Request',
    'description' => 'Created via Tinker',
    'request_type' => 'PURCHASE',
    'department_id' => $user->department_id,
    'estimated_delivery_date' => '2025-10-20',
    'items' => [
        [
            'name' => 'Test Item',
            'description' => 'Test description',
            'quantity' => 1,
            'unit_price' => 100,
            'total_price' => 100
        ]
    ]
]);

// Check the request status
echo $request->status;
```

### 3. Running the Development Server

To test the API with a real frontend or tools like Postman:

```bash
cd d:\pojects\TT\backend
php artisan serve
```

This will start a development server at http://localhost:8000.

## Testing Workflow Scenarios

### Full Request Approval Workflow

1. User creates a request (status: DRAFT)
2. User submits request (status: SUBMITTED)
3. Direct Manager approves request (status: DM_APPROVED)
4. Accountant approves request (status: ACCT_APPROVED)
5. Final Manager approves request (status: FINAL_APPROVED)
6. Final Manager transfers funds (status: FUNDS_TRANSFERRED)

### Alternative Workflow Scenarios

1. **Rejection Scenario**:
   - User creates and submits request
   - Direct Manager rejects request
   - Verify request status is REJECTED

2. **Return for Revision Scenario**:
   - User creates and submits request
   - Direct Manager returns request for revision
   - Verify request status is RETURNED
   - User edits and resubmits request
   - Verify request status is SUBMITTED

3. **Insufficient Budget Scenario**:
   - Edit budget to have minimal funds
   - User creates and submits large request
   - Direct Manager approves
   - Accountant reviews and system throws InsufficientBudgetException

## Expected Test Results

For each API endpoint, verify:

1. **Authentication**:
   - Unauthenticated requests to protected routes return 401
   - Authenticated requests without proper permissions return 403
   - Authenticated requests with proper permissions succeed

2. **Data Validation**:
   - Invalid data returns 422 with validation error messages
   - Valid data is properly processed

3. **State Machine Transitions**:
   - Requests can only move through proper state transitions
   - Invalid transitions throw InvalidRequestStateException
   - Approval steps follow the correct sequence

4. **Role-Based Access**:
   - Each role can only perform permitted actions
   - Admin can perform any action
   - Regular users can only access their own requests

## Common Testing Issues

1. **Token Expiration**: Sanctum tokens expire after 24 hours. If your tests fail with 401, try re-authenticating.

2. **Database Constraints**: Ensure your test database has the same structure as your production database.

3. **File Uploads**: When testing file uploads, use real files or the `UploadedFile` facade in tests.

4. **Timing Issues**: Some tests might depend on timing. Use Laravel's time helpers to manipulate dates when needed.

## Conclusion

Testing your SpendSwift API thoroughly ensures it functions correctly before connecting to the frontend. The combination of automated tests and manual testing will help identify and fix issues early in the development process.