import { apiClient } from './api';
import { ApiResponse } from '@/types';

// Types for profile operations
export interface ProfileUpdateData {
  name: string;
  phone?: string;
  position?: string;
  bio?: string;
}

export interface PasswordChangeData {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  request_updates: boolean;
  approval_reminders: boolean;
  system_updates: boolean;
}

export interface AvatarUploadResponse {
  avatar_url: string;
  message: string;
}

// Profile API methods
export const profileApi = {
  // Get user profile
  getProfile: async (): Promise<ApiResponse<any>> => {
    return apiClient.get('/user/profile');
  },

  // Update user profile
  updateProfile: async (data: ProfileUpdateData): Promise<ApiResponse<{ message: string }>> => {
    return apiClient.put('/user/profile', data);
  },

  // Change password
  changePassword: async (data: PasswordChangeData): Promise<ApiResponse<{ message: string }>> => {
    return apiClient.put('/user/change-password', data);
  },

  // Upload avatar
  uploadAvatar: async (file: File): Promise<ApiResponse<AvatarUploadResponse>> => {
    const formData = new FormData();
    formData.append('avatar', file);

    return apiClient.upload('/user/avatar', formData);
  },

  // Get notification preferences
  getNotificationPreferences: async (): Promise<ApiResponse<{ preferences: NotificationPreferences }>> => {
    return apiClient.get('/user/notification-preferences');
  },

  // Update notification preferences
  updateNotificationPreferences: async (preferences: NotificationPreferences): Promise<ApiResponse<{ message: string }>> => {
    return apiClient.put('/user/notification-preferences', { preferences });
  },

  // Update user preferences (language, timezone, etc.)
  updatePreferences: async (preferences: {
    language_preference?: string;
    timezone?: string;
    date_format?: string;
    currency?: string;
  }): Promise<ApiResponse<{ message: string }>> => {
    return apiClient.put('/user/preferences', { preferences });
  }
};