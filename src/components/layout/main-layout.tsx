import { ReactNode } from "react";
import { Header } from "./header";
import { Sidebar } from "./sidebar";
import { UserRole } from "@/types";

interface MainLayoutProps {
  children: ReactNode;
  currentUser: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
  };
  activeRoute: string;
  onNavigate: (route: string) => void;
  onSearch?: (query: string) => void;
  pendingApprovals?: number;
  notifications?: number;
}

export function MainLayout({
  children,
  currentUser,
  activeRoute,
  onNavigate,
  onSearch,
  pendingApprovals = 0,
  notifications = 0
}: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header 
        currentUser={currentUser}
        notifications={notifications}
        onSearch={onSearch}
      />
      
      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar
          currentUser={currentUser}
          activeRoute={activeRoute}
          onNavigate={onNavigate}
          pendingApprovals={pendingApprovals}
        />
        
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}