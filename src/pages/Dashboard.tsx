import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useTranslation } from "@/hooks/use-translation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  ArrowRight, 
  FileText, 
  Plus, 
  TrendingUp,
  Users,
  Clock,
  DollarSign,
  CheckSquare,
  AlertTriangle
} from "lucide-react";
import { DashboardStats, PurchaseRequest, AuditLog, UserRole } from "@/types";
import { formatDistanceToNow } from "date-fns";
import RoleGuard from "@/components/auth/RoleGuard";

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
  const { user } = useAuthStore();
  const { t } = useTranslation();

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const getStateColor = (state: string) => {
    switch (state) {
      case 'DRAFT': return 'bg-gray-100 text-gray-800';
      case 'SUBMITTED': return 'bg-blue-100 text-blue-800';
      case 'DM_APPROVED': return 'bg-green-100 text-green-800';
      case 'ACCT_APPROVED': return 'bg-purple-100 text-purple-800';
      case 'FINAL_APPROVED': return 'bg-emerald-100 text-emerald-800';
      case 'FUNDS_TRANSFERRED': return 'bg-cyan-100 text-cyan-800';
      default: return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t('dashboard.welcome')}, {user?.name.split(' ')[0]}!
          </h1>
          <p className="text-gray-600 mt-1">
            {t('dashboard.subtitle')}
          </p>
        </div>
        
        <RoleGuard allowedRoles={['USER']}>
          <Button asChild>
            <Link to="/prs/create">
              <Plus className="mr-2 h-4 w-4" />
              {t('nav.createPR')}
            </Link>
          </Button>
        </RoleGuard>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total PRs</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalPRs}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.pendingApprovals}</div>
            <p className="text-xs text-muted-foreground">
              Requires your attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.approvedThisMonth}</div>
            <p className="text-xs text-muted-foreground">
              +8% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Utilization</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.budgetUtilization}%</div>
            <Progress value={mockStats.budgetUtilization} className="mt-2" />
            {mockStats.budgetUtilization > 80 && (
              <div className="flex items-center mt-2 text-xs text-amber-600">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Approaching budget limit
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent PRs */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Recent Requests
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/prs">
                  View all
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockRecentPRs.map((pr) => (
                <div key={pr.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{pr.title}</h4>
                      <Badge className={getStateColor(pr.state)}>
                        {pr.state.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{pr.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{formatCurrency(pr.desiredCost, pr.currency)}</span>
                      <span>•</span>
                      <span>{formatDistanceToNow(pr.createdAt, { addSuffix: true })}</span>
                      <span>•</span>
                      <span>By {pr.requester?.name}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={`/prs/${pr.id}`}>View</Link>
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Activity Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockStats.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 pb-3 last:pb-0 border-b last:border-0">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={activity.user?.avatar} />
                      <AvatarFallback className="text-xs">
                        {activity.user ? getInitials(activity.user.name) : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{activity.user?.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {activity.action}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {activity.action} purchase request #{activity.entityId.slice(-3)}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
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
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RoleGuard allowedRoles={['USER']}>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/prs/create">
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Request
                  </Link>
                </Button>
              </RoleGuard>
              
              <RoleGuard allowedRoles={['DIRECT_MANAGER', 'ACCOUNTANT', 'FINAL_MANAGER']}>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/approvals">
                    <CheckSquare className="mr-2 h-4 w-4" />
                    Review Pending ({mockStats.pendingApprovals})
                  </Link>
                </Button>
              </RoleGuard>
              
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/prs">
                  <FileText className="mr-2 h-4 w-4" />
                  My Requests
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-500" />
                Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-green-50 dark:bg-green-950/50 rounded-lg border border-green-200 dark:border-green-800/80">
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-700 dark:text-green-400">Approval Rate</span>
                </div>
                <p className="text-xs text-gray-600">
                  92% of requests approved this month (+5% vs last month)
                </p>
              </div>
              
              <div className="p-3 bg-amber-50 dark:bg-amber-950/50 rounded-lg border border-amber-200 dark:border-amber-800/80">
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-2 w-2 bg-amber-500 rounded-full"></div>
                  <span className="text-sm font-medium text-amber-700 dark:text-amber-400">Budget Alert</span>
                </div>
                <p className="text-xs text-gray-600">
                  Team budget is 78% utilized for this quarter
                </p>
              </div>
              
              <div className="p-3 bg-blue-50 dark:bg-blue-950/50 rounded-lg border border-blue-200 dark:border-blue-800/80">
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-400">Performance</span>
                </div>
                <p className="text-xs text-gray-600">
                  Average approval time reduced by 2 days
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}