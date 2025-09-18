<?php

// Test creating a request via direct API call
$email = 'test@example.com';
$password = 'password123';

// Step 1: Get JWT token
$loginData = [
    'email' => $email,
    'password' => $password
];

$ch = curl_init('http://127.0.0.1:8000/api/auth/login');
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($loginData));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);

$response = curl_exec($ch);
$statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($statusCode != 200) {
    echo "Login failed with status $statusCode: $response\n";
    exit(1);
}

$loginResponse = json_decode($response, true);
$token = $loginResponse['access_token'] ?? null;

if (!$token) {
    echo "Failed to get token from response\n";
    exit(1);
}

echo "Login successful. Got JWT token.\n";

// Step 2: Create a request using the token
$requestData = [
    'title' => 'Test Request',
    'request_type' => 'EXPENSE',
    'description' => 'This is a test request',
    'items' => [
        [
            'description' => 'Test Item',
            'amount' => 100.00,
            'quantity' => 1
        ]
    ]
];

$ch = curl_init('http://127.0.0.1:8000/api/requests');
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($requestData));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $token
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);

$response = curl_exec($ch);
$statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "Create request response status: $statusCode\n";
echo "Response: $response\n";

if ($statusCode == 201) {
    echo "✅ Success! Request created successfully!\n";
} else {
    echo "❌ Failed to create request\n";
}