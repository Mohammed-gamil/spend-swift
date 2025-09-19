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
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import toast from 'react-hot-toast';

const loginSchema = z.object({
  email: z.string().email('login.errors.invalidEmail'),
  password: z.string().min(1, 'login.errors.passwordRequired'),
  remember: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const { t } = useTranslation();
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-luxury-bg"></div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center">
          <div className="mb-8">
            <div className="h-16 w-16 rounded-full bg-gradient-primary flex items-center justify-center shadow-primary mx-auto mb-4">
              <span className="text-2xl font-bold text-primary-foreground">PR</span>
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-foreground gradient-text">
            {t('login.title')}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {t('login.subtitle')}
          </p>
        </div>

        <Card className="border-primary/20 shadow-lg backdrop-blur-sm bg-card/95">
          <CardHeader className="text-center">
            <CardTitle className="text-foreground">{t('login.welcome')}</CardTitle>
            <CardDescription className="text-muted-foreground">
              {t('login.welcomeSubtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">{t('login.emailLabel')}</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder={t('login.emailPlaceholder')}
                  {...register('email')}
                  className={errors.email ? 'border-destructive' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{t(errors.email.message as any)}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t('login.passwordLabel')}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder={t('login.passwordPlaceholder')}
                    {...register('password')}
                    className={errors.password ? 'border-destructive pr-10' : 'pr-10'}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{t(errors.password.message as any)}</p>
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
                    {t('login.rememberMe')}
                  </Label>
                </div>

                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:text-primary/80"
                >
                  {t('login.forgotPassword')}
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('login.signingInButton')}
                  </>
                ) : (
                  t('login.signInButton')
                )}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-background text-muted-foreground">{t('login.demoCredentials')}</span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div className="bg-muted p-2 rounded border border-border">
                  <strong className="text-foreground">{t('login.demo.admin')}</strong><br />
                  <span className="text-muted-foreground">admin@demo.com<br />
                  {t('login.demo.password')}</span>
                </div>
                <div className="bg-muted p-2 rounded border border-border">
                  <strong className="text-foreground">{t('login.demo.manager')}</strong><br />
                  <span className="text-muted-foreground">manager@demo.com<br />
                  {t('login.demo.password')}</span>
                </div>
                <div className="bg-muted p-2 rounded border border-border">
                  <strong className="text-foreground">{t('login.demo.accountant')}</strong><br />
                  <span className="text-muted-foreground">accountant@demo.com<br />
                  {t('login.demo.password')}</span>
                </div>
                <div className="bg-muted p-2 rounded border border-border">
                  <strong className="text-foreground">{t('login.demo.user')}</strong><br />
                  <span className="text-muted-foreground">user@demo.com<br />
                  {t('login.demo.password')}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
