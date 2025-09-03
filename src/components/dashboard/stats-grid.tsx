import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  AlertCircle,
  DollarSign
} from "lucide-react";
import { DashboardStats } from "@/types";

interface StatsGridProps {
  stats: DashboardStats;
  userRole: string;
}

export function StatsGrid({ stats, userRole }: StatsGridProps) {
  const isApprover = ['DIRECT_MANAGER', 'ACCOUNTANT', 'FINAL_MANAGER'].includes(userRole);
  
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {/* Total PRs */}
      <Card className="hover:shadow-md transition-fast">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {userRole === 'USER' ? 'My Requests' : 'Total Requests'}
          </CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{stats.totalPRs}</div>
          <p className="text-xs text-muted-foreground">
            All time requests
          </p>
        </CardContent>
      </Card>

      {/* Pending Approvals */}
      {isApprover && (
        <Card className="hover:shadow-md transition-fast">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{stats.pendingApprovals}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting your action
            </p>
            {stats.pendingApprovals > 0 && (
              <Badge variant="outline" className="text-warning border-warning mt-2">
                <AlertCircle className="h-3 w-3 mr-1" />
                Action needed
              </Badge>
            )}
          </CardContent>
        </Card>
      )}

      {/* Approved This Month */}
      <Card className="hover:shadow-md transition-fast">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {userRole === 'USER' ? 'Approved This Month' : 'Monthly Approvals'}
          </CardTitle>
          <CheckCircle className="h-4 w-4 text-success" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-success">{stats.approvedThisMonth}</div>
          <p className="text-xs text-muted-foreground">
            +12% from last month
          </p>
        </CardContent>
      </Card>

      {/* Average Approval Time */}
      <Card className="hover:shadow-md transition-fast">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg. Approval Time</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.averageApprovalTime}d</div>
          <p className="text-xs text-muted-foreground">
            -2 days from last month
          </p>
        </CardContent>
      </Card>

      {/* Budget Utilization */}
      <Card className="hover:shadow-md transition-fast lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Budget Utilization</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-2xl font-bold">{stats.budgetUtilization}%</span>
                <span className="text-sm text-muted-foreground">utilized</span>
              </div>
              <Progress 
                value={stats.budgetUtilization} 
                className="h-2"
                // Change color based on utilization
                // @ts-ignore - Custom prop for styling
                variant={stats.budgetUtilization > 90 ? 'destructive' : stats.budgetUtilization > 75 ? 'warning' : 'default'}
              />
            </div>
            <div className="text-right">
              <div className="text-sm font-medium">$125,750</div>
              <div className="text-xs text-muted-foreground">of $150,000</div>
            </div>
          </div>
          
          {stats.budgetUtilization > 90 && (
            <Badge variant="destructive" className="mt-3">
              <AlertCircle className="h-3 w-3 mr-1" />
              Budget limit approaching
            </Badge>
          )}
        </CardContent>
      </Card>
    </div>
  );
}