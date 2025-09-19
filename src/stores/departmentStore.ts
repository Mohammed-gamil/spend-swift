import { create } from 'zustand';
import { Department, DepartmentListResponse } from '@/types';
import { departmentApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface DepartmentState {
  departments: Department[];
  isLoading: boolean;
  error: string | null;
}

interface DepartmentActions {
  fetchDepartments: () => Promise<void>;
  getDepartmentById: (id: number) => Promise<Department | null>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useDepartmentStore = create<DepartmentState & DepartmentActions>((set, get) => ({
  // State
  departments: [],
  isLoading: false,
  error: null,

  // Actions
  fetchDepartments: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const response: DepartmentListResponse = await departmentApi.getAll();
      
      set({
        departments: response.data,
        isLoading: false,
        error: null,
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch departments';
      set({
        departments: [],
        isLoading: false,
        error: errorMessage,
      });
      
      toast.error(errorMessage);
    }
  },

  getDepartmentById: async (id: number): Promise<Department | null> => {
    try {
      // First check if department is already in state
      const existingDepartment = get().departments.find(dept => dept.id === id);
      if (existingDepartment) {
        return existingDepartment;
      }

      set({ isLoading: true, error: null });
      
      const department = await departmentApi.getById(id);
      
      // Add to departments list if not already there
      const currentDepartments = get().departments;
      if (!currentDepartments.find(dept => dept.id === id)) {
        set({
          departments: [...currentDepartments, department],
          isLoading: false,
          error: null,
        });
      } else {
        set({ isLoading: false, error: null });
      }
      
      return department;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch department';
      set({
        isLoading: false,
        error: errorMessage,
      });
      
      toast.error(errorMessage);
      return null;
    }
  },

  clearError: () => {
    set({ error: null });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
}));

// Selector hooks for convenience
export const useDepartments = () => useDepartmentStore(state => state.departments);
export const useDepartmentLoading = () => useDepartmentStore(state => state.isLoading);
export const useDepartmentError = () => useDepartmentStore(state => state.error);