import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosProgressEvent } from 'axios';
import toast from 'react-hot-toast';
import { 
  User, 
  UserRole, 
  LoginCredentials, 
  RegisterCredentials, 
  AuthResponse, 
  RegisterResponse,
  ApiResponse,
  Department,
  DepartmentListResponse
} from '@/types';

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
  (response: AxiosResponse) => {
    // Reset 401 handling flag on successful response
    handling401 = false;
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

console.log('API Configuration:', {
  VITE_API_URL: import.meta.env.VITE_API_URL,
  VITE_DEMO_MODE: import.meta.env.VITE_DEMO_MODE,
  DEMO_MODE,
  MODE: import.meta.env.MODE
});

// Mock user data for demo
const mockUsers = {
  'admin@demo.com': { 
    id: 1, 
    name: 'Admin User', 
    email: 'admin@demo.com', 
    role: 'ADMIN' as UserRole, 
    status: 'active' as const,
    language_preference: 'en',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    department_id: null,
    email_verified_at: null,
    direct_manager_id: null
  },
  'manager@demo.com': { 
    id: 2, 
    name: 'Manager User', 
    email: 'manager@demo.com', 
    role: 'DIRECT_MANAGER' as UserRole, 
    status: 'active' as const,
    language_preference: 'en',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    department_id: 1,
    email_verified_at: null,
    direct_manager_id: null
  },
  'accountant@demo.com': { 
    id: 3, 
    name: 'Accountant User', 
    email: 'accountant@demo.com', 
    role: 'ACCOUNTANT' as UserRole, 
    status: 'active' as const,
    language_preference: 'en',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    department_id: 2,
    email_verified_at: null,
    direct_manager_id: null
  },
  'user@demo.com': { 
    id: 4, 
    name: 'Regular User', 
    email: 'user@demo.com', 
    role: 'USER' as UserRole, 
    status: 'active' as const,
    language_preference: 'en',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    department_id: 1,
    email_verified_at: null,
    direct_manager_id: 2
  }
};

// Auth API
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    if (DEMO_MODE) {
      // Demo mode - simulate login
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      
      const user = mockUsers[credentials.email as keyof typeof mockUsers] || mockUsers['user@demo.com'];
      return {
        access_token: `demo-token-${user.id}`,
        token_type: 'bearer',
        expires_in: 86400,
        user
      };
    }
    
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  register: async (credentials: RegisterCredentials): Promise<RegisterResponse> => {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newUser: User = {
        id: Math.floor(Math.random() * 1000),
        name: credentials.name,
        email: credentials.email,
        language_preference: 'en',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        department_id: credentials.department_id || null,
        email_verified_at: null,
        direct_manager_id: null,
        role: 'USER',
        status: 'active'
      };
      return {
        message: 'User successfully registered',
        user: newUser
      };
    }
    
    const response = await api.post<RegisterResponse>('/auth/register', credentials);
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
        const user = Object.values(mockUsers).find(u => u.id.toString() === userId) || mockUsers['user@demo.com'];
        return user;
      }
      throw new Error('Not authenticated');
    }
    
    const response = await api.get<User>('/auth/profile');
    return response.data;
  },

  refreshToken: async (): Promise<AuthResponse> => {
    if (DEMO_MODE) {
      const currentUser = await authApi.getCurrentUser();
      return {
        access_token: tokenManager.getToken() || `demo-token-${currentUser.id}`,
        token_type: 'bearer',
        expires_in: 86400,
        user: currentUser
      };
    }
    
    const response = await api.post<AuthResponse>('/auth/refresh');
    return response.data;
  }
};

// Profile API
export const profileApi = {
  updateProfile: async (data: {
    name: string;
    phone?: string;
    position?: string;
    bio?: string;
    timezone?: string;
    date_format?: string;
    currency?: string;
  }) => {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { message: 'Profile updated successfully' };
    }
    
    const response = await api.put('/profile', data);
    return response.data;
  },

  changePassword: async (data: {
    current_password: string;
    new_password: string;
    confirm_password: string;
  }) => {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { message: 'Password changed successfully' };
    }
    
    const response = await api.put('/profile/password', data);
    return response.data;
  },

  getNotificationPreferences: async () => {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        preferences: {
          email: true,
          push: false,
          sms: false,
          request_updates: true,
          approval_reminders: true,
          system_updates: false,
        }
      };
    }
    
    const response = await api.get('/profile/notifications');
    return response.data;
  },

  updateNotificationPreferences: async (preferences: {
    email: boolean;
    push: boolean;
    sms: boolean;
    request_updates: boolean;
    approval_reminders: boolean;
    system_updates: boolean;
  }) => {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { 
        message: 'Notification preferences updated successfully',
        preferences 
      };
    }
    
    const response = await api.put('/profile/notifications', preferences);
    return response.data;
  },

  updatePreferences: async (data: {
    language_preference: string;
    timezone: string;
    date_format: string;
    currency: string;
  }) => {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { message: 'Preferences updated successfully' };
    }
    
    const response = await api.put('/profile/preferences', data);
    return response.data;
  },

  uploadAvatar: async (file: File) => {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return { 
        message: 'Avatar uploaded successfully',
        avatar_url: URL.createObjectURL(file)
      };
    }
    
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await api.post('/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteAvatar: async () => {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { message: 'Avatar deleted successfully' };
    }
    
    const response = await api.delete('/profile/avatar');
    return response.data;
  }
};

// Department API
export const departmentApi = {
  getAll: async (): Promise<DepartmentListResponse> => {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        data: [
          {
            id: 1,
            name: 'IT Department',
            description: 'Information Technology',
            code: 'IT',
            manager_id: 2,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 2,
            name: 'Finance Department',
            description: 'Financial Operations',
            code: 'FIN',
            manager_id: 3,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]
      };
    }
    
    const response = await api.get<DepartmentListResponse>('/admin/departments');
    return response.data;
  },

  getById: async (id: number): Promise<Department> => {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        id,
        name: 'IT Department',
        description: 'Information Technology',
        code: 'IT',
        manager_id: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }
    
    const response = await api.get<Department>(`/admin/departments/${id}`);
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

// Request Management APIs
export const requestApi = {
  // Get all requests
  getAll: async (): Promise<ApiResponse<any[]>> => {
    return apiClient.get<any[]>('/requests');
  },

  // Get single request
  getById: async (id: string): Promise<ApiResponse<any>> => {
    return apiClient.get<any>(`/requests/${id}`);
  },

  // Create new request
  create: async (requestData: any): Promise<ApiResponse<any>> => {
    // Transform frontend data to backend format
    const backendData = transformRequestToBackend(requestData);
    return apiClient.post<any>('/requests', backendData);
  },

  // Update existing request
  update: async (id: string, requestData: any): Promise<ApiResponse<any>> => {
    // Transform frontend data to backend format
    const backendData = transformRequestToBackend(requestData);
    return apiClient.put<any>(`/requests/${id}`, backendData);
  },

  // Delete request
  delete: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/requests/${id}`);
  },

  // Submit request for approval
  submit: async (id: string, comments?: string): Promise<ApiResponse<any>> => {
    return apiClient.post<any>(`/requests/${id}/submit`, { comments });
  },

  // Approve request
  approve: async (id: string, comments?: string): Promise<ApiResponse<any>> => {
    return apiClient.post<any>(`/requests/${id}/approve`, { comments });
  },

  // Reject request
  reject: async (id: string, comments: string): Promise<ApiResponse<any>> => {
    return apiClient.post<any>(`/requests/${id}/reject`, { comments });
  },

  // Return request for revision
  return: async (id: string, comments: string): Promise<ApiResponse<any>> => {
    return apiClient.post<any>(`/requests/${id}/return`, { comments });
  },

  // Second approval by manager (for quote workflow)
  secondApproval: async (id: string, comments?: string): Promise<ApiResponse<any>> => {
    return apiClient.post<any>(`/requests/${id}/second-approval`, { comments });
  },

  // Final approval by accountant
  finalApproval: async (id: string, comments?: string): Promise<ApiResponse<any>> => {
    return apiClient.post<any>(`/requests/${id}/final-approval`, { comments });
  },

  // Process request by accountant (request quotes)
  processByAccountant: async (id: string, comments?: string): Promise<ApiResponse<any>> => {
    return apiClient.post<any>(`/requests/${id}/process-by-accountant`, { comments });
  },
};

// Quote Management APIs
export const quoteApi = {
  // Get quotes for a request
  getForRequest: async (requestId: string): Promise<ApiResponse<{ quotes: any[], statistics: any, request: any }>> => {
    return apiClient.get<{ quotes: any[], statistics: any, request: any }>(`/requests/${requestId}/quotes`);
  },

  // Add quote to request
  add: async (requestId: string, quoteData: any): Promise<ApiResponse<any>> => {
    return apiClient.post<any>(`/requests/${requestId}/quotes`, quoteData);
  },

  // Update quote
  update: async (requestId: string, quoteId: string, quoteData: any): Promise<ApiResponse<any>> => {
    return apiClient.put<any>(`/requests/${requestId}/quotes/${quoteId}`, quoteData);
  },

  // Delete quote
  delete: async (requestId: string, quoteId: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/requests/${requestId}/quotes/${quoteId}`);
  },

  // Select quote
  select: async (requestId: string, quoteId: string, comments?: string): Promise<ApiResponse<any>> => {
    return apiClient.post<any>(`/requests/${requestId}/quotes/${quoteId}/select`, { comments });
  },

  // Request quotes (by accountant)
  request: async (requestId: string, comments?: string): Promise<ApiResponse<any>> => {
    return apiClient.post<any>(`/requests/${requestId}/request-quotes`, { comments });
  },

  // Get requests needing quotes
  getRequestsNeedingQuotes: async (): Promise<ApiResponse<any[]>> => {
    return apiClient.get<any[]>('/quotes/requests-needing-quotes');
  },

  // Get requests with quotes
  getRequestsWithQuotes: async (): Promise<ApiResponse<any[]>> => {
    return apiClient.get<any[]>('/quotes/requests-with-quotes');
  },
};

// Helper function to transform frontend request data to backend format
function transformRequestToBackend(requestData: any): any {
  const backendData: any = {
    type: requestData.type,
    title: requestData.title,
    description: requestData.description,
    category: requestData.category,
    total_cost: requestData.desiredCost, // Backend expects total_cost
    currency: requestData.currency,
    submitted_at: requestData.neededByDate?.toISOString?.() || requestData.neededByDate,
  };

  // Add items if present
  if (requestData.items && requestData.items.length > 0) {
    backendData.items = requestData.items.map((item: any) => ({
      name: item.name,
      quantity: item.quantity,
      unit_price: item.unitPrice, // Backend expects unit_price
      vendor_hint: item.vendorHint, // Backend expects vendor_hint
    }));
  }

  // Add project-specific fields if it's a project request
  if (requestData.type === 'project') {
    backendData.project_details = {
      client_name: requestData.clientName,
      project_description: requestData.projectDescription,
      total_cost: requestData.totalCost,
      total_benefit: requestData.totalBenefit,
      total_price: requestData.totalPrice,
    };
  }

  return backendData;
}

export default api;
