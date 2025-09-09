import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Search, 
  Filter, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Eye,
  Calendar,
  DollarSign
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { ar as arSA } from "date-fns/locale";
import { PurchaseRequest, UserRole } from "@/types";
import { useTranslation } from "@/hooks/use-translation";

// Mock data for pending approvals
const mockPendingPRs: PurchaseRequest[] = [
  {
    id: "PR-2024-001",
    requesterId: "2",
    requester: { id: "2", name: "Sarah Ahmed", email: "sarah@company.com", role: "USER", status: "active" },
    title: "New MacBook Pro for Development Team",
    description: "Urgent requirement for M3 MacBook Pro to replace aging development machine",
    category: "IT Equipment",
    desiredCost: 2499,
    currency: "USD",
    neededByDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    state: "SUBMITTED",
    currentApproverId: "1",
    items: [{ id: "1", name: "MacBook Pro M3", quantity: 1, unitPrice: 2499, total: 2499 }],
    quotes: [],
    approvals: [],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: "PR-2024-003",
    requesterId: "4",
    requester: { id: "4", name: "Omar Hassan", email: "omar@company.com", role: "USER", status: "active" },
    title: "Marketing Campaign Materials",
    description: "Promotional materials for Q2 marketing campaign including banners, flyers, and digital assets",
    category: "Marketing Materials",
    desiredCost: 1250,
    currency: "USD",
    neededByDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    state: "SUBMITTED",
    currentApproverId: "1",
    items: [
      { id: "3", name: "Banner Printing", quantity: 10, unitPrice: 50, total: 500 },
      { id: "4", name: "Flyer Design & Print", quantity: 1000, unitPrice: 0.75, total: 750 }
    ],
    quotes: [],
    approvals: [],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  },
  {
    id: "PR-2024-004",
    requesterId: "5",
    requester: { id: "5", name: "Fatima Ali", email: "fatima@company.com", role: "USER", status: "active" },
    title: "Software Licenses Renewal",
    description: "Annual renewal of Adobe Creative Suite licenses for design team",
    category: "Software Licenses",
    desiredCost: 3600,
    currency: "USD",
    neededByDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    state: "DM_APPROVED",
    currentApproverId: "3",
    items: [{ id: "5", name: "Adobe Creative Suite (6 licenses)", quantity: 6, unitPrice: 600, total: 3600 }],
    quotes: [],
    approvals: [],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000)
  }
];

export default function Approvals() {
  const { t, language } = useTranslation();
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [stateFilter, setStateFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("created");

  const getStateColor = (state: string) => {
    switch (state) {
      case 'SUBMITTED': return 'bg-blue-100 text-blue-800';
      case 'DM_APPROVED': return 'bg-green-100 text-green-800';
      case 'ACCT_APPROVED': return 'bg-purple-100 text-purple-800';
      case 'FINAL_APPROVED': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat(language === 'ar' ? 'ar-EG' : 'en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const getUrgencyLevel = (neededByDate: Date) => {
    const daysUntilNeeded = Math.ceil((neededByDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (daysUntilNeeded <= 3) return { level: 'urgent', color: 'text-red-600', icon: AlertTriangle };
    if (daysUntilNeeded <= 7) return { level: 'medium', color: 'text-amber-600', icon: Clock };
    return { level: 'normal', color: 'text-green-600', icon: CheckCircle };
  };

  const getFilteredPRs = () => {
    let filtered = mockPendingPRs.filter(pr => {
      // Filter by user's role and current approval stage
      if (!user) return false;
      
      switch (user.role) {
        case 'DIRECT_MANAGER':
          return pr.state === 'SUBMITTED' && pr.currentApproverId === user.id;
        case 'ACCOUNTANT':
          return pr.state === 'DM_APPROVED' && pr.currentApproverId === user.id;
        case 'FINAL_MANAGER':
          return pr.state === 'ACCT_APPROVED' && pr.currentApproverId === user.id;
        default:
          return false;
      }
    });

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(pr => 
        pr.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pr.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pr.requester?.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply state filter
    if (stateFilter !== 'all') {
      filtered = filtered.filter(pr => pr.state === stateFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'amount':
          return b.desiredCost - a.desiredCost;
        case 'urgency':
          return a.neededByDate.getTime() - b.neededByDate.getTime();
        case 'created':
        default:
          return b.createdAt.getTime() - a.createdAt.getTime();
      }
    });

    return filtered;
  };

  const filteredPRs = getFilteredPRs();

  const getPageTitle = () => {
    switch (user?.role) {
      case 'DIRECT_MANAGER':
        return t('nav.approvals');
      case 'ACCOUNTANT':
        return t('nav.approvals');
      case 'FINAL_MANAGER':
        return t('nav.approvals');
      default:
        return t('nav.approvals');
    }
  };

  const getPageDescription = () => {
    switch (user?.role) {
      case 'DIRECT_MANAGER':
        return t('dashboard.reviewPending');
      case 'ACCOUNTANT':
        return t('dashboard.reviewPending');
      case 'FINAL_MANAGER':
        return t('dashboard.reviewPending');
      default:
        return t('dashboard.reviewPending');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">{getPageTitle()}</h1>
        <p className="text-gray-600 mt-1">{getPageDescription()}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('common.pending')}</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredPRs.length}</div>
            <p className="text-xs text-muted-foreground">
              {t('dashboard.requiresAttention')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('common.priority.high')}</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredPRs.filter(pr => getUrgencyLevel(pr.neededByDate).level === 'urgent').length}
            </div>
            <p className="text-xs text-muted-foreground">
              {t('approvals.stats.urgentWithin3Days')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('reports.totalSpend')}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat(language === 'ar' ? 'ar-EG' : 'en-US').format(filteredPRs.reduce((sum, pr) => sum + pr.desiredCost, 0))}
            </div>
            <p className="text-xs text-muted-foreground">
              {t('dashboard.pendingApprovals')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            {t('reports.filters')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={t('common.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={stateFilter} onValueChange={setStateFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder={t('reports.status')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('common.all')}</SelectItem>
                <SelectItem value="SUBMITTED">{t('status.SUBMITTED')}</SelectItem>
                <SelectItem value="DM_APPROVED">{t('status.DM_APPROVED')}</SelectItem>
                <SelectItem value="ACCT_APPROVED">{t('status.ACCT_APPROVED')}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder={t('common.filter')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created">{t('prDetails.created')}</SelectItem>
                <SelectItem value="amount">{t('reports.totalSpend')}</SelectItem>
                <SelectItem value="urgency">{t('common.priority.high')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Approvals List */}
      <Card>
        <CardHeader>
          <CardTitle>
            {t('nav.approvals')} ({filteredPRs.length})
          </CardTitle>
          <CardDescription>
            {t('dashboard.reviewPending')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredPRs.length > 0 ? (
            <div className="space-y-4">
              {filteredPRs.map((pr) => {
                const urgency = getUrgencyLevel(pr.neededByDate);
                const UrgencyIcon = urgency.icon;
                
                return (
                  <div key={pr.id} className="border rounded-lg p-4 hover:bg-accent hover:text-accent-foreground transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{pr.title}</h3>
                          <Badge className={getStateColor(pr.state)}>
                            {t((`status.${pr.state}`) as any)}
                          </Badge>
                          <div className={`flex items-center gap-1 ${urgency.color}`}>
                            <UrgencyIcon className="h-4 w-4" />
                            <span className="text-xs font-medium capitalize">{urgency.level === 'urgent' ? t('common.priority.high') : urgency.level === 'medium' ? t('common.priority.medium') : t('common.priority.low')}</span>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mb-3 line-clamp-2">{pr.description}</p>
                        
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={pr.requester?.avatar} />
                              <AvatarFallback className="text-xs">
                                {pr.requester?.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-gray-600">
                              {pr.requester?.name}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4 text-gray-400" />
                            <span className="font-medium">
                              {formatCurrency(pr.desiredCost, pr.currency)}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span>
                              {t('approvals.labels.due')} {format(pr.neededByDate, "MMM d", { locale: language === 'ar' ? arSA : undefined })}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span>
                              {formatDistanceToNow(pr.createdAt, { addSuffix: true, locale: language === 'ar' ? arSA : undefined })}
                            </span>
                          </div>
                        </div>
                        
                        <div className="mt-3 flex items-center gap-2">
                          <span className="text-sm text-gray-500">
                            {language === 'ar' ? `${pr.items.length} بند` : `${pr.items.length} item${pr.items.length !== 1 ? 's' : ''}`}
                          </span>
                          <span className="text-gray-300">•</span>
                          <span className="text-sm text-gray-500">
                            {pr.category}
                          </span>
                          <span className="text-gray-300">•</span>
                          <span className="text-sm text-gray-500">
                            {t('approvals.labels.id')}: {pr.id}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 ml-4">
                        <Button asChild>
                          <Link to={`/prs/${pr.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            {t('prDetails.review')}
                          </Link>
                        </Button>
                        
                        <div className="text-xs text-center text-gray-500">
                          {t('approvals.labels.sla')}: {Math.ceil((pr.neededByDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} {language === 'ar' ? 'يوم' : 'days'}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <CheckCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {t('approvals.empty.title')}
              </h3>
              <p className="text-gray-600">
                {searchQuery || stateFilter !== 'all' 
                  ? t('approvals.empty.filtered')
                  : t('approvals.empty.allCaughtUp')
                }
              </p>
              {(searchQuery || stateFilter !== 'all') && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery('');
                    setStateFilter('all');
                  }}
                >
                  {t('common.reset')}
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
