import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useTranslation } from "@/hooks/use-translation";
import { useLanguageStore } from "@/hooks/use-language";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { CustomCard } from "@/components/ui/custom-card";
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
  AlertTriangle,
  BarChart3,
  Briefcase,
  LineChart,
  Sparkles,
  Star
} from "lucide-react";
import { 
  DashboardStats, 
  PurchaseRequest, 
  ProjectRequest, 
  Request, 
  AuditLog, 
  UserRole, 
  RequestType 
} from "@/types";
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
  // Project-specific stats
  totalProjects: 12,
  totalProjectValue: 180000,
  totalProjectBenefit: 250000,
  projectsCompletionRate: 65,
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
      entityType: "ProjectRequest", 
      entityId: "PROJ-2024-001",
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    }
  ]
};

// Mock purchase requests
const mockPurchaseRequests: PurchaseRequest[] = [
  {
    id: "PR-2024-001",
    requesterId: "2",
    requester: { id: "2", name: "Sarah Ahmed", email: "", role: "USER", status: "active" },
    title: "New MacBook Pro for Development Team",
    description: "Urgent requirement for M3 MacBook Pro to replace aging development machine",
    type: "purchase",
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
    type: "purchase",
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

// Mock project requests
const mockProjectRequests: ProjectRequest[] = [
  {
    id: "PROJ-2024-001",
    requesterId: "2",
    requester: { id: "2", name: "Sarah Ahmed", email: "", role: "USER", status: "active" },
    title: "Website Redesign Project",
    description: "Complete redesign of company website with improved UX/UI",
    type: "project",
    category: "Digital Transformation",
    desiredCost: 15000,
    currency: "USD",
    neededByDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    state: "DM_APPROVED",
    clientName: "Internal Marketing Team",
    projectDescription: "Redesign company website with focus on improved user experience, mobile responsiveness, and conversion rate optimization.",
    totalCost: 12000,
    totalBenefit: 25000,
    totalPrice: 15000,
    quotes: [],
    approvals: [],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  }
];

// Combine both request types for display
const mockRecentPRs: Request[] = [...mockPurchaseRequests, ...mockProjectRequests].sort((a, b) => 
  b.createdAt.getTime() - a.createdAt.getTime()
).slice(0, 3);

export default function Dashboard() {
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const { direction } = useLanguageStore();
  const [selectedRequestType, setSelectedRequestType] = useState<RequestType | "all">("all");

  // Filter the PRs by request type
  const filteredRequests = selectedRequestType === "all" 
    ? mockRecentPRs 
    : mockRecentPRs.filter(pr => "type" in pr && pr.type === selectedRequestType);

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
      case 'DRAFT': return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100';
      case 'SUBMITTED': return 'bg-blue-100 dark:bg-blue-800/50 text-blue-800 dark:text-blue-200';
      case 'DM_APPROVED': return 'bg-green-100 dark:bg-green-800/50 text-green-800 dark:text-green-200';
      case 'ACCT_APPROVED': return 'bg-purple-100 dark:bg-purple-800/50 text-purple-800 dark:text-purple-200';
      case 'FINAL_APPROVED': return 'bg-emerald-100 dark:bg-emerald-800/50 text-emerald-800 dark:text-emerald-200';
      case 'FUNDS_TRANSFERRED': return 'bg-cyan-100 dark:bg-cyan-800/50 text-cyan-800 dark:text-cyan-200';
      default: return 'bg-red-100 dark:bg-red-800/50 text-red-800 dark:text-red-200';
    }
  };
  
  // Get request type badge color
  const getRequestTypeColor = (type: RequestType) => {
    switch (type) {
      case 'purchase': return 'bg-indigo-100 dark:bg-indigo-800/50 text-indigo-800 dark:text-indigo-200';
      case 'project': return 'bg-amber-100 dark:bg-amber-800/50 text-amber-800 dark:text-amber-200';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`page-header flex items-center ${direction === 'rtl' ? 'flex-row-reverse' : ''} justify-between`}>
        <div className="text-start">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('dashboard.welcome')}, {user?.name.split(' ')[0]}!
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            {t('dashboard.subtitle')}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Request Type Filter */}
          <div className="flex items-center">
            <select 
              className="border border-gray-300 dark:border-gray-700 rounded px-3 py-1 bg-white dark:bg-gray-800 text-sm"
              value={selectedRequestType}
              onChange={(e) => setSelectedRequestType(e.target.value as RequestType | "all")}
            >
              <option value="all">{t('dashboard.filters.allRequests')}</option>
              <option value="purchase">{t('dashboard.filters.purchaseRequests')}</option>
              <option value="project">{t('dashboard.filters.projectRequests')}</option>
            </select>
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
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.totalPRs')}</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalPRs}</div>
            <p className="text-xs text-muted-foreground">
              {t('dashboard.fromLastMonth')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.pendingApprovals')}</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.pendingApprovals}</div>
            <p className="text-xs text-muted-foreground">
              {t('dashboard.requiresAttention')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.approvedThisMonth')}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.approvedThisMonth}</div>
            <p className="text-xs text-muted-foreground">
              {t('dashboard.fromLastMonth')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.budgetUtilization')}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.budgetUtilization}%</div>
            <Progress value={mockStats.budgetUtilization} className="mt-2" />
            {mockStats.budgetUtilization > 80 && (
              <div className="flex items-center mt-2 text-xs text-amber-600">
                <AlertTriangle className="h-3 w-3 mr-1" />
                {t('dashboard.approachingBudget')}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Project Request Stats */}
      {(selectedRequestType === 'all' || selectedRequestType === 'project') && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-l-4 border-l-amber-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('dashboard.totalProjects')}</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.totalProjects}</div>
              <p className="text-xs text-muted-foreground">
                {t('dashboard.activeProjects')}
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('dashboard.totalProjectValue')}</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(mockStats.totalProjectValue ?? 0, 'USD')}</div>
              <p className="text-xs text-muted-foreground">
                {t('dashboard.estimatedValue')}
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('dashboard.totalProjectBenefit')}</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(mockStats.totalProjectBenefit ?? 0, 'USD')}</div>
              <p className="text-xs text-muted-foreground">
                {t('dashboard.projectedBenefit')}
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('dashboard.projectsCompletionRate')}</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.projectsCompletionRate}%</div>
              <Progress value={mockStats.projectsCompletionRate} className="mt-2" />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent PRs */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className={`flex flex-row items-center ${direction === 'rtl' ? 'flex-row-reverse' : ''} justify-between`}>
              <CardTitle className="flex items-center gap-2">
                <FileText className={`h-5 w-5 ${direction === 'rtl' ? 'ml-2' : 'mr-0'}`} />
                {t('dashboard.recentRequests')}
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/prs">
                  {t('dashboard.viewAll')}
                  <ArrowRight className={`${direction === 'rtl' ? 'mr-1 rtl-flip' : 'ml-1'} h-4 w-4`} />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockRecentPRs.map((pr) => (
                <div key={pr.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 dark:border-gray-700 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{pr.title}</h4>
                      <Badge className={getStateColor(pr.state)}>
                        {pr.state.replace('_', ' ')}
                      </Badge>
                      <Badge className={getRequestTypeColor(pr.type)}>
                        {t(`dashboard.requestType.${pr.type}`)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{pr.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <span>{formatCurrency(pr.desiredCost, pr.currency)}</span>
                      <span>•</span>
                      {pr.type === 'project' && (
                        <>
                          <span className="text-amber-600 dark:text-amber-400 font-medium">
                            {t('dashboard.client')}: {(pr as ProjectRequest).clientName}
                          </span>
                          <span>•</span>
                        </>
                      )}
                      <span>{formatDistanceToNow(pr.createdAt, { addSuffix: true })}</span>
                      <span>•</span>
                      <span>{t('common.by')} {pr.requester?.name}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-100" asChild>
                    <Link to={`/prs/${pr.id}`}>{t('dashboard.view')}</Link>
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Activity Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className={`h-5 w-5 ${direction === 'rtl' ? 'ml-0' : 'mr-0'}`} />
                {t('dashboard.recentActivity')}
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
                        {activity.entityType === 'ProjectRequest' ? (
                          <Badge variant="outline" className={`text-xs ${getRequestTypeColor('project')}`}>
                            {t('dashboard.requestType.project')}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className={`text-xs ${getRequestTypeColor('purchase')}`}>
                            {t('dashboard.requestType.purchase')}
                          </Badge>
                        )}
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
              <CardTitle className={`${direction === 'rtl' ? 'text-right w-full' : ''}`}>{t('dashboard.quickActions')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RoleGuard allowedRoles={['USER']}>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/prs/create">
                    <Plus className={`${direction === 'rtl' ? 'ml-2' : 'mr-2'} h-4 w-4`} />
                    {t('dashboard.createNewRequest')}
                  </Link>
                </Button>
              </RoleGuard>
              
              <RoleGuard allowedRoles={['DIRECT_MANAGER', 'ACCOUNTANT', 'FINAL_MANAGER']}>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/approvals">
                    <CheckSquare className={`${direction === 'rtl' ? 'ml-2' : 'mr-2'} h-4 w-4`} />
                    {t('dashboard.reviewPending')} ({mockStats.pendingApprovals})
                  </Link>
                </Button>
              </RoleGuard>
              
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/prs">
                  <FileText className={`${direction === 'rtl' ? 'ml-2' : 'mr-2'} h-4 w-4`} />
                  {t('dashboard.myRequests')}
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Insights */}
          <Card>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${direction === 'rtl' ? 'justify-end' : ''}`}>
                <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-500" />
                {t('dashboard.insights')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-green-50 dark:bg-green-950/50 rounded-lg border border-green-200 dark:border-green-800/80">
                <div className={`flex items-center gap-2 mb-1 ${direction === 'rtl' ? 'justify-end' : ''}`}>
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-700 dark:text-green-400">{t('dashboard.approvalRate')}</span>
                </div>
                <p className={`text-xs text-gray-600 dark:text-gray-300 ${direction === 'rtl' ? 'text-right' : ''}`}>
                  {t('dashboard.approvalRateDesc')}
                </p>
              </div>
              
              <div className="p-3 bg-amber-50 dark:bg-amber-950/50 rounded-lg border border-amber-200 dark:border-amber-800/80">
                <div className={`flex items-center gap-2 mb-1 ${direction === 'rtl' ? 'justify-end' : ''}`}>
                  <div className="h-2 w-2 bg-amber-500 rounded-full"></div>
                  <span className="text-sm font-medium text-amber-700 dark:text-amber-400">{t('dashboard.budgetAlert')}</span>
                </div>
                <p className={`text-xs text-gray-600 dark:text-gray-300 ${direction === 'rtl' ? 'text-right' : ''}`}>
                  {t('dashboard.budgetAlertDesc')}
                </p>
              </div>
              
              <div className="p-3 bg-blue-50 dark:bg-blue-950/50 rounded-lg border border-blue-200 dark:border-blue-800/80">
                <div className={`flex items-center gap-2 mb-1 ${direction === 'rtl' ? 'justify-end' : ''}`}>
                  <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-400">{t('dashboard.performance')}</span>
                </div>
                <p className={`text-xs text-gray-600 dark:text-gray-300 ${direction === 'rtl' ? 'text-right' : ''}`}>
                  {t('dashboard.performanceDesc')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* New Featured Insights Section using CustomCard */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">{t('dashboard.featuredInsights')}</h2>
        <div className="grid gap-6 lg:grid-cols-2">
          <CustomCard 
            title={t('dashboard.performanceMetrics')} 
            subtitle={t('dashboard.performanceMetricsDesc')}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-blue-500" />
                  <span className="font-medium">{t('dashboard.approvalEfficiency')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-lg font-bold text-blue-500">94%</span>
                  <span className="text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 px-1.5 py-0.5 rounded">+5%</span>
                </div>
              </div>
              <div className="h-2 w-full bg-blue-100 dark:bg-blue-900/30 rounded">
                <div className="h-2 bg-blue-500 dark:bg-blue-400 rounded" style={{ width: '94%' }}></div>
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-500" />
                  <span className="font-medium">{t('dashboard.costOptimization')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-lg font-bold text-amber-500">82%</span>
                  <span className="text-xs bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 px-1.5 py-0.5 rounded">+2%</span>
                </div>
              </div>
              <div className="h-2 w-full bg-amber-100 dark:bg-amber-900/30 rounded">
                <div className="h-2 bg-amber-500 dark:bg-amber-400 rounded" style={{ width: '82%' }}></div>
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-green-500" />
                  <span className="font-medium">{t('dashboard.userSatisfaction')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-lg font-bold text-green-500">88%</span>
                  <span className="text-xs bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200 px-1.5 py-0.5 rounded">+7%</span>
                </div>
              </div>
              <div className="h-2 w-full bg-green-100 dark:bg-green-900/30 rounded">
                <div className="h-2 bg-green-500 dark:bg-green-400 rounded" style={{ width: '88%' }}></div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-border/40">
              <Button variant="outline" size="sm" className="w-full">
                {t('dashboard.viewDetailedAnalytics')}
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </CustomCard>
          
          <CustomCard 
            title={t('dashboard.resourceAllocation')} 
            subtitle={t('dashboard.resourceAllocationDesc')}
          >
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-background/80 border border-border/30 rounded-lg p-3 text-center">
                  <DollarSign className="h-6 w-6 mx-auto mb-1 text-blue-500" />
                  <div className="text-xl font-bold">$178,400</div>
                  <div className="text-xs text-muted-foreground">{t('dashboard.totalBudget')}</div>
                </div>
                <div className="bg-background/80 border border-border/30 rounded-lg p-3 text-center">
                  <TrendingUp className="h-6 w-6 mx-auto mb-1 text-green-500" />
                  <div className="text-xl font-bold">$82,150</div>
                  <div className="text-xs text-muted-foreground">{t('dashboard.availableFunds')}</div>
                </div>
                <div className="bg-background/80 border border-border/30 rounded-lg p-3 text-center">
                  <CheckSquare className="h-6 w-6 mx-auto mb-1 text-purple-500" />
                  <div className="text-xl font-bold">31</div>
                  <div className="text-xs text-muted-foreground">{t('dashboard.completedRequests')}</div>
                </div>
                <div className="bg-background/80 border border-border/30 rounded-lg p-3 text-center">
                  <Clock className="h-6 w-6 mx-auto mb-1 text-amber-500" />
                  <div className="text-xl font-bold">2.8 {t('dashboard.days')}</div>
                  <div className="text-xs text-muted-foreground">{t('dashboard.avgProcessTime')}</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 p-3 rounded-lg border border-blue-200/30 dark:border-blue-800/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{t('dashboard.budgetForecast')}</span>
                  <Badge variant="outline" className="text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-700">Q3 2024</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {t('dashboard.budgetForecastDesc')}
                </p>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-border/40">
              <Button variant="outline" size="sm" className="w-full">
                {t('dashboard.viewResourceDashboard')}
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </CustomCard>
        </div>
      </div>
    </div>
  );
}