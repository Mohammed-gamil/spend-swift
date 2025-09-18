#!/bin/bash

# Quote Workflow Setup Script
# This script sets up the new quote-based approval workflow

echo "=== Setting up Quote-Based Approval Workflow ==="
echo ""

# Run migrations
echo "1. Running database migrations..."
php artisan migrate --force

echo ""

# Run quote permissions seeder
echo "2. Setting up quote permissions..."
php artisan db:seed --class=QuotePermissionsSeeder

echo ""

# Clear caches
echo "3. Clearing application caches..."
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan permission:cache-reset

echo ""
echo "=== Quote Workflow Setup Complete! ==="
echo ""
echo "New workflow features:"
echo "✓ Price quotes system"
echo "✓ Enhanced approval workflow"
echo "✓ Quote selection by users"
echo "✓ Second manager approval"
echo "✓ Final accountant approval"
echo ""
echo "API endpoints are ready for testing!"