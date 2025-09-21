import toast from 'react-hot-toast';
import { User, UserRole, LoginCredentials, AuthResponse, ApiResponse } from '@/types';

// This module replaces the original axios-based API client with a pure in-memory mock.
// It preserves the same exported symbols used across the app so components and stores
// keep functioning without actual network calls.

// Token management (uses localStorage to persist demo tokens)
export const tokenManager = {
  getToken: (): string | null => localStorage.getItem('auth_token'),
  setToken: (token: string): void => localStorage.setItem('auth_token', token),
  removeToken: (): void => localStorage.removeItem('auth_token'),
  isAuthenticated: (): boolean => !!localStorage.getItem('auth_token'),
};

// Simple mock users
const mockUsers: Record<string, User> = {
  'admin@demo.com': { id: '1', name: 'Admin User', email: 'admin@demo.com', role: 'ADMIN' as UserRole, status: 'active' },
  'manager@demo.com': { id: '2', name: 'Manager User', email: 'manager@demo.com', role: 'DIRECT_MANAGER' as UserRole, status: 'active' },
  'accountant@demo.com': { id: '3', name: 'Accountant User', email: 'accountant@demo.com', role: 'ACCOUNTANT' as UserRole, status: 'active' },
  'user@demo.com': { id: '4', name: 'Regular User', email: 'user@demo.com', role: 'USER' as UserRole, status: 'active' },
};

// Helper to resolve current mock user from token
const getUserFromToken = (): User | null => {
  const token = tokenManager.getToken();
  if (!token) return null;
  if (token.startsWith('demo-token-')) {
    const id = token.replace('demo-token-', '');
    return Object.values(mockUsers).find(u => u.id === id) || Object.values(mockUsers)[0];
  }
  return null;
};

// authApi: behaves synchronously/quickly and returns ApiResponse-shaped data where applicable
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // simulate small delay
    await new Promise((r) => setTimeout(r, 250));

    const user = mockUsers[credentials.email] || mockUsers['user@demo.com'];
    const token = `demo-token-${user.id}`;

    return {
      user,
      token,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };
  },

  logout: async (): Promise<void> => {
    await new Promise((r) => setTimeout(r, 100));
    tokenManager.removeToken();
  },

  getCurrentUser: async (): Promise<User> => {
    await new Promise((r) => setTimeout(r, 100));
    const user = getUserFromToken();
    if (!user) throw new Error('Not authenticated');
    return user;
  },

  refreshToken: async (): Promise<AuthResponse> => {
    await new Promise((r) => setTimeout(r, 100));
    const user = getUserFromToken();
    if (!user) throw new Error('Not authenticated');
    const token = tokenManager.getToken() || `demo-token-${user.id}`;
    return { user, token, expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() };
  },
};

// apiClient: minimal router that returns mocked ApiResponse<T>
export const apiClient = {
  get: async <T>(url: string): Promise<ApiResponse<T>> => {
    await new Promise((r) => setTimeout(r, 150));

    // Very small set of supported routes used by the app
    if (url === '/user/profile' || url === '/user') {
      const user = getUserFromToken() || mockUsers['user@demo.com'];
      return { success: true, data: (user as unknown as T) };
    }

    if (url === '/user/notification-preferences') {
      const prefs = {
        email: true,
        push: false,
        sms: false,
        request_updates: true,
        approval_reminders: true,
        system_updates: false,
      };
      return { success: true, data: (prefs as unknown as T) };
    }

    // Default empty successful response
    return { success: true };
  },

  post: async <T>(url: string, data?: unknown): Promise<ApiResponse<T>> => {
    await new Promise((r) => setTimeout(r, 150));

    // Simple behavior for profile updates or auth actions if needed
    if (url === '/auth/login') {
      // not used (authApi.login used instead)
      return { success: true };
    }

    return { success: true };
  },

  put: async <T>(url: string, data?: unknown): Promise<ApiResponse<T>> => {
    await new Promise((r) => setTimeout(r, 150));

    if (url === '/user/profile') {
      // update stored mock (persist to localStorage so UI sees changes)
      const current = getUserFromToken() || mockUsers['user@demo.com'];
      const updated = { ...current, ...(data as any) } as User;
      // persist updated mock into localStorage
      localStorage.setItem('mock_user_profile', JSON.stringify(updated));
      return { success: true, data: (updated as unknown as T) };
    }

    if (url === '/user/notification-preferences') {
      return { success: true, data: (data as unknown as T) };
    }

    return { success: true };
  },

  patch: async <T>(_url: string, _data?: unknown): Promise<ApiResponse<T>> => {
    await new Promise((r) => setTimeout(r, 100));
    return { success: true };
  },

  delete: async <T>(_url: string): Promise<ApiResponse<T>> => {
    await new Promise((r) => setTimeout(r, 100));
    return { success: true };
  },

  upload: async <T>(_url: string, _formData: FormData): Promise<ApiResponse<T>> => {
    await new Promise((r) => setTimeout(r, 200));
    // Return a fake avatar URL
    return { success: true, data: ({ avatar_url: '/avatar-placeholder.png', message: 'Uploaded' } as unknown as T) };
  },

  download: async (_url: string, _filename?: string): Promise<void> => {
    // No-op for downloads in mock mode
    return;
  },
};

// Export a default no-op object for compatibility
const api = {
  // retained shape (no-op)
};

export default api;
