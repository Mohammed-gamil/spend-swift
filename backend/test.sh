#!/usr/bin/env bash
# SpendSwift API Testing Script

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}SpendSwift API Testing Script${NC}"
echo "=========================================="

# Check if Laravel is installed
if ! [ -f "artisan" ]; then
    echo -e "${RED}Error: Laravel not found in current directory${NC}"
    echo "Please run this script from the backend directory of your SpendSwift project."
    exit 1
fi

# Function for headers
header() {
    echo ""
    echo -e "${YELLOW}$1${NC}"
    echo "----------------------------------------"
}

# Function for success messages
success() {
    echo -e "${GREEN}✓ $1${NC}"
}

# Function for error messages
error() {
    echo -e "${RED}✗ $1${NC}"
}

# Prepare the environment
header "Preparing environment"
php artisan migrate:fresh --seed

if [ $? -ne 0 ]; then
    error "Failed to run migrations and seeders"
    exit 1
fi
success "Database prepared with migrations and seeders"

# Run the tests
header "Running automated tests"
php artisan test

if [ $? -ne 0 ]; then
    error "Some tests failed"
else
    success "All tests passed"
fi

# Run the manual test script
header "Running manual test script"
php manual-test.php

if [ $? -ne 0 ]; then
    error "Manual test script encountered errors"
else
    success "Manual test script completed successfully"
fi

# Start the development server
header "Starting development server for manual API testing"
echo "The server will be available at http://localhost:8000"
echo "Press Ctrl+C to stop the server"
echo ""
echo "You can use tools like Postman to test the API endpoints manually."
echo "Import the following sample endpoints:"
echo ""
echo "1. Login: POST http://localhost:8000/api/auth/login"
echo "   Body: {\"email\": \"user@spendswift.com\", \"password\": \"password\"}"
echo ""
echo "2. Get user profile: GET http://localhost:8000/api/auth/user"
echo "   Headers: Authorization: Bearer [your-token]"
echo ""
echo "3. Create request: POST http://localhost:8000/api/requests"
echo "   Headers: Authorization: Bearer [your-token]"
echo ""
echo "Starting server..."
php artisan serve