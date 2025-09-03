import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PurchaseRequest, PRState, UserRole, Approval } from '@/types';
import toast from 'react-hot-toast';

interface PRStoreState {
  prs: PurchaseRequest[];
  isLoading: boolean;
  error: string | null;
}

interface PRActions {
  createPR: (prData: Omit<PurchaseRequest, 'id' | 'createdAt' | 'updatedAt' | 'state' | 'requesterId'>) => Promise<void>;
  updatePR: (id: string, updates: Partial<PurchaseRequest>) => Promise<void>;
  deletePR: (id: string) => Promise<void>;
  getPRs: () => Promise<void>;
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

      createPR: async (prData) => {
        try {
          set({ isLoading: true, error: null });
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const currentUser = getCurrentUser();
          const newPR: PurchaseRequest = {
            ...prData,
            id: `pr-${Date.now()}`,
            requesterId: currentUser.id,
            requester: currentUser,
            state: 'DRAFT',
            approvals: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          
          set((state) => ({
            prs: [...state.prs, newPR],
            isLoading: false,
            error: null,
          }));
          
          toast.success('Purchase request created successfully!');
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to create purchase request';
          set({ isLoading: false, error: errorMessage });
          toast.error('Failed to create purchase request');
          throw error;
        }
      },

      updatePR: async (id, updates) => {
        try {
          set({ isLoading: true, error: null });
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set((state) => ({
            prs: state.prs.map(pr => 
              pr.id === id 
                ? { ...pr, ...updates, updatedAt: new Date() }
                : pr
            ),
            isLoading: false,
            error: null,
          }));
          
          toast.success('Purchase request updated successfully!');
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to update purchase request';
          set({ isLoading: false, error: errorMessage });
          toast.error('Failed to update purchase request');
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
          
          toast.success('Purchase request deleted successfully!');
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to delete purchase request';
          set({ isLoading: false, error: errorMessage });
          toast.error('Failed to delete purchase request');
          throw error;
        }
      },

      getPRs: async () => {
        try {
          set({ isLoading: true, error: null });
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 800));
          
          // In a real app, this would fetch from API
          // For now, we'll just use the existing state
          const currentPRs = get().prs;
          
          set({
            prs: currentPRs,
            isLoading: false,
            error: null,
          });
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch purchase requests';
          set({ isLoading: false, error: errorMessage });
          toast.error('Failed to fetch purchase requests');
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
            throw new Error('Purchase request not found');
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
          
          toast.success('Purchase request approved successfully!');
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to approve purchase request';
          set({ isLoading: false, error: errorMessage });
          toast.error('Failed to approve purchase request');
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
            throw new Error('Purchase request not found');
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
          
          toast.success('Purchase request rejected');
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to reject purchase request';
          set({ isLoading: false, error: errorMessage });
          toast.error('Failed to reject purchase request');
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
