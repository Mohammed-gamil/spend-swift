import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  Request, 
  PurchaseRequest, 
  ProjectRequest,
  PRState, 
  UserRole, 
  Approval, 
  CreatePurchaseRequestForm,
  CreateProjectRequestForm,
  CreateRequestForm,
  RequestType
} from '@/types';
import toast from 'react-hot-toast';
import { translations } from '@/lib/translations';
import { useLanguageStore } from '@/hooks/use-language';
import { requestApi } from '@/lib/api';

interface PRStoreState {
  prs: Request[];
  isLoading: boolean;
  error: string | null;
}

interface PRActions {
  // Create requests (both purchase and project)
  createRequest: (requestData: CreateRequestForm) => Promise<void>;
  createPR: (prData: CreatePurchaseRequestForm) => Promise<void>; // Keep for backwards compatibility
  
  // Update, delete and get requests
  updatePR: (id: string, updates: Partial<Request>) => Promise<void>;
  deletePR: (id: string) => Promise<void>;
  getPRs: () => Promise<void>;
  
  // Approval workflow
  approvePR: (id: string, comments?: string) => Promise<void>;
  rejectPR: (id: string, comments: string) => Promise<void>;
  
  // Utility actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// Mock current user - in real app this would come from auth store
const getCurrentUser = () => ({
  id: 'user-1',
  name: 'John Doe',
  email: 'john@company.com',
  role: 'USER' as UserRole,
  status: 'active' as const,
});

// Mock approval logic based on user role
const getNextState = (currentState: PRState, userRole: UserRole): PRState => {
  const stateFlow: Record<PRState, Record<UserRole, PRState>> = {
    'DRAFT': {
      'USER': 'SUBMITTED',
      'DIRECT_MANAGER': 'SUBMITTED',
      'ACCOUNTANT': 'SUBMITTED',
      'FINAL_MANAGER': 'SUBMITTED',
      'ADMIN': 'SUBMITTED',
    },
    'SUBMITTED': {
      'USER': 'SUBMITTED',
      'DIRECT_MANAGER': 'DM_APPROVED',
      'ACCOUNTANT': 'SUBMITTED',
      'FINAL_MANAGER': 'SUBMITTED',
      'ADMIN': 'FINAL_APPROVED',
    },
    'DM_APPROVED': {
      'USER': 'DM_APPROVED',
      'DIRECT_MANAGER': 'DM_APPROVED',
      'ACCOUNTANT': 'ACCT_APPROVED',
      'FINAL_MANAGER': 'DM_APPROVED',
      'ADMIN': 'FINAL_APPROVED',
    },
    'DM_REJECTED': {
      'USER': 'DM_REJECTED',
      'DIRECT_MANAGER': 'DM_REJECTED',
      'ACCOUNTANT': 'DM_REJECTED',
      'FINAL_MANAGER': 'DM_REJECTED',
      'ADMIN': 'DM_REJECTED',
    },
    'ACCT_APPROVED': {
      'USER': 'ACCT_APPROVED',
      'DIRECT_MANAGER': 'ACCT_APPROVED',
      'ACCOUNTANT': 'ACCT_APPROVED',
      'FINAL_MANAGER': 'FINAL_APPROVED',
      'ADMIN': 'FINAL_APPROVED',
    },
    'ACCT_REJECTED': {
      'USER': 'ACCT_REJECTED',
      'DIRECT_MANAGER': 'ACCT_REJECTED',
      'ACCOUNTANT': 'ACCT_REJECTED',
      'FINAL_MANAGER': 'ACCT_REJECTED',
      'ADMIN': 'ACCT_REJECTED',
    },
    'FINAL_APPROVED': {
      'USER': 'FINAL_APPROVED',
      'DIRECT_MANAGER': 'FINAL_APPROVED',
      'ACCOUNTANT': 'FINAL_APPROVED',
      'FINAL_MANAGER': 'FINAL_APPROVED',
      'ADMIN': 'FUNDS_TRANSFERRED',
    },
    'FINAL_REJECTED': {
      'USER': 'FINAL_REJECTED',
      'DIRECT_MANAGER': 'FINAL_REJECTED',
      'ACCOUNTANT': 'FINAL_REJECTED',
      'FINAL_MANAGER': 'FINAL_REJECTED',
      'ADMIN': 'FINAL_REJECTED',
    },
    'FUNDS_TRANSFERRED': {
      'USER': 'FUNDS_TRANSFERRED',
      'DIRECT_MANAGER': 'FUNDS_TRANSFERRED',
      'ACCOUNTANT': 'FUNDS_TRANSFERRED',
      'FINAL_MANAGER': 'FUNDS_TRANSFERRED',
      'ADMIN': 'FUNDS_TRANSFERRED',
    },
  };
  
  return stateFlow[currentState]?.[userRole] || currentState;
};

export const usePRStore = create<PRStoreState & PRActions>()(
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

      // Generic request creation - handles both purchase and project requests
      createRequest: async (requestData) => {
        try {
          set({ isLoading: true, error: null });
          
          console.log('Creating request via API:', requestData);
          
          // Call real API
          const response = await requestApi.create(requestData);
          
          if (response.success && response.data) {
            // Transform backend response to frontend format
            const newRequest = transformBackendToFrontend(response.data);
            
            set((state) => ({
              prs: [...state.prs, newRequest],
              isLoading: false,
              error: null,
            }));
            
            const lang = useLanguageStore.getState().language;
            toast.success(translations[lang]['pr.toast.createSuccess']);
          } else {
            throw new Error(response.message || 'Failed to create request');
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

      // Backward compatibility method - maps to createRequest for purchase type
      createPR: async (prData) => {
        try {
          set({ isLoading: true, error: null });
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const currentUser = getCurrentUser();
          const newPR: PurchaseRequest = {
            ...prData,
            type: 'purchase',
            id: `pr-${Date.now()}`,
            requesterId: currentUser.id,
            requester: currentUser,
            state: 'DRAFT',
            approvals: [],
            quotes: [],
            createdAt: new Date(),
            updatedAt: new Date(),
            items: prData.items.map((item, index) => ({
              id: `item-${index + 1}`,
              name: item.name,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              vendorHint: item.vendorHint,
              total: item.quantity * item.unitPrice,
            }))
          };
          
          set((state) => ({
            prs: [...state.prs, newPR],
            isLoading: false,
            error: null,
          }));
          
          const lang = useLanguageStore.getState().language;
          toast.success(translations[lang]['pr.toast.createSuccess']);
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to create purchase request';
          set({ isLoading: false, error: errorMessage });
          const lang = useLanguageStore.getState().language;
          toast.error(translations[lang]['pr.toast.createError']);
          throw error;
        }
      },

      updatePR: async (id, updates) => {
        try {
          set({ isLoading: true, error: null });
          
          console.log('Updating request via API:', id, updates);
          
          // Call real API
          const response = await requestApi.update(id, updates);
          
          if (response.success && response.data) {
            // Transform backend response to frontend format
            const updatedRequest = transformBackendToFrontend(response.data);
            
            set((state) => ({
              prs: state.prs.map(pr => pr.id === id ? updatedRequest : pr),
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

      deletePR: async (id) => {
        try {
          set({ isLoading: true, error: null });
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set((state) => ({
            prs: state.prs.filter(pr => pr.id !== id),
            isLoading: false,
            error: null,
          }));
          
          {
            const lang = useLanguageStore.getState().language;
            toast.success(translations[lang]['pr.toast.deleteSuccess']);
          }
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to delete request';
          set({ isLoading: false, error: errorMessage });
          {
            const lang = useLanguageStore.getState().language;
            toast.error(translations[lang]['pr.toast.deleteError']);
          }
          throw error;
        }
      },

      getPRs: async () => {
        try {
          set({ isLoading: true, error: null });
          
          console.log('Fetching requests via API');
          
          // Call real API
          const response = await requestApi.getAll();
          
          if (response.success && response.data) {
            // Transform backend responses to frontend format
            const requests = response.data.map(transformBackendToFrontend);
            
            set({
              prs: requests,
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

      approvePR: async (id, comments = '') => {
        try {
          set({ isLoading: true, error: null });
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const currentUser = getCurrentUser();
          const currentPR = get().prs.find(pr => pr.id === id);
          
          if (!currentPR) {
            throw new Error('Request not found');
          }
          
          const newState = getNextState(currentPR.state, currentUser.role);
          const newApproval: Approval = {
            id: `approval-${Date.now()}`,
            stage: currentUser.role === 'DIRECT_MANAGER' ? 'DM' : 
                   currentUser.role === 'ACCOUNTANT' ? 'ACCT' : 'FINAL',
            approverId: currentUser.id,
            approver: currentUser,
            decision: 'APPROVED',
            comment: comments,
            decidedAt: new Date(),
            createdAt: new Date(),
          };
          
          set((state) => ({
            prs: state.prs.map(pr => 
              pr.id === id 
                ? { 
                    ...pr, 
                    state: newState,
                    approvals: [...pr.approvals, newApproval],
                    updatedAt: new Date(),
                  }
                : pr
            ),
            isLoading: false,
            error: null,
          }));
          
          {
            const lang = useLanguageStore.getState().language;
            toast.success(translations[lang]['pr.toast.approveSuccess']);
          }
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to approve request';
          set({ isLoading: false, error: errorMessage });
          {
            const lang = useLanguageStore.getState().language;
            toast.error(translations[lang]['pr.toast.approveError']);
          }
          throw error;
        }
      },

      rejectPR: async (id, comments) => {
        try {
          set({ isLoading: true, error: null });
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const currentUser = getCurrentUser();
          const currentPR = get().prs.find(pr => pr.id === id);
          
          if (!currentPR) {
            throw new Error('Request not found');
          }
          
          const prState = currentPR.state;
          const rejectedState: PRState = 
            prState === 'SUBMITTED' ? 'DM_REJECTED' :
            prState === 'DM_APPROVED' ? 'ACCT_REJECTED' :
            prState === 'ACCT_APPROVED' ? 'FINAL_REJECTED' :
            // Default to a final rejection if state is unusual
            'FINAL_REJECTED';
          
          const newApproval: Approval = {
            id: `approval-${Date.now()}`,
            stage: currentUser.role === 'DIRECT_MANAGER' ? 'DM' : 
                   currentUser.role === 'ACCOUNTANT' ? 'ACCT' : 'FINAL',
            approverId: currentUser.id,
            approver: currentUser,
            decision: 'REJECTED',
            comment: comments,
            decidedAt: new Date(),
            createdAt: new Date(),
          };
          
          set((state) => ({
            prs: state.prs.map(pr => 
              pr.id === id 
                ? { 
                    ...pr, 
                    state: rejectedState,
                    approvals: [...pr.approvals, newApproval],
                    updatedAt: new Date(),
                  }
                : pr
            ),
            isLoading: false,
            error: null,
          }));
          
          {
            const lang = useLanguageStore.getState().language;
            toast.success(translations[lang]['pr.toast.rejectSuccess']);
          }
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to reject request';
          set({ isLoading: false, error: errorMessage });
          {
            const lang = useLanguageStore.getState().language;
            toast.error(translations[lang]['pr.toast.rejectError']);
          }
          throw error;
        }
      },
    }),
    {
      name: 'pr-storage',
      partialize: (state) => ({
        prs: state.prs,
      }),
    }
  )
);
