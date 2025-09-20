<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\JsonResponse;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        // Default role
        if (method_exists($user, 'assignRole')) {
            $user->assignRole('user');
        }

        $token = auth('api')->login($user);

        return response()->json(['access_token' => $token, 'token_type' => 'bearer', 'expires_in' => auth('api')->factory()->getTTL() * 60], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if (!$token = auth('api')->attempt($credentials)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        return response()->json(['access_token' => $token, 'token_type' => 'bearer', 'expires_in' => auth('api')->factory()->getTTL() * 60]);
    }

    public function logout(): JsonResponse
    {
        auth('api')->logout();
        return response()->json(['message' => 'Successfully logged out']);
    }

    public function refresh(): JsonResponse
    {
        $token = auth('api')->refresh();
        return response()->json(['access_token' => $token, 'token_type' => 'bearer', 'expires_in' => auth('api')->factory()->getTTL() * 60]);
    }

    public function me(): JsonResponse
    {
        return response()->json(auth('api')->user());
    }
}
