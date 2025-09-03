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
  Plus
} from "lucide-react";
import { UserRole } from "@/types";

interface SidebarProps {
  currentUser: {
    role: UserRole;
  };
  activeRoute: string;
  onNavigate: (route: string) => void;
  pendingApprovals?: number;
}

const navigationItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    route: "dashboard",
    roles: ["USER", "DIRECT_MANAGER", "ACCOUNTANT", "FINAL_MANAGER", "ADMIN"] as UserRole[]
  },
  {
    title: "My Requests",
    icon: FileText,
    route: "my-requests",
    roles: ["USER", "DIRECT_MANAGER", "ACCOUNTANT", "FINAL_MANAGER", "ADMIN"] as UserRole[]
  },
  {
    title: "Pending Approvals",
    icon: CheckSquare,
    route: "approvals",
    roles: ["DIRECT_MANAGER", "ACCOUNTANT", "FINAL_MANAGER"] as UserRole[],
    showBadge: true
  },
  {
    title: "Accounting Queue",
    icon: Calculator,
    route: "accounting",
    roles: ["ACCOUNTANT"] as UserRole[]
  },
  {
    title: "Team Management",
    icon: Users,
    route: "teams",
    roles: ["ADMIN"] as UserRole[]
  },
  {
    title: "User Management",
    icon: Users,
    route: "users",
    roles: ["ADMIN"] as UserRole[]
  },
  {
    title: "System Settings",
    icon: Settings,
    route: "settings",
    roles: ["ADMIN"] as UserRole[]
  }
];

export function Sidebar({ currentUser, activeRoute, onNavigate, pendingApprovals = 0 }: SidebarProps) {
  const filteredItems = navigationItems.filter(item => 
    item.roles.includes(currentUser.role)
  );

  return (
    <div className="flex h-full w-64 flex-col bg-card border-r">
      {/* Create New PR Button */}
      <div className="p-6 border-b">
        <Button 
          className="w-full bg-gradient-primary hover:bg-gradient-primary/90 text-white shadow-primary"
          onClick={() => onNavigate('create-pr')}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Request
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {filteredItems.map((item) => {
          const isActive = activeRoute === item.route;
          const Icon = item.icon;
          
          return (
            <Button
              key={item.route}
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start h-11 px-3",
                isActive && "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
              onClick={() => onNavigate(item.route)}
            >
              <Icon className="mr-3 h-4 w-4" />
              <span className="flex-1 text-left">{item.title}</span>
              
              {/* Show pending count badge */}
              {item.showBadge && pendingApprovals > 0 && (
                <Badge variant="destructive" className="ml-auto h-5 px-1.5 text-xs">
                  {pendingApprovals > 99 ? '99+' : pendingApprovals}
                </Badge>
              )}
              
              {isActive && (
                <ChevronRight className="ml-auto h-4 w-4" />
              )}
            </Button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t">
        <div className="text-xs text-muted-foreground text-center">
          PR Management System v1.0
        </div>
      </div>
    </div>
  );
}