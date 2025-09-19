import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
  remember: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginSimple() {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error, clearError, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
  });

  const rememberValue = watch('remember');

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  useEffect(() => {
    clearError();
  }, [clearError]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password, data.remember);
      navigate(from, { replace: true });
    } catch (error) {
      // Error is handled by the store and displayed via toast
    }
  };

  const handleDemoLogin = async (email: string, password: string) => {
    try {
      await login(email, password, false);
      navigate(from, { replace: true });
    } catch (error) {
      // Error is handled by the store and displayed via toast
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Theme Toggle Button */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      
      <div className="relative max-w-md w-full space-y-8">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2 mb-4 group">
            <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-glow">
              <span className="text-white font-bold text-xl">AG</span>
            </div>
            <div className="transition-all duration-300 group-hover:translate-x-1">
              <h1 className="text-2xl font-bold gradient-text">Action-g</h1>
              <p className="text-xs text-muted-foreground">Purchase Request System</p>
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-foreground">
            Sign in to your account
          </h2>
          <p className="text-sm text-muted-foreground">
            Welcome back! Please enter your details.
          </p>
        </div>

        <Card className="shadow-xl border-primary/20 bg-card/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl text-center">Login</CardTitle>
            <CardDescription className="text-center">
              Enter your email and password to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive" className="animate-in slide-in-from-top-2 duration-300">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-sm text-destructive animate-in slide-in-from-left-2 duration-300">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 pr-10"
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive animate-in slide-in-from-left-2 duration-300">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberValue}
                    onCheckedChange={(checked) => setValue('remember', !!checked)}
                  />
                  <Label
                    htmlFor="remember"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Remember me
                  </Label>
                </div>
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-primary hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </Button>
            </form>

            {/* Demo Login Section */}
            <div className="mt-6 pt-4 border-t border-border/50">
              <p className="text-sm text-center text-muted-foreground mb-3">
                Quick demo login:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDemoLogin('admin@example.com', 'password')}
                  disabled={isLoading}
                  className="text-xs transition-all duration-200 hover:bg-primary/10"
                >
                  Admin Demo
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDemoLogin('user@spendswift.com', 'password')}
                  disabled={isLoading}
                  className="text-xs transition-all duration-200 hover:bg-primary/10"
                >
                  User Demo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          Need an account?{' '}
          <Link
            to="/register"
            className="font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Contact your administrator
          </Link>
        </p>
      </div>
    </div>
  );
}