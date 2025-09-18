# Quote Workflow Setup Script for Windows
# This script sets up the new quote-based approval workflow

Write-Host "=== Setting up Quote-Based Approval Workflow ===" -ForegroundColor Green
Write-Host ""

# Run migrations
Write-Host "1. Running database migrations..." -ForegroundColor Yellow
php artisan migrate --force

Write-Host ""

# Run quote permissions seeder
Write-Host "2. Setting up quote permissions..." -ForegroundColor Yellow
php artisan db:seed --class=QuotePermissionsSeeder

Write-Host ""

# Clear caches
Write-Host "3. Clearing application caches..." -ForegroundColor Yellow
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan permission:cache-reset

Write-Host ""
Write-Host "=== Quote Workflow Setup Complete! ===" -ForegroundColor Green
Write-Host ""
Write-Host "New workflow features:" -ForegroundColor Cyan
Write-Host "✓ Price quotes system" -ForegroundColor White
Write-Host "✓ Enhanced approval workflow" -ForegroundColor White
Write-Host "✓ Quote selection by users" -ForegroundColor White
Write-Host "✓ Second manager approval" -ForegroundColor White
Write-Host "✓ Final accountant approval" -ForegroundColor White
Write-Host ""
Write-Host "API endpoints are ready for testing!" -ForegroundColor Green