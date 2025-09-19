import { authApi, tokenManager } from './api';
import { User, AuthResponse, LoginCredentials, RegisterCredentials, RegisterResponse } from '@/types';

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export const authService = {
  // Login user
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await authApi.login(credentials);
    tokenManager.setToken(response.access_token);
    return response;
  },

  // Register user
  register: async (credentials: RegisterCredentials): Promise<RegisterResponse> => {
    return await authApi.register(credentials);
  },

  // Logout user
  logout: async (): Promise<void> => {
    await authApi.logout();
    tokenManager.removeToken();
  },

  // Get current user profile
  getCurrentUser: async (): Promise<User> => {
    return await authApi.getCurrentUser();
  },

  // Refresh JWT token
  refreshToken: async (): Promise<AuthResponse> => {
    const response = await authApi.refreshToken();
    tokenManager.setToken(response.access_token);
    return response;
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return tokenManager.isAuthenticated();
  }
};
