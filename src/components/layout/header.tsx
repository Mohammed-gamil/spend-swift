import { Bell, Search, User, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLanguageStore } from "@/hooks/use-language";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  currentUser: {
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
  notifications: number;
  onSearch?: (query: string) => void;
}

export function Header({ currentUser, notifications, onSearch }: HeaderProps) {
  const { isRTL } = useLanguageStore();
  const navigate = useNavigate();
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-16 items-center px-6 animate-fade-in rtl:flex-row-reverse rtl:space-x-reverse">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <div className="flex items-center space-x-2 rtl:space-x-reverse group">
            <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-primary transition-all duration-300 group-hover:scale-110 group-hover:shadow-glow">
              <span className="text-white font-bold text-sm">PR</span>
            </div>
            <div className="transition-all duration-300 rtl:group-hover:translate-x-0 rtl:group-hover:-translate-x-1 ltr:group-hover:translate-x-1">
              <h1 className="text-lg font-bold text-foreground gradient-text">
                {isRTL ? "طلبات الشراء" : "Purchase Requests"}
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                {isRTL ? "نظام الإدارة" : "Management System"}
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-6 hidden md:block">
          <div className="relative group">
            <Search 
              className={`absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary
                ${isRTL ? "right-3" : "left-3"}`}
            />
            <Input
              type="search"
              placeholder={isRTL ? "البحث عن طلبات الشراء..." : "Search purchase requests..."}
              className={`bg-muted/50 border-0 focus:bg-background transition-all duration-300 focus:shadow-md focus:ring-2 focus:ring-primary/20
                ${isRTL ? "pr-10" : "pl-10"}`}
              onChange={(e) => onSearch?.(e.target.value)}
            />
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          {/* Test Button - Simple Debug */}
          <Button variant="outline" size="sm" className="bg-red-500 text-white">
            {isRTL ? "اختبار" : "TEST"}
          </Button>
          
          {/* Theme Toggle */}
          <ThemeToggle />
          
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative group hover:bg-gradient-primary-soft transition-all duration-300">
            <Bell className="h-5 w-5 transition-transform group-hover:animate-bounce-subtle" />
            {notifications > 0 && (
              <Badge 
                variant="destructive" 
                className={`absolute -top-1 h-5 w-5 flex items-center justify-center p-0 text-xs animate-pulse-soft
                  ${isRTL ? "-left-1" : "-right-1"}`}
              >
                {notifications > 99 ? '99+' : notifications}
              </Badge>
            )}
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:ring-2 hover:ring-primary/20 transition-all duration-300">
                <Avatar className="h-10 w-10 transition-transform hover:scale-105">
                  <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                  <AvatarFallback className="bg-gradient-primary text-white">
                    {currentUser.name
                      .split(' ')
                      .map(n => n[0])
                      .join('')
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align={isRTL ? "start" : "end"} forceMount>
              <div className="flex flex-col space-y-1 p-2">
                <p className="text-sm font-medium leading-none">{currentUser.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {currentUser.email}
                </p>
                <Badge variant="outline" className="text-xs w-fit mt-1">
                  {currentUser.role}
                </Badge>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                <User className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                <span>{isRTL ? "الملف الشخصي" : "Profile"}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/admin/settings')}>
                <Settings className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                <span>{isRTL ? "الإعدادات" : "Settings"}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <LogOut className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                <span>{isRTL ? "تسجيل الخروج" : "Sign out"}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}