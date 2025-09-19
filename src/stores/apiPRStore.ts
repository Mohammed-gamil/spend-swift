import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { requestApi } from '@/lib/api';
import toast from 'react-hot-toast';
import { translations } from '@/lib/translations';
import { useLanguageStore } from '@/hooks/use-language';

interface ApiPRStoreState {
  prs: any[];
  isLoading: boolean;
  error: string | null;
}

interface ApiPRActions {
  // Create and update requests
  createRequest: (requestData: any) => Promise<void>;
  updateRequest: (id: string, requestData: any) => Promise<void>;
  
  // Get requests
  getPRs: () => Promise<void>;
  getRequest: (id: string) => Promise<any>;
  
  // Delete request
  deleteRequest: (id: string) => Promise<void>;
  
  // Request workflow actions
  submitRequest: (id: string, comments?: string) => Promise<void>;
  approveRequest: (id: string, comments?: string) => Promise<void>;
  rejectRequest: (id: string, comments: string) => Promise<void>;
  
  // Utility actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useApiPRStore = create<ApiPRStoreState & ApiPRActions>()(
  persist(
    (set, get) => ({
      prs: [],
      isLoading: false,
      error: null,

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      createRequest: async (requestData) => {
        try {
          set({ isLoading: true, error: null });
          
          console.log('Creating request via API:', requestData);
          
          const response = await requestApi.create(requestData);
          
          if (response.success && response.data) {
            // Add the new request to local state
            set((state) => ({
              prs: [...state.prs, response.data],
              isLoading: false,
              error: null,
            }));
            
            const lang = useLanguageStore.getState().language;
            toast.success(translations[lang]['pr.toast.createSuccess']);
          } else {
            throw new Error('Failed to create request');
          }
        } catch (error: unknown) {
          console.error('Create request error:', error);
          const errorMessage = error instanceof Error ? error.message : 'Failed to create request';
          set({ isLoading: false, error: errorMessage });
          const lang = useLanguageStore.getState().language;
          toast.error(translations[lang]['pr.toast.createError']);
          throw error;
        }
      },

      updateRequest: async (id, requestData) => {
        try {
          set({ isLoading: true, error: null });
          
          console.log('Updating request via API:', id, requestData);
          
          const response = await requestApi.update(id, requestData);
          
          if (response.success && response.data) {
            // Update the request in local state
            set((state) => ({
              prs: state.prs.map(pr => pr.id?.toString() === id ? response.data : pr),
              isLoading: false,
              error: null,
            }));
            
            const lang = useLanguageStore.getState().language;
            toast.success(translations[lang]['pr.toast.updateSuccess']);
          } else {
            throw new Error('Failed to update request');
          }
        } catch (error: unknown) {
          console.error('Update request error:', error);
          const errorMessage = error instanceof Error ? error.message : 'Failed to update request';
          set({ isLoading: false, error: errorMessage });
          const lang = useLanguageStore.getState().language;
          toast.error(translations[lang]['pr.toast.updateError']);
          throw error;
        }
      },

      getPRs: async () => {
        try {
          set({ isLoading: true, error: null });
          
          console.log('Fetching requests via API');
          
          const response = await requestApi.getAll();
          
          if (response.success && response.data) {
            set({
              prs: response.data,
              isLoading: false,
              error: null,
            });
          } else {
            throw new Error('Failed to fetch requests');
          }
        } catch (error: unknown) {
          console.error('Get requests error:', error);
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch requests';
          set({ isLoading: false, error: errorMessage });
          const lang = useLanguageStore.getState().language;
          toast.error(translations[lang]['pr.toast.fetchError']);
          throw error;
        }
      },

      getRequest: async (id: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await requestApi.getById(id);
          
          if (response.success && response.data) {
            // Update the specific request in local state
            set((state) => ({
              prs: state.prs.map(pr => pr.id?.toString() === id ? response.data : pr),
              isLoading: false,
              error: null,
            }));
            
            return response.data;
          } else {
            throw new Error('Failed to fetch request');
          }
        } catch (error: unknown) {
          console.error('Get request error:', error);
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch request';
          set({ isLoading: false, error: errorMessage });
          throw error;
        }
      },

      deleteRequest: async (id: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await requestApi.delete(id);
          
          if (response.success) {
            // Remove from local state
            set((state) => ({
              prs: state.prs.filter(pr => pr.id?.toString() !== id),
              isLoading: false,
              error: null,
            }));
            
            const lang = useLanguageStore.getState().language;
            toast.success(translations[lang]['pr.toast.deleteSuccess']);
          } else {
            throw new Error('Failed to delete request');
          }
        } catch (error: unknown) {
          console.error('Delete request error:', error);
          const errorMessage = error instanceof Error ? error.message : 'Failed to delete request';
          set({ isLoading: false, error: errorMessage });
          const lang = useLanguageStore.getState().language;
          toast.error(translations[lang]['pr.toast.deleteError']);
          throw error;
        }
      },

      submitRequest: async (id: string, comments?: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await requestApi.submit(id, comments);
          
          if (response.success && response.data) {
            // Update request in local state
            set((state) => ({
              prs: state.prs.map(pr => pr.id?.toString() === id ? response.data : pr),
              isLoading: false,
              error: null,
            }));
            
            const lang = useLanguageStore.getState().language;
            toast.success('Request submitted successfully');
          } else {
            throw new Error('Failed to submit request');
          }
        } catch (error: unknown) {
          console.error('Submit request error:', error);
          const errorMessage = error instanceof Error ? error.message : 'Failed to submit request';
          set({ isLoading: false, error: errorMessage });
          toast.error('Failed to submit request');
          throw error;
        }
      },

      approveRequest: async (id: string, comments?: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await requestApi.approve(id, comments);
          
          if (response.success && response.data) {
            // Update request in local state
            set((state) => ({
              prs: state.prs.map(pr => pr.id?.toString() === id ? response.data : pr),
              isLoading: false,
              error: null,
            }));
            
            const lang = useLanguageStore.getState().language;
            toast.success('Request approved successfully');
          } else {
            throw new Error('Failed to approve request');
          }
        } catch (error: unknown) {
          console.error('Approve request error:', error);
          const errorMessage = error instanceof Error ? error.message : 'Failed to approve request';
          set({ isLoading: false, error: errorMessage });
          toast.error('Failed to approve request');
          throw error;
        }
      },

      rejectRequest: async (id: string, comments: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await requestApi.reject(id, comments);
          
          if (response.success && response.data) {
            // Update request in local state
            set((state) => ({
              prs: state.prs.map(pr => pr.id?.toString() === id ? response.data : pr),
              isLoading: false,
              error: null,
            }));
            
            const lang = useLanguageStore.getState().language;
            toast.success('Request rejected successfully');
          } else {
            throw new Error('Failed to reject request');
          }
        } catch (error: unknown) {
          console.error('Reject request error:', error);
          const errorMessage = error instanceof Error ? error.message : 'Failed to reject request';
          set({ isLoading: false, error: errorMessage });
          toast.error('Failed to reject request');
          throw error;
        }
      },
    }),
    {
      name: 'api-pr-storage',
      partialize: (state) => ({
        prs: state.prs,
      }),
    }
  )
);