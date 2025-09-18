<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;
use App\Models\User;

class ProfileController extends Controller
{
    /**
     * Update user profile information.
     */
    public function updateProfile(Request $request)
    {
        $user = Auth::guard('api')->user();
        
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|min:2|max:100',
            'phone' => 'nullable|string|max:20',
            'position' => 'nullable|string|max:100',
            'bio' => 'nullable|string|max:500',
            'timezone' => 'nullable|string|max:50',
            'date_format' => 'nullable|string|max:20',
            'currency' => 'nullable|string|max:10',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user->update($validator->validated());
            
            return response()->json([
                'message' => 'Profile updated successfully',
                'user' => $user->fresh()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update profile',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Change user password.
     */
    public function changePassword(Request $request)
    {
        $user = Auth::guard('api')->user();
        
        $validator = Validator::make($request->all(), [
            'current_password' => 'required|string',
            'new_password' => ['required', 'string', Password::min(8)->mixedCase()->numbers()->symbols()],
            'confirm_password' => 'required|string|same:new_password',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Verify current password
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'message' => 'Current password is incorrect',
                'errors' => ['current_password' => ['Current password is incorrect']]
            ], 422);
        }

        try {
            $user->update([
                'password' => Hash::make($request->new_password)
            ]);
            
            return response()->json([
                'message' => 'Password changed successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to change password',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update notification preferences.
     */
    public function updateNotificationPreferences(Request $request)
    {
        $user = Auth::guard('api')->user();
        
        $validator = Validator::make($request->all(), [
            'email' => 'required|boolean',
            'push' => 'required|boolean',
            'sms' => 'required|boolean',
            'request_updates' => 'required|boolean',
            'approval_reminders' => 'required|boolean',
            'system_updates' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user->update([
                'notification_preferences' => $validator->validated()
            ]);
            
            return response()->json([
                'message' => 'Notification preferences updated successfully',
                'preferences' => $user->notification_preferences
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update notification preferences',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update user preferences (language, timezone, etc.).
     */
    public function updatePreferences(Request $request)
    {
        $user = Auth::guard('api')->user();
        
        $validator = Validator::make($request->all(), [
            'language_preference' => 'required|string|in:en,ar,fr,es',
            'timezone' => 'required|string|max:50',
            'date_format' => 'required|string|in:Y-m-d,d/m/Y,m/d/Y',
            'currency' => 'required|string|in:USD,EUR,GBP,EGP,SAR,AED',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user->update($validator->validated());
            
            return response()->json([
                'message' => 'Preferences updated successfully',
                'user' => $user->fresh()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update preferences',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Upload user avatar.
     */
    public function uploadAvatar(Request $request)
    {
        $user = Auth::guard('api')->user();
        
        $validator = Validator::make($request->all(), [
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048', // 2MB max
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Delete old avatar if exists
            if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
                Storage::disk('public')->delete($user->avatar);
            }

            // Store new avatar
            $avatarPath = $request->file('avatar')->store('avatars', 'public');
            
            $user->update([
                'avatar' => $avatarPath
            ]);
            
            return response()->json([
                'message' => 'Avatar uploaded successfully',
                'avatar_url' => Storage::disk('public')->url($avatarPath),
                'user' => $user->fresh()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to upload avatar',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete user avatar.
     */
    public function deleteAvatar()
    {
        $user = Auth::guard('api')->user();
        
        try {
            // Delete avatar file if exists
            if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
                Storage::disk('public')->delete($user->avatar);
            }

            $user->update([
                'avatar' => null
            ]);
            
            return response()->json([
                'message' => 'Avatar deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete avatar',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get user's current notification preferences.
     */
    public function getNotificationPreferences()
    {
        $user = Auth::guard('api')->user();
        
        // Default preferences if none set
        $defaultPreferences = [
            'email' => true,
            'push' => false,
            'sms' => false,
            'request_updates' => true,
            'approval_reminders' => true,
            'system_updates' => false,
        ];
        
        $preferences = $user->notification_preferences ?? $defaultPreferences;
        
        return response()->json([
            'preferences' => $preferences
        ]);
    }
}
