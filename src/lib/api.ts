import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosProgressEvent } from 'axios';
import toast from 'react-hot-toast';
import { User, UserRole, LoginCredentials, AuthResponse, ApiResponse } from '@/types';

// Prevent multiple 401 redirects and toast spam
let handling401 = false;

// Create axios instance with base configuration
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Token management
export const tokenManager = {
  getToken: (): string | null => {
    return localStorage.getItem('auth_token');
  },
  
  setToken: (token: string): void => {
    localStorage.setItem('auth_token', token);
  },
  
  removeToken: (): void => {
    localStorage.removeItem('auth_token');
  },
  
  isAuthenticated: (): boolean => {
    const token = tokenManager.getToken();
    return !!token;
  }
};

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = tokenManager.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<unknown>>) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          if (!handling401) {
            handling401 = true;
            tokenManager.removeToken();
            toast.error('Session expired. Please login again.');
            // Reset flag after redirect
            setTimeout(() => {
              window.location.href = '/login';
            }, 100);
          }
          break;
        case 403:
          toast.error('Access denied. You do not have permission to perform this action.');
          break;
        case 404:
          toast.error('Resource not found.');
          break;
        case 422:
          if (data?.error?.details) {
            data.error.details.forEach((detail: string) => {
              toast.error(detail);
            });
          } else {
            toast.error(data?.error?.message || 'Validation error occurred.');
          }
          break;
        case 500:
          toast.error('Internal server error. Please try again later.');
          break;
        default:
          toast.error(data?.error?.message || 'An unexpected error occurred.');
      }
    } else if (error.request) {
      toast.error('Network error. Please check your connection.');
    } else {
      toast.error('An unexpected error occurred.');
    }
    
    return Promise.reject(error);
  }
);

// Demo mode flag - configurable via environment variable
const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';

// Mock user data for demo
const mockUsers = {
  'admin@demo.com': { id: '1', name: 'Admin User', email: 'admin@demo.com', role: 'ADMIN' as UserRole, status: 'active' as const },
  'manager@demo.com': { id: '2', name: 'Manager User', email: 'manager@demo.com', role: 'DIRECT_MANAGER' as UserRole, status: 'active' as const },
  'accountant@demo.com': { id: '3', name: 'Accountant User', email: 'accountant@demo.com', role: 'ACCOUNTANT' as UserRole, status: 'active' as const },
  'user@demo.com': { id: '4', name: 'Regular User', email: 'user@demo.com', role: 'USER' as UserRole, status: 'active' as const }
};

// Auth API
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    if (DEMO_MODE) {
      // Demo mode - simulate login
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      
      const user = mockUsers[credentials.email as keyof typeof mockUsers] || mockUsers['user@demo.com'];
      const token = `demo-token-${user.id}`;
      
      return {
        user,
        token,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      };
    }
    
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  logout: async (): Promise<void> => {
    if (DEMO_MODE) {
      tokenManager.removeToken();
      return;
    }
    
    await api.post('/auth/logout');
    tokenManager.removeToken();
  },

  getCurrentUser: async (): Promise<User> => {
    if (DEMO_MODE) {
      const token = tokenManager.getToken();
      if (token && token.startsWith('demo-token-')) {
        const userId = token.replace('demo-token-', '');
        const user = Object.values(mockUsers).find(u => u.id === userId) || mockUsers['user@demo.com'];
        return user;
      }
      throw new Error('Not authenticated');
    }
    
    const response = await api.get<User>('/user');
    return response.data;
  },

  refreshToken: async (): Promise<AuthResponse> => {
    if (DEMO_MODE) {
      const currentUser = await authApi.getCurrentUser();
      return {
        user: currentUser,
        token: tokenManager.getToken() || `demo-token-${currentUser.id}`,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      };
    }
    
    const response = await api.post<AuthResponse>('/auth/refresh');
    return response.data;
  }
};

// Generic API methods
export const apiClient = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    const response = await api.get<ApiResponse<T>>(url, config);
    return response.data;
  },

  post: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    const response = await api.post<ApiResponse<T>>(url, data, config);
    return response.data;
  },

  put: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    const response = await api.put<ApiResponse<T>>(url, data, config);
    return response.data;
  },

  patch: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    const response = await api.patch<ApiResponse<T>>(url, data, config);
    return response.data;
  },

  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    const response = await api.delete<ApiResponse<T>>(url, config);
    return response.data;
  },

  // File upload method
  upload: async <T>(url: string, formData: FormData, onUploadProgress?: (progressEvent: AxiosProgressEvent) => void): Promise<ApiResponse<T>> => {
    const response = await api.post<ApiResponse<T>>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
    return response.data;
  },

  // File download method
  download: async (url: string, filename?: string): Promise<void> => {
    const response = await api.get(url, {
      responseType: 'blob',
    });
    
    const blob = new Blob([response.data]);
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  }
};

export default api;
