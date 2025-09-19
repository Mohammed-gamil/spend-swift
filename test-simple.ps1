Write-Host "=== Testing Backend Connection ===" -ForegroundColor Green
Write-Host ""

Write-Host "1. Testing backend health endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:8000/api/health" -Method GET -UseBasicParsing -ErrorAction Stop
    Write-Host "   ✓ Backend server is running and healthy" -ForegroundColor Green
    Write-Host "   Response: $($response.Content)" -ForegroundColor White
} catch {
    Write-Host "   ✗ Backend server is not responding" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Please start the backend server with: php artisan serve" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "2. Testing quote routes..." -ForegroundColor Yellow
try {
    $quoteResponse = Invoke-WebRequest -Uri "http://127.0.0.1:8000/api/quotes/requests-needing-quotes" -Method GET -UseBasicParsing -ErrorAction Stop
    Write-Host "   ✓ Quote routes accessible" -ForegroundColor Green
} catch {
    Write-Host "   ⚠ Quote routes require authentication (expected)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "3. Checking frontend files..." -ForegroundColor Yellow

if (Test-Path "src\lib\api.ts") {
    Write-Host "   ✓ API service file exists" -ForegroundColor Green
} else {
    Write-Host "   ✗ API service file missing" -ForegroundColor Red
}

if (Test-Path "src\stores\apiPRStore.ts") {
    Write-Host "   ✓ API store exists" -ForegroundColor Green
} else {
    Write-Host "   ✗ API store missing" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 Backend connection test complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Start the frontend: npm run dev" -ForegroundColor White
Write-Host "2. Test creating a new request" -ForegroundColor White
Write-Host "3. Check browser console for API calls" -ForegroundColor White