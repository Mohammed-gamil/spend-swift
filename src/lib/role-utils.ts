import { User, UserRole } from '@/types';

/**
 * Utility functions for handling user roles and permissions
 * Since the backend may not directly include roles in user response,
 * we need to fetch and determine roles based on backend data
 */

// Cache for user roles and permissions
const roleCache = new Map<number, { roles: string[], permissions: string[] }>();

/**
 * Fetch user roles and permissions from backend
 */
export const fetchUserRoles = async (userId: number): Promise<{ roles: string[], permissions: string[] }> => {
  // Check cache first
  if (roleCache.has(userId)) {
    return roleCache.get(userId)!;
  }

  try {
    // Check if we're in demo mode
    const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';
    
    if (DEMO_MODE) {
      // In demo mode, determine roles based on cached user data
      const mockRoleData = {
        roles: ['USER'], // Default role
        permissions: ['requests.create', 'requests.view']
      };
      roleCache.set(userId, mockRoleData);
      return mockRoleData;
    }

    // In production, we would make an API call to get user roles
    // For now, we'll use a placeholder that should be replaced with actual API call
    // const response = await api.get(`/users/${userId}/roles`);
    // return response.data;
    
    // Temporary fallback - in production this should be removed
    const fallbackRoleData = {
      roles: ['USER'],
      permissions: ['requests.create', 'requests.view']
    };
    
    roleCache.set(userId, fallbackRoleData);
    return fallbackRoleData;
  } catch (error) {
    console.error('Failed to fetch user roles:', error);
    return { roles: ['USER'], permissions: [] };
  }
};

/**
 * Determine primary user role based on role hierarchy
 */
export const determinePrimaryRole = (roles: string[]): UserRole => {
  // Role hierarchy (highest to lowest)
  const roleHierarchy: UserRole[] = ['ADMIN', 'FINAL_MANAGER', 'ACCOUNTANT', 'DIRECT_MANAGER', 'USER'];
  
  for (const role of roleHierarchy) {
    if (roles.includes(role)) {
      return role;
    }
  }
  
  return 'USER'; // Default fallback
};

/**
 * Check if user has specific permission
 */
export const hasPermission = (user: User, permission: string): boolean => {
  return user.permissions?.includes(permission) || false;
};

/**
 * Check if user has any of the specified roles
 */
export const hasAnyRole = (user: User, roles: UserRole[]): boolean => {
  if (!user.roles) return false;
  return roles.some(role => user.roles!.includes(role));
};

/**
 * Enhanced user object with role information
 */
export const enhanceUserWithRoles = async (user: User): Promise<User> => {
  try {
    // For demo mode or testing, use email-based role assignment
    const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';
    
    if (DEMO_MODE || user.email.includes('demo.com')) {
      const roleData = mockRoleAssignment(user.email);
      const primaryRole = determinePrimaryRole(roleData.roles);
      
      return {
        ...user,
        role: primaryRole,
        roles: roleData.roles,
        permissions: roleData.permissions
      };
    }

    // For production, fetch from backend
    const roleData = await fetchUserRoles(user.id);
    const primaryRole = determinePrimaryRole(roleData.roles);
    
    return {
      ...user,
      role: primaryRole,
      roles: roleData.roles,
      permissions: roleData.permissions
    };
  } catch (error) {
    console.error('Failed to enhance user with roles:', error);
    return {
      ...user,
      role: 'USER',
      roles: ['USER'],
      permissions: []
    };
  }
};

/**
 * Clear role cache (useful when user data changes)
 */
export const clearRoleCache = (userId?: number): void => {
  if (userId) {
    roleCache.delete(userId);
  } else {
    roleCache.clear();
  }
};

/**
 * Mock role assignment based on email patterns (for demo/testing)
 */
export const mockRoleAssignment = (email: string): { roles: string[], permissions: string[] } => {
  if (email.includes('admin')) {
    return {
      roles: ['ADMIN'],
      permissions: [
        'requests.create', 'requests.view', 'requests.update', 'requests.delete',
        'requests.approve', 'requests.reject', 'users.manage', 'departments.manage',
        'budgets.manage', 'audit.view'
      ]
    };
  }
  
  if (email.includes('manager')) {
    return {
      roles: ['DIRECT_MANAGER'],
      permissions: [
        'requests.create', 'requests.view', 'requests.update',
        'requests.approve', 'requests.reject', 'team.manage'
      ]
    };
  }
  
  if (email.includes('accountant')) {
    return {
      roles: ['ACCOUNTANT'],
      permissions: [
        'requests.view', 'requests.approve', 'requests.reject',
        'budgets.view', 'financial.manage'
      ]
    };
  }
  
  // Default user role
  return {
    roles: ['USER'],
    permissions: ['requests.create', 'requests.view']
  };
};