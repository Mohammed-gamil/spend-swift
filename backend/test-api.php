<?php

// Test script for API request with proper permissions

// Login first to get token
$ch = curl_init('http://127.0.0.1:8000/api/auth/login');
$loginData = json_encode([
    'email' => 'test@example.com',
    'password' => 'password123'
]);

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $loginData);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json',
    'X-Requested-With: XMLHttpRequest',
    'Content-Length: ' . strlen($loginData)
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

echo "Login HTTP status code: $httpCode\n";
if ($error) {
    echo "Curl error: $error\n";
}

if ($httpCode !== 200) {
    echo "Login failed with status code: $httpCode\n";
    echo "Response: $response\n";
    exit(1);
}

$loginResult = json_decode($response, true);
$token = $loginResult['access_token'] ?? null;

if (!$token) {
    echo "Failed to get token from login response\n";
    echo "Response: " . print_r($loginResult, true) . "\n";
    exit(1);
}

echo "Login successful. Got token.\n";

// Create a request
$ch = curl_init('http://127.0.0.1:8000/api/requests');
$requestData = json_encode([
    'title' => 'Test Request',
    'request_type' => 'EXPENSE',
    'description' => 'Testing permission fix',
    'department_id' => 1,
    'type' => 'EXPENSE',  // Duplicate of request_type but required per error
    'total_cost' => 100.00,
    'items' => [
        [
            'description' => 'Item 1',
            'amount' => 100.00,
            'quantity' => 1
        ]
    ]
]);

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $requestData);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json',
    'X-Requested-With: XMLHttpRequest',
    'Content-Length: ' . strlen($requestData),
    'Authorization: Bearer ' . $token
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

echo "Create request returned status code: $httpCode\n";
if ($error) {
    echo "Curl error: $error\n";
}
echo "Response: $response\n";

if ($httpCode >= 200 && $httpCode < 300) {
    echo "SUCCESS: Request created successfully.\n";
} else {
    echo "FAILURE: Request creation failed.\n";
}