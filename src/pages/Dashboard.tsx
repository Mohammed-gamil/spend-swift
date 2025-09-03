import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { PRCard } from "@/components/pr/pr-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Activity, 
  ArrowRight, 
  FileText, 
  Plus, 
  TrendingUp,
  Users,
  Clock
} from "lucide-react";
import { DashboardStats, PurchaseRequest, AuditLog, UserRole } from "@/types";
import { formatDistanceToNow } from "date-fns";

// Mock data - in real app this would come from API
const mockUser = {
  id: "1",
  name: "Ahmed Hassan",
  email: "ahmed.hassan@company.com",
  role: "DIRECT_MANAGER" as UserRole,
  status: "active" as const,
  avatar: ""
};

const mockStats: DashboardStats = {
  totalPRs: 42,
  pendingApprovals: 7,
  approvedThisMonth: 23,
  averageApprovalTime: 3.2,
  budgetUtilization: 78.5,
  recentActivity: [
    {
      id: "1",
      userId: "2",
      user: { id: "2", name: "Sarah Ahmed", email: "", role: "USER", status: "active" },
      action: "submitted",
      entityType: "PurchaseRequest",
      entityId: "PR-2024-001",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
    {
      id: "2", 
      userId: "3",
      user: { id: "3", name: "Mohamed Ali", email: "", role: "USER", status: "active" },
      action: "approved",
      entityType: "PurchaseRequest", 
      entityId: "PR-2024-002",
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    }
  ]
};

const mockRecentPRs: PurchaseRequest[] = [
  {
    id: "PR-2024-001",
    requesterId: "2",
    requester: { id: "2", name: "Sarah Ahmed", email: "", role: "USER", status: "active" },
    title: "New MacBook Pro for Development Team",
    description: "Urgent requirement for M3 MacBook Pro to replace aging development machine",
    category: "IT Equipment",
    desiredCost: 2499,
    currency: "USD",
    neededByDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    state: "SUBMITTED",
    currentApproverId: "1",
    currentApprover: mockUser,
    items: [{ id: "1", name: "MacBook Pro M3", quantity: 1, unitPrice: 2499, total: 2499 }],
    quotes: [],
    approvals: [],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: "PR-2024-002", 
    requesterId: "3",
    requester: { id: "3", name: "Mohamed Ali", email: "", role: "USER", status: "active" },
    title: "Office Supplies - Q1 2024",
    description: "Quarterly office supplies including stationery, printing materials",
    category: "Office Supplies",
    desiredCost: 750,
    currency: "USD", 
    neededByDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    state: "DM_APPROVED",
    items: [{ id: "2", name: "Office Supplies Bundle", quantity: 1, unitPrice: 750, total: 750 }],
    quotes: [],
    approvals: [],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000)
  }
];

export default function Dashboard() {
  const [activeRoute, setActiveRoute] = useState("dashboard");

  const handleNavigate = (route: string) => {
    setActiveRoute(route);
    // In real app, this would use React Router
    console.log(`Navigate to: ${route}`);
  };

  const handleViewPR = (id: string) => {
    console.log(`View PR: ${id}`);
    // In real app, navigate to PR detail page
  };

  const handleSearch = (query: string) => {
    console.log(`Search: ${query}`);
    // In real app, implement search functionality
  };

  return (
    <MainLayout
      currentUser={mockUser}
      activeRoute={activeRoute}
      onNavigate={handleNavigate}
      onSearch={handleSearch}
      pendingApprovals={mockStats.pendingApprovals}
      notifications={3}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between animate-slide-up">
          <div>
            <h1 className="text-3xl font-bold text-foreground bg-gradient-hero bg-clip-text text-transparent animate-glow">
              Welcome back, {mockUser.name.split(' ')[0]}!
            </h1>
            <p className="text-muted-foreground mt-1 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Here's what's happening with your purchase requests today.
            </p>
          </div>
          
          <Button 
            className="bg-gradient-primary hover:bg-gradient-primary/90 text-white shadow-primary hover:shadow-glow transition-all duration-300 hover:scale-105 animate-scale-in"
            style={{ animationDelay: '0.2s' }}
            onClick={() => handleNavigate('create-pr')}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Request
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="animate-scale-in" style={{ animationDelay: '0.3s' }}>
          <StatsGrid stats={mockStats} userRole={mockUser.role} />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          {/* Recent Activity & PRs */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent PRs */}
            <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.01] bg-gradient-card">
              <CardHeader className="flex flex-row items-center justify-between group">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary transition-transform group-hover:scale-110" />
                  Recent Requests
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => handleNavigate('my-requests')} className="hover:bg-gradient-primary-soft transition-all duration-300">
                  View all
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockRecentPRs.map((pr) => (
                  <PRCard
                    key={pr.id}
                    pr={pr}
                    onView={handleViewPR}
                    compact
                  />
                ))}
              </CardContent>
            </Card>

            {/* Activity Timeline */}
            <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.01] bg-gradient-card">
              <CardHeader className="group">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary transition-transform group-hover:scale-110" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockStats.recentActivity.map((activity, index) => (
                    <div key={activity.id} 
                         className="flex items-start gap-3 pb-3 last:pb-0 border-b last:border-0 animate-slide-up hover:bg-gradient-primary-soft/20 p-2 rounded-lg transition-all duration-300" 
                         style={{ animationDelay: `${0.1 * index}s` }}>
                      <Avatar className="h-8 w-8 transition-transform hover:scale-110">
                        <AvatarImage src={activity.user?.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {activity.user?.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm transition-colors hover:text-primary">{activity.user?.name}</span>
                          <Badge variant="outline" className="text-xs hover:bg-primary/10 transition-colors">
                            {activity.action}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {activity.action} purchase request #{activity.entityId.slice(-3)}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                          <Clock className="h-3 w-3" />
                          {formatDistanceToNow(activity.createdAt, { addSuffix: true })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Insights */}
          <div className="space-y-6 animate-scale-in" style={{ animationDelay: '0.5s' }}>
            {/* Quick Actions */}
            <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.01] bg-gradient-card">
              <CardHeader className="group">
                <CardTitle className="text-lg transition-colors group-hover:text-primary">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start hover:bg-gradient-primary-soft transition-all duration-300 hover:scale-[1.02]"
                  onClick={() => handleNavigate('create-pr')}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Request
                </Button>
                
                {mockUser.role !== 'USER' && (
                  <Button 
                    variant="outline" 
                    className="w-full justify-start hover:bg-gradient-primary-soft transition-all duration-300 hover:scale-[1.02]"
                    onClick={() => handleNavigate('approvals')}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Review Pending ({mockStats.pendingApprovals})
                  </Button>
                )}
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start hover:bg-gradient-primary-soft transition-all duration-300 hover:scale-[1.02]"
                  onClick={() => handleNavigate('my-requests')}
                >
                  <Users className="mr-2 h-4 w-4" />
                  My Requests
                </Button>
              </CardContent>
            </Card>

            {/* Insights */}
            <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.01] bg-gradient-card">
              <CardHeader className="group">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-success transition-transform group-hover:scale-110" />
                  Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-success/10 rounded-lg border border-success/20 hover:bg-success/15 transition-all duration-300 hover:scale-[1.02] cursor-default">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-2 w-2 bg-success rounded-full animate-pulse-soft"></div>
                    <span className="text-sm font-medium text-success">Approval Rate</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    92% of requests approved this month (+5% vs last month)
                  </p>
                </div>
                
                <div className="p-3 bg-warning/10 rounded-lg border border-warning/20 hover:bg-warning/15 transition-all duration-300 hover:scale-[1.02] cursor-default">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-2 w-2 bg-warning rounded-full animate-pulse-soft"></div>
                    <span className="text-sm font-medium text-warning">Budget Alert</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Team budget is 78% utilized for this quarter
                  </p>
                </div>
                
                <div className="p-3 bg-primary/10 rounded-lg border border-primary/20 hover:bg-primary/15 transition-all duration-300 hover:scale-[1.02] cursor-default">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-2 w-2 bg-primary rounded-full animate-pulse-soft"></div>
                    <span className="text-sm font-medium text-primary">Performance</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Average approval time reduced by 2 days
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}