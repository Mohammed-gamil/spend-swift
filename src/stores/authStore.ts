import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';
import { authService } from '@/lib/auth';
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
          
          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          
          {
            const lang = useLanguageStore.getState().language;
            const template = translations[lang]['auth.toast.welcomeBack'];
            const message = template.replace('{name}', response.user.name);
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
          
          set({
            user,
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
