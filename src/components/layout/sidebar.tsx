import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  FileText,
  CheckSquare,
  Calculator,
  Users,
  Settings,
  ChevronRight,
  ChevronLeft,
  Plus
} from "lucide-react";
import { UserRole } from "@/types";
import { useLanguageStore } from "@/hooks/use-language";
import { useTranslation } from "@/hooks/use-translation";
import { TranslationKey } from "@/lib/translations";

interface SidebarProps {
  currentUser: {
    role: UserRole;
  };
  activeRoute: string;
  onNavigate: (route: string) => void;
  pendingApprovals?: number;
}

interface NavigationItem {
  title: string;
  translationKey: TranslationKey;
  icon: React.ElementType;
  route: string;
  roles: UserRole[];
  showBadge?: boolean;
}

const navigationItems: NavigationItem[] = [
  {
    title: "Dashboard",
    translationKey: "nav.dashboard",
    icon: LayoutDashboard,
    route: "dashboard",
    roles: ["USER", "DIRECT_MANAGER", "ACCOUNTANT", "FINAL_MANAGER", "ADMIN"]
  },
  {
    title: "My Requests",
    translationKey: "nav.myPRs",
    icon: FileText,
    route: "my-requests",
    roles: ["USER", "DIRECT_MANAGER", "ACCOUNTANT", "FINAL_MANAGER", "ADMIN"]
  },
  {
    title: "Pending Approvals",
    translationKey: "nav.approvals",
    icon: CheckSquare,
    route: "approvals",
    roles: ["DIRECT_MANAGER", "ACCOUNTANT", "FINAL_MANAGER"],
    showBadge: true
  },
  {
    title: "Accounting Queue",
    translationKey: "nav.accounting",
    icon: Calculator,
    route: "accounting",
    roles: ["ACCOUNTANT"]
  },
  {
    title: "Team Management",
    translationKey: "nav.users",
    icon: Users,
    route: "teams",
    roles: ["ADMIN"]
  },
  {
    title: "User Management",
    translationKey: "nav.users",
    icon: Users,
    route: "users",
    roles: ["ADMIN"]
  },
  {
    title: "System Settings",
    translationKey: "nav.settings",
    icon: Settings,
    route: "settings",
    roles: ["ADMIN"]
  }
];

export function Sidebar({ currentUser, activeRoute, onNavigate, pendingApprovals = 0 }: SidebarProps) {
  const { isRTL } = useLanguageStore();
  const { t } = useTranslation();
  
  const filteredItems = navigationItems.filter(item => 
    item.roles.includes(currentUser.role)
  );

  // Choose appropriate chevron based on direction
  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight;

  return (
    <div className="flex h-full w-64 flex-col bg-background text-foreground border-r border-primary rtl:border-r-0 rtl:border-l">
      {/* Create New PR Button */}
      <div className="p-6 border-b border-primary/40">
        <Button 
          variant="ghost"
          className="w-full border border-primary text-primary hover:bg-primary hover:text-primary-foreground shadow-sm rounded-xl rtl:flex-row-reverse"
          onClick={() => onNavigate('create-pr')}
        >
          <Plus className="mr-2 h-4 w-4 rtl:mr-0 rtl:ml-2" />
          {isRTL ? t("nav.newRequest") : "New Request"}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {filteredItems.map((item) => {
          const isActive = activeRoute === item.route;
          const Icon = item.icon;
          const title = isRTL ? t(item.translationKey) : item.title;
          
          return (
            <Button
              key={item.route}
              variant="ghost"
              className={cn(
                "w-full justify-start h-11 px-3 rounded-lg border border-transparent text-foreground hover:border-primary hover:bg-primary/10 rtl:flex-row-reverse",
                isActive && "border-primary bg-primary text-primary-foreground hover:bg-primary"
              )}
              onClick={() => onNavigate(item.route)}
            >
              <Icon className="mr-3 h-4 w-4 rtl:mr-0 rtl:ml-3" />
              <span className="flex-1 text-left rtl:text-right">{title}</span>
              
              {/* Show pending count badge - positioned like الموافقات element in RTL */}
              {item.showBadge && pendingApprovals > 0 && (
                <Badge className="ml-auto h-5 px-1.5 text-xs border border-primary text-primary bg-transparent rtl:ml-0 rtl:mr-auto">
                  {pendingApprovals > 99 ? '99+' : pendingApprovals}
                </Badge>
              )}
              
              {isActive && (
                <ChevronIcon className="ml-auto h-4 w-4 rtl:ml-0 rtl:mr-auto" />
              )}
            </Button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-primary/40">
        <div className="text-xs text-muted-foreground text-center">
          PR Management System v1.0
        </div>
      </div>
    </div>
  );
}