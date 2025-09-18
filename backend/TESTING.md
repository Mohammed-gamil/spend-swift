# Testing the Action-g Backend API

This guide provides instructions for testing the Action-g backend API implementation. There are several ways to test the API to ensure it's functioning correctly.

## Prerequisites

Before testing, make sure you have:

1. PHP 8.2+ installed
2. Composer installed
3. Database configured (MySQL/PostgreSQL)
4. Laravel environment set up (.env file)

## Setup for Testing

First, install the required packages:

```powershell
cd d:\pojects\TT\backend
composer require --dev phpunit/phpunit
```

Then run database migrations and seeders:

```powershell
php artisan migrate:fresh --seed
```

This will create all tables and seed them with test data, including:
- Roles and permissions
- Test users for all roles
- Departments and budgets

## Automated Testing

I've created several test files that you can run to verify the API functionality:

### Feature Tests
- `tests/Feature/AuthTest.php` - Tests authentication features
- `tests/Feature/RequestTest.php` - Tests request creation and approval workflow
- `tests/Feature/DashboardStatsTest.php` - Tests dashboard statistics

### Unit Tests
- `tests/Unit/RequestServiceTest.php` - Tests the request service and state machine

To run all tests:

```powershell
cd d:\pojects\TT\backend
php artisan test
```

To run a specific test:

```powershell
php artisan test --filter=AuthTest
```

## Manual Testing

### Using the Manual Test Script

I've created a PHP script that demonstrates the complete request approval workflow:

```powershell
cd d:\pojects\TT\backend
php manual-test.php
```

This script:
1. Creates a request as a regular user
2. Submits the request for approval
3. Approves the request through all stages of the workflow
4. Shows notifications at each step
5. Displays statistics for different user roles

### Using Postman or API Client

To test the API with Postman:

1. Start the development server:
   ```powershell
   cd d:\pojects\TT\backend
   php artisan serve
   ```

2. Test authentication:
   - Method: POST
   - URL: http://localhost:8000/api/auth/login
   - Body (JSON):
     ```json
     {
       "email": "user@spendswift.com",
       "password": "password"
     }
     ```
   - Save the token from the response

3. Test creating a request:
   - Method: POST
   - URL: http://localhost:8000/api/requests
   - Headers: `Authorization: Bearer YOUR_TOKEN_HERE`
   - Body (JSON):
     ```json
     {
       "title": "Test Purchase Request",
       "description": "This is a test purchase request",
       "request_type": "PURCHASE",
       "department_id": 1,
       "estimated_delivery_date": "2025-10-01",
       "items": [
         {
           "name": "Test Item",
           "description": "Test item description",
           "quantity": 2,
           "unit_price": 100,
           "total_price": 200
         }
       ]
     }
     ```

4. Test the approval workflow:
   - Submit: POST http://localhost:8000/api/requests/{id}/submit
   - DM approval: POST http://localhost:8000/api/requests/{id}/approve/dm
   - Accountant approval: POST http://localhost:8000/api/requests/{id}/approve/accountant
   - Final approval: POST http://localhost:8000/api/requests/{id}/approve/final
   - Transfer funds: POST http://localhost:8000/api/requests/{id}/transfer

## Test Users

The seeders create several test users that you can use:

| Role | Email | Password |
|------|-------|----------|
| Regular User | user@spendswift.com | password |
| Direct Manager | manager@spendswift.com | password |
| Accountant | accountant@spendswift.com | password |
| Final Manager | final@spendswift.com | password |
| Admin | admin@spendswift.com | password |

## Automated Test Script

For convenience, I've created a bash script that runs all tests:

```powershell
# On Windows, use Git Bash or WSL to run this
cd d:\pojects\TT\backend
bash test.sh
```

The script will:
1. Prepare the database with migrations and seeders
2. Run automated tests
3. Run the manual test script
4. Start the development server for additional manual testing

## Expected Results

If all tests pass, you should see:

1. Authentication works correctly
2. Users can create, update, and submit requests
3. Requests follow the proper approval workflow
4. Permissions are enforced correctly
5. Dashboard statistics display appropriate data based on user role

## Troubleshooting

If you encounter issues:

1. Check that all migrations have run successfully
2. Verify that the seeders created all necessary data
3. Check the Laravel log file for errors
4. Ensure all required packages are installed
5. Verify that your database configuration is correct

By following this guide, you should be able to thoroughly test all aspects of the SpendSwift backend API implementation.