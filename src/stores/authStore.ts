import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, RegisterCredentials } from '@/types';
import { authService } from '@/lib/auth';
import { enhanceUserWithRoles, mockRoleAssignment } from '@/lib/role-utils';
import toast from 'react-hot-toast';
import { useLanguageStore } from '@/hooks/use-language';
import { translations } from '@/lib/translations';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
  updateUser: (user: User) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (email: string, password: string, remember = false) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await authService.login({ email, password, remember });
          
          // Use role information directly from backend if available
          let enhancedUser: User;
          if (response.user.role && response.user.role_names) {
            // Backend provides role information, use it directly
            enhancedUser = {
              ...response.user,
              roles: response.user.role_names, // Use the role names array from backend
            };
          } else {
            // Fallback to role enhancement for demo mode or missing role data
            enhancedUser = await enhanceUserWithRoles(response.user);
          }
          
          set({
            user: enhancedUser,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          
          {
            const lang = useLanguageStore.getState().language;
            const template = translations[lang]['auth.toast.welcomeBack'];
            const message = template.replace('{name}', enhancedUser.name);
            toast.success(message);
          }
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Login failed';
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      register: async (credentials: RegisterCredentials) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await authService.register(credentials);
          
          set({
            isLoading: false,
            error: null,
          });
          
          {
            const lang = useLanguageStore.getState().language;
            toast.success(translations[lang]['auth.toast.logoutSuccess'] || 'Registration successful!');
          }
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Registration failed';
          set({
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          set({ isLoading: true });
          
          await authService.logout();
          
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
          
          {
            const lang = useLanguageStore.getState().language;
            toast.success(translations[lang]['auth.toast.logoutSuccess']);
          }
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Logout failed';
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null, // Clear error even if logout fails
          });
          
          console.error('Logout error:', errorMessage);
        }
      },

      getCurrentUser: async () => {
        try {
          set({ isLoading: true, error: null });
          
          const user = await authService.getCurrentUser();
          
          // Use role information directly from backend if available
          let enhancedUser: User;
          if (user.role && user.role_names) {
            // Backend provides role information, use it directly
            enhancedUser = {
              ...user,
              roles: user.role_names, // Use the role names array from backend
            };
          } else {
            // Fallback to role enhancement for demo mode or missing role data
            enhancedUser = await enhanceUserWithRoles(user);
          }
          
          set({
            user: enhancedUser,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to get user';
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      updateUser: (user: User) => {
        set({ user });
      },

      clearError: () => {
        set({ error: null });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
