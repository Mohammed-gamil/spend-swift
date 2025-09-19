import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/stores/authStore';
import { useDepartmentStore } from '@/stores/departmentStore';
import { UserRole } from '@/types';
import { Eye, EyeOff, Loader2, UserCheck, Users, Building2, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { testAPIConnection } from '@/lib/api-test';

interface TestCredentials {
  email: string;
  password: string;
  role: UserRole;
  description: string;
}

const testAccounts: TestCredentials[] = [
  {
    email: 'admin@demo.com',
    password: 'password',
    role: 'ADMIN',
    description: 'Full system access'
  },
  {
    email: 'manager@demo.com',
    password: 'password',
    role: 'DIRECT_MANAGER',
    description: 'Approve team requests'
  },
  {
    email: 'accountant@demo.com',
    password: 'password',
    role: 'ACCOUNTANT',
    description: 'Financial approval'
  },
  {
    email: 'user@demo.com',
    password: 'password',
    role: 'USER',
    description: 'Create requests'
  }
];

export function AuthTestComponent() {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    department_id: 1
  });
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, register, logout, user, isAuthenticated, isLoading, error } = useAuthStore();
  const { fetchDepartments, departments } = useDepartmentStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Attempting login with:', { email: loginData.email, password: '***' });
      await login(loginData.email, loginData.password);
      toast.success('Login successful!');
    } catch (error) {
      console.error('Login failed:', error);
      toast.error(`Login failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(registerData);
      toast.success('Registration successful!');
      // Reset form
      setRegisterData({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        department_id: 1
      });
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const handleQuickLogin = async (credentials: TestCredentials) => {
    try {
      console.log('Quick login attempt with:', { email: credentials.email, role: credentials.role });
      await login(credentials.email, credentials.password);
      toast.success(`Logged in as ${credentials.role}`);
    } catch (error) {
      console.error('Quick login failed:', error);
      toast.error(`Quick login failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleFetchDepartments = async () => {
    try {
      await fetchDepartments();
      toast.success('Departments fetched successfully');
    } catch (error) {
      console.error('Failed to fetch departments:', error);
    }
  };

  const handleTestAPI = async () => {
    try {
      console.log('Testing direct API connection...');
      const response = await testAPIConnection();
      toast.success('Direct API test successful!');
      console.log('Direct API response:', response);
    } catch (error) {
      console.error('Direct API test failed:', error);
      toast.error('Direct API test failed - check console for details');
    }
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'DIRECT_MANAGER':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ACCOUNTANT':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'USER':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  React.useEffect(() => {
    // Load departments on component mount
    fetchDepartments();
  }, []);

  if (isAuthenticated && user) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Authenticated User
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Name</Label>
                <p className="text-lg">{user.name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Email</Label>
                <p className="text-lg">{user.email}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Role</Label>
                <Badge className={getRoleBadgeColor(user.role || 'USER')}>
                  {user.role || 'USER'}
                </Badge>
              </div>
              <div>
                <Label className="text-sm font-medium">Department ID</Label>
                <p className="text-lg">{user.department_id || 'None'}</p>
              </div>
            </div>

            {user.roles && user.roles.length > 0 && (
              <div>
                <Label className="text-sm font-medium">All Roles</Label>
                <div className="flex gap-2 mt-1">
                  {user.roles.map((role) => (
                    <Badge key={role} variant="outline">{role}</Badge>
                  ))}
                </div>
              </div>
            )}

            {user.permissions && user.permissions.length > 0 && (
              <div>
                <Label className="text-sm font-medium">Permissions</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {user.permissions.map((permission) => (
                    <Badge key={permission} variant="secondary" className="text-xs">
                      {permission}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button onClick={handleLogout} variant="outline">
                Logout
              </Button>
              <Button onClick={handleFetchDepartments} variant="outline">
                <Building2 className="h-4 w-4 mr-2" />
                Fetch Departments
              </Button>
              <Button onClick={handleTestAPI} variant="outline">
                <AlertCircle className="h-4 w-4 mr-2" />
                Test API
              </Button>
            </div>
          </CardContent>
        </Card>

        {departments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Departments ({departments.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {departments.map((dept) => (
                  <div key={dept.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{dept.name}</p>
                      <p className="text-sm text-muted-foreground">{dept.description}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">{dept.code}</Badge>
                      <p className="text-xs text-muted-foreground mt-1">ID: {dept.id}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Authentication Test</CardTitle>
          <CardDescription>
            Test the authentication integration with the Laravel backend
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Environment Info */}
          <div className="mb-6 p-4 bg-muted rounded-lg">
            <h3 className="font-medium mb-2">Environment Configuration</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>API URL: {import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}</div>
              <div>Demo Mode: {import.meta.env.VITE_DEMO_MODE || 'false'}</div>
              <div>Environment: {import.meta.env.VITE_APP_ENV || 'development'}</div>
              <div>Mode: {import.meta.env.MODE}</div>
            </div>
            <Button onClick={handleTestAPI} variant="outline" size="sm" className="mt-2">
              <AlertCircle className="h-4 w-4 mr-2" />
              Test Direct API Connection
            </Button>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
              <TabsTrigger value="quick">Quick Test</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      placeholder="Enter your password"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                {error && (
                  <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                    {error}
                  </div>
                )}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Login
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register" className="space-y-4">
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <Label htmlFor="reg-name">Name</Label>
                  <Input
                    id="reg-name"
                    type="text"
                    value={registerData.name}
                    onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="reg-email">Email</Label>
                  <Input
                    id="reg-email"
                    type="email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="reg-password">Password</Label>
                  <Input
                    id="reg-password"
                    type="password"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    placeholder="Enter your password"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="reg-password-confirm">Confirm Password</Label>
                  <Input
                    id="reg-password-confirm"
                    type="password"
                    value={registerData.password_confirmation}
                    onChange={(e) => setRegisterData({ ...registerData, password_confirmation: e.target.value })}
                    placeholder="Confirm your password"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="reg-department">Department ID</Label>
                  <Input
                    id="reg-department"
                    type="number"
                    value={registerData.department_id}
                    onChange={(e) => setRegisterData({ ...registerData, department_id: parseInt(e.target.value) || 1 })}
                    placeholder="Enter department ID"
                  />
                </div>
                {error && (
                  <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                    {error}
                  </div>
                )}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Register
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="quick" className="space-y-4">
              <div>
                <Label className="text-base font-medium">Quick Login Test Accounts</Label>
                <p className="text-sm text-muted-foreground mb-4">
                  Click any account below to login instantly for testing
                </p>
              </div>
              
              <div className="grid gap-3">
                {testAccounts.map((account) => (
                  <div
                    key={account.email}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge className={getRoleBadgeColor(account.role)}>
                          {account.role}
                        </Badge>
                        <span className="font-medium">{account.email}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{account.description}</p>
                    </div>
                    <Button
                      onClick={() => handleQuickLogin(account)}
                      disabled={isLoading}
                      size="sm"
                    >
                      {isLoading && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                      Login
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}