# Action-g Authentication Integration

This document demonstrates the authentication integration between the React frontend and the Laravel backend API.

## Overview

The authentication system has been successfully integrated to work with the Laravel backend responses as specified in your Postman collection.

## Key Features Implemented

### 1. Updated Type Definitions
- **User interface** now matches Laravel response structure
- **AuthResponse** updated for JWT token format
- **Department interface** added for backend compatibility
- **Register/Login** response types match Postman examples

### 2. Enhanced API Client
- Proper JWT token handling with Bearer authentication
- Department management API integration
- Support for both demo mode and production backend
- Error handling for various HTTP status codes

### 3. Role-Based Authentication
- Automatic role detection and assignment
- Permission-based access control
- Support for multiple user roles (ADMIN, DIRECT_MANAGER, ACCOUNTANT, USER)
- Role caching for performance

### 4. Authentication Store
- Zustand-based state management
- Persistent authentication state
- Login, register, and logout functionality
- User profile management

## Testing the Integration

### Access the Test Component
Navigate to `/auth-test` in your application to access the authentication testing interface.

### Test Accounts (Demo Mode)
When `VITE_DEMO_MODE=true` in your `.env` file:

1. **Admin User**
   - Email: `admin@demo.com`
   - Password: `password`
   - Role: ADMIN

2. **Manager User**
   - Email: `manager@demo.com`
   - Password: `password`
   - Role: DIRECT_MANAGER

3. **Accountant User**
   - Email: `accountant@demo.com`
   - Password: `password`
   - Role: ACCOUNTANT

4. **Regular User**
   - Email: `user@demo.com`
   - Password: `password`
   - Role: USER

### Backend Integration
When `VITE_DEMO_MODE=false`, the system will connect to your Laravel backend at `http://localhost:8000/api`.

## API Endpoints Integrated

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration  
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/refresh` - Refresh JWT token

### Departments
- `GET /api/admin/departments` - List all departments
- `GET /api/admin/departments/{id}` - Get specific department

## Response Format Examples

### Login Response
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer",
  "expires_in": 2592000,
  "user": {
    "id": 2,
    "name": "Admin User",
    "email": "admin@example.com",
    "email_verified_at": "2025-09-18T03:21:09.000000Z",
    "department_id": null,
    "direct_manager_id": null,
    "language_preference": "en",
    "created_at": "2025-09-18T03:21:09.000000Z",
    "updated_at": "2025-09-18T03:21:09.000000Z"
  }
}
```

### Profile Response
```json
{
  "id": 2,
  "name": "Admin User",
  "email": "admin@example.com",
  "email_verified_at": "2025-09-18T03:21:09.000000Z",
  "department_id": null,
  "direct_manager_id": null,
  "language_preference": "en",
  "created_at": "2025-09-18T03:21:09.000000Z",
  "updated_at": "2025-09-18T03:21:09.000000Z"
}
```

### Register Response
```json
{
  "message": "User successfully registered",
  "user": {
    "name": "Test User",
    "email": "test2@example.com",
    "updated_at": "2025-09-18T16:24:21.000000Z",
    "created_at": "2025-09-18T16:24:21.000000Z",
    "id": 3
  }
}
```

### Department List Response
```json
{
  "data": [
    {
      "id": 1,
      "name": "IT Department",
      "description": "Information Technology",
      "code": "IT",
      "manager_id": 2,
      "created_at": "2025-09-18T03:21:09.000000Z",
      "updated_at": "2025-09-18T03:21:09.000000Z"
    }
  ]
}
```

## File Structure

### Core Files Updated/Created
- `src/types/index.ts` - Updated type definitions
- `src/lib/auth.ts` - Authentication service
- `src/lib/api.ts` - API client with JWT handling
- `src/lib/role-utils.ts` - Role and permission utilities
- `src/stores/authStore.ts` - Authentication state management
- `src/stores/departmentStore.ts` - Department management
- `src/components/auth/AuthTestComponent.tsx` - Testing interface

### Configuration
- `.env` - Environment variables (demo mode enabled)
- `src/App.tsx` - Updated with auth test route

## Usage Examples

### Login a User
```typescript
import { useAuthStore } from '@/stores/authStore';

const { login } = useAuthStore();

try {
  await login('admin@example.com', 'password');
  // User is now authenticated
} catch (error) {
  console.error('Login failed:', error);
}
```

### Check User Permissions
```typescript
import { hasPermission } from '@/lib/role-utils';

const user = useAuthStore(state => state.user);
if (hasPermission(user, 'requests.create')) {
  // User can create requests
}
```

### Fetch Departments
```typescript
import { useDepartmentStore } from '@/stores/departmentStore';

const { fetchDepartments, departments } = useDepartmentStore();

await fetchDepartments();
console.log(departments); // Array of departments
```

## Next Steps

1. **Switch to Production Mode**: Set `VITE_DEMO_MODE=false` in `.env` to connect to your Laravel backend
2. **Test with Real Data**: Use the authentication test component with your actual backend
3. **Role Integration**: The role detection system is ready to integrate with your Laravel role/permission system
4. **Error Handling**: All API errors are properly handled and displayed to users

The authentication system is now fully integrated and ready to work with your Laravel backend!