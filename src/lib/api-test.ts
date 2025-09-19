// Test file to debug frontend-backend connection
import { authApi } from '@/lib/api';

// Test function to check API connectivity
export const testAPIConnection = async () => {
  console.log('Testing API connection...');
  console.log('API URL:', import.meta.env.VITE_API_URL);
  console.log('Demo Mode:', import.meta.env.VITE_DEMO_MODE);
  
  try {
    // Test login
    const response = await authApi.login({
      email: 'test@example.com',
      password: 'password123'
    });
    console.log('Login response:', response);
    return response;
  } catch (error) {
    console.error('API connection error:', error);
    throw error;
  }
};