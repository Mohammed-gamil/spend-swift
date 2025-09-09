import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useTranslation } from '@/hooks/use-translation';
import { useLanguageStore } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { LanguageToggle } from '@/components/ui/language-toggle';
import { NotificationDropdown } from '@/components/ui/notification-dropdown';
import { 
  Menu, 
  Home, 
  FileText, 
  CheckSquare, 
  Users, 
  Settings, 
  LogOut, 
  Bell,
  Plus,
  DollarSign,
  BarChart3
} from 'lucide-react';
import { UserRole } from '@/types';

const navigation = [
  { name: 'nav.dashboard', href: '/dashboard', icon: Home, roles: ['USER', 'DIRECT_MANAGER', 'ACCOUNTANT', 'FINAL_MANAGER', 'ADMIN'] },
  { name: 'nav.myPRs', href: '/prs', icon: FileText, roles: ['USER', 'DIRECT_MANAGER', 'ACCOUNTANT', 'FINAL_MANAGER', 'ADMIN'] },
  { name: 'nav.createPR', href: '/prs/create', icon: Plus, roles: ['USER'] },
  { name: 'nav.approvals', href: '/approvals', icon: CheckSquare, roles: ['DIRECT_MANAGER', 'ACCOUNTANT', 'FINAL_MANAGER'] },
  { name: 'nav.accounting', href: '/accounting', icon: DollarSign, roles: ['ACCOUNTANT'] },
  { name: 'nav.reports', href: '/reports', icon: BarChart3, roles: ['DIRECT_MANAGER', 'FINAL_MANAGER', 'ADMIN'] },
  { name: 'nav.users', href: '/admin/users', icon: Users, roles: ['ADMIN'] },
  { name: 'nav.settings', href: '/admin/settings', icon: Settings, roles: ['ADMIN'] },
];

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const { t } = useTranslation();
  const { direction } = useLanguageStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const isCurrentPath = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  const filteredNavigation = navigation.filter(item => 
    user && item.roles.includes(user.role as UserRole)
  );

  const dirClass = direction === 'rtl' ? 'rtl' : 'ltr';
  const isRtl = direction === 'rtl';
  
  return (
    <div className={`app-layout ${dirClass} flex ${isRtl ? 'flex-row-reverse' : 'flex-row'} min-h-screen`}>
      {/* Desktop sidebar */}
      <div className="sidebar hidden lg:block w-64 flex-shrink-0">
        <div className={`flex flex-col h-full luxury-card ${isRtl ? 'border-l' : 'border-r'} border-border/50 backdrop-blur-xl`}>
          <div className="flex items-center px-6 py-4 border-b border-border/50 luxury-header">
            <h1 className="text-xl font-bold text-foreground">{t('app.title')}</h1>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-2">
            {filteredNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isCurrentPath(item.href)
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <item.icon className={`${isRtl ? 'ml-3' : 'mr-3'} h-5 w-5 ${isRtl && item.icon.name === 'ArrowRight' ? 'rtl-flip' : ''}`} />
                {t(item.name as any)}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main content area including mobile header */}
      <div className="main-content flex flex-col flex-grow">
        {/* Mobile sidebar */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side={direction === 'rtl' ? 'right' : 'left'} className="w-64 p-0 luxury-card backdrop-blur-xl">
            <div className="flex flex-col h-full">
              <div className="flex items-center px-6 py-4 border-b border-border/50 luxury-header">
                <h1 className="text-xl font-bold text-foreground">{t('app.title')}</h1>
              </div>
              <nav className="flex-1 px-4 py-4 space-y-2">
                {filteredNavigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isCurrentPath(item.href)
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    <item.icon className={`${isRtl ? 'ml-3' : 'mr-3'} h-5 w-5 ${isRtl && item.icon.name === 'ArrowRight' ? 'rtl-flip' : ''}`} />
                    {t(item.name as any)}
                  </Link>
                ))}
              </nav>
            </div>
          </SheetContent>
        
          {/* Top navigation */}
          <div className="top-header sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-border/50 luxury-header backdrop-blur-xl px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <div className="flex flex-1"></div>
              <div className="flex items-center gap-x-4 lg:gap-x-6">
                {/* Language Toggle */}
                <LanguageToggle />
                
                {/* Theme Toggle */}
                <ThemeToggle />
                
                {/* Notifications */}
                <NotificationDropdown />

                {/* Profile dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.avatar} alt={user?.name} />
                        <AvatarFallback>{user ? getInitials(user.name) : 'U'}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email}
                        </p>
                        <Badge variant="secondary" className="w-fit text-xs">
                          {user?.role}
                        </Badge>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile">{t('nav.profile')}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/notifications">{t('nav.notifications')}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className={`${isRtl ? 'ml-2' : 'mr-2'} h-4 w-4 ${isRtl ? 'rtl-flip' : ''}`} />
                      {t('nav.logout')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* Page content */}
          <main className="py-6">
            <div className="px-4 sm:px-6 lg:px-8">
              <Outlet />
            </div>
          </main>
        </Sheet>
      </div>
    </div>
  );
}
