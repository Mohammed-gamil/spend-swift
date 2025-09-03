import { authApi, tokenManager } from './api';
import { User, AuthResponse } from '@/types';

export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export interface LoginResponse {
  user: User;
  token: string;
  expires_at: string;
}

export const authService = {
  // Login user
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await authApi.login(credentials);
    tokenManager.setToken(response.token);
    return response;
  },

  // Logout user
  logout: async (): Promise<void> => {
    await authApi.logout();
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    return await authApi.getCurrentUser();
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return tokenManager.isAuthenticated();
  }
};
