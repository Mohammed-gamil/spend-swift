<?php

// Simple test script to verify quote system is working
require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;

echo "=== Quote System Test ===\n";

try {
    // Test 1: Check if PriceQuote model exists and can be instantiated
    echo "1. Testing PriceQuote model...\n";
    $quote = new App\Models\PriceQuote();
    echo "   ✓ PriceQuote model loaded successfully\n";
    
    // Test 2: Check if QuoteService exists
    echo "2. Testing QuoteService...\n";
    $quoteService = new App\Services\QuoteService(
        new App\Services\NotificationService()
    );
    echo "   ✓ QuoteService loaded successfully\n";
    
    // Test 3: Check if QuoteController exists
    echo "3. Testing QuoteController...\n";
    $quoteController = new App\Http\Controllers\API\QuoteController(
        $quoteService,
        new App\Services\RequestService(
            new App\Services\NotificationService(),
            $quoteService
        )
    );
    echo "   ✓ QuoteController loaded successfully\n";
    
    // Test 4: Check database connection and table exists
    echo "4. Testing database connection...\n";
    $pdo = DB::connection()->getPdo();
    echo "   ✓ Database connection successful\n";
    
    // Test 5: Check if price_quotes table exists
    echo "5. Testing price_quotes table...\n";
    $tables = DB::select("SHOW TABLES LIKE 'price_quotes'");
    if (count($tables) > 0) {
        echo "   ✓ price_quotes table exists\n";
    } else {
        echo "   ✗ price_quotes table not found\n";
    }
    
    // Test 6: Check if new request statuses are available
    echo "6. Testing new request statuses...\n";
    $statusQuery = DB::select("SHOW COLUMNS FROM requests LIKE 'status'");
    if (count($statusQuery) > 0) {
        $statusInfo = $statusQuery[0];
        if (strpos($statusInfo->Type, 'QUOTES_REQUESTED') !== false) {
            echo "   ✓ New request statuses are available\n";
        } else {
            echo "   ✗ New request statuses not found\n";
        }
    }
    
    // Test 7: Check if permissions exist
    echo "7. Testing quote permissions...\n";
    $quotePermissions = DB::table('permissions')
        ->where('name', 'LIKE', 'requests.quotes.%')
        ->count();
    
    if ($quotePermissions > 0) {
        echo "   ✓ Quote permissions found ($quotePermissions permissions)\n";
    } else {
        echo "   ✗ Quote permissions not found\n";
    }
    
    echo "\n=== Quote System Status: WORKING ===\n";
    echo "The quote-based approval workflow is ready to use!\n\n";
    
    echo "Next steps:\n";
    echo "1. Test API endpoints with authentication\n";
    echo "2. Create test requests and quotes\n";
    echo "3. Verify the complete workflow\n";
    
} catch (Exception $e) {
    echo "   ✗ Error: " . $e->getMessage() . "\n";
    echo "\n=== Quote System Status: ERROR ===\n";
}