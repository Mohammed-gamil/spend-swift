import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useApiPRStore } from "@/stores/apiPRStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Search, Filter, Eye, Edit, Calendar, DollarSign, Clock } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { PurchaseRequest } from "@/types";
import RoleGuard from "@/components/auth/RoleGuard";
import { useTranslation } from "@/hooks/use-translation";

// Mock data
const mockPRs: PurchaseRequest[] = [
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
    items: [{ id: "1", name: "MacBook Pro M3", quantity: 1, unitPrice: 2499, total: 2499 }],
    quotes: [],
    approvals: [],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: "PR-2024-002",
    requesterId: "3",
    requester: { id: "3", name: "Mohamed Ali", email: "mohamed@company.com", role: "USER", status: "active" },
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

export default function PRList() {
  const { user } = useAuthStore();
  const { prs, isLoading, getPRs } = useApiPRStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [stateFilter, setStateFilter] = useState<string>("all");
  const { t } = useTranslation();

  useEffect(() => {
    getPRs();
  }, [getPRs]);

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

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  // Combine mock data with store data for demo purposes
  const allPRs = [...mockPRs, ...prs];
  
  const filteredPRs = allPRs.filter(pr => {
    const matchesSearch = searchQuery === "" || 
      pr.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pr.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesState = stateFilter === "all" || pr.state === stateFilter;
    
    return matchesSearch && matchesState;
  });

  return (
    <div className="pr-page-container">
      {/* Header */}
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="pr-page-title">{t('nav.myPRs')}</h1>
          <p className="pr-page-subtitle">{t('dashboard.recentRequests')}</p>
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

      {/* Filters */}
      <Card className="pr-filters-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            {t('reports.filters')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="search-input-wrapper">
                <Search className="search-input-icon" />
                <Input
                  placeholder={t('common.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>
            
            <Select value={stateFilter} onValueChange={setStateFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder={t('common.filter')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('common.all')}</SelectItem>
                <SelectItem value="DRAFT">{t('status.DRAFT')}</SelectItem>
                <SelectItem value="SUBMITTED">{t('status.SUBMITTED')}</SelectItem>
                <SelectItem value="DM_APPROVED">{t('status.DM_APPROVED')}</SelectItem>
                <SelectItem value="ACCT_APPROVED">{t('status.ACCT_APPROVED')}</SelectItem>
                <SelectItem value="FINAL_APPROVED">{t('status.FINAL_APPROVED')}</SelectItem>
                <SelectItem value="FUNDS_TRANSFERRED">{t('status.FUNDS_TRANSFERRED')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* PR List */}
      <Card>
        <CardHeader>
          <CardTitle>
            {t('nav.myPRs')} ({filteredPRs.length})
          </CardTitle>
          <CardDescription>
            {stateFilter === "all" 
              ? t('dashboard.recentRequests') 
              : `${t('common.status')}: ${t(('status.' + stateFilter) as any)}`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredPRs.length > 0 ? (
            <div className="pr-card-grid">
              {filteredPRs.map((pr) => (
                <div key={pr.id} className="pr-card">
                  {/* Card Header */}
                  <div className="pr-card-header">
                    <h3 className="pr-card-title">{pr.title}</h3>
                    <Badge className={`status-badge status-${pr.state.toLowerCase()}`}>
                      {pr.state.replace('_', ' ')}
                    </Badge>
                  </div>

                  {/* Card Body */}
                  <div className="pr-card-body">
                    <p className="pr-card-description">{pr.description}</p>
                  </div>

                  {/* Card Footer */}
                  <div className="pr-card-footer">
                    <div className="pr-card-metadata">
                      <div className="metadata-item">
                        <Calendar className="metadata-icon" />
                        <span>{t('prDetails.neededBy')} {format(pr.neededByDate, "MMM d")}</span>
                      </div>
                      <div className="metadata-item">
                        <DollarSign className="metadata-icon" />
                        <span>{formatCurrency(pr.desiredCost, pr.currency)}</span>
                      </div>
                      <div className="metadata-item">
                        <span className="font-mono text-xs">{pr.id}</span>
                      </div>
                    </div>
                    <div className="pr-card-actions">
                      <div className="avatar-group">
                        <Avatar className="avatar-circle">
                          <AvatarImage src={pr.requester?.avatar} />
                          <AvatarFallback className="avatar-fallback">
                            {pr.requester?.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <Button variant="ghost" size="icon" title={t('dashboard.view')} asChild>
                        <Link to={`/prs/${pr.id}`}>
                          <Eye className="h-5 w-5" />
                        </Link>
                      </Button>
                      <RoleGuard allowedRoles={['USER']}>
                        {pr.state === 'DRAFT' && (
                          <Button variant="ghost" size="icon" title={t('prDetails.editRequest')} asChild>
                            <Link to={`/prs/${pr.id}/edit`}>
                              <Edit className="h-5 w-5" />
                            </Link>
                          </Button>
                        )}
                      </RoleGuard>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {t('notfound.message')}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchQuery || stateFilter !== 'all' 
                  ? t('common.error') 
                  : t('prCreate.subtitle')
                }
              </p>
              {(searchQuery || stateFilter !== 'all') ? (
                <Button 
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setStateFilter('all');
                  }}
                >
                  {t('common.reset')}
                </Button>
              ) : (
                <RoleGuard allowedRoles={['USER']}>
                  <Button asChild>
                    <Link to="/prs/create">
                      <Plus className="mr-2 h-4 w-4" />
                      {t('dashboard.createNewRequest')}
                    </Link>
                  </Button>
                </RoleGuard>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
