import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign, 
  TrendingUp, 
  Download, 
  Eye,
  CreditCard,
  Building,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";

export default function Accounting() {
  const [selectedPeriod, setSelectedPeriod] = useState("current-month");

  const stats = [
    {
      title: "Pending Transfers",
      value: "$45,230",
      change: "+12%",
      icon: CreditCard,
      color: "text-orange-600",
      trend: "up"
    },
    {
      title: "Monthly Budget Used",
      value: "68%",
      change: "+5%",
      icon: TrendingUp,
      color: "text-blue-600",
      trend: "up"
    },
    {
      title: "Approved This Month",
      value: "$128,450",
      change: "+18%",
      icon: DollarSign,
      color: "text-green-600",
      trend: "up"
    },
    {
      title: "Active Departments",
      value: "12",
      change: "0%",
      icon: Building,
      color: "text-purple-600",
      trend: "neutral"
    }
  ];

  const pendingTransfers = [
    {
      id: "PR-2024-001",
      title: "Office Equipment Purchase",
      amount: 15420,
      requester: "John Smith",
      department: "IT",
      approvedDate: new Date(2024, 0, 15),
      priority: "high"
    },
    {
      id: "PR-2024-002", 
      title: "Marketing Campaign Materials",
      amount: 8750,
      requester: "Sarah Ahmed",
      department: "Marketing",
      approvedDate: new Date(2024, 0, 14),
      priority: "medium"
    },
    {
      id: "PR-2024-003",
      title: "Software Licenses",
      amount: 21060,
      requester: "Mohamed Ali",
      department: "Development",
      approvedDate: new Date(2024, 0, 13),
      priority: "high"
    }
  ];

  const recentTransactions = [
    {
      id: "TXN-001",
      prId: "PR-2023-045",
      title: "Conference Registration",
      amount: 2500,
      status: "completed",
      transferredDate: new Date(2024, 0, 12),
      method: "Bank Transfer"
    },
    {
      id: "TXN-002",
      prId: "PR-2023-046",
      title: "Office Supplies",
      amount: 850,
      status: "completed",
      transferredDate: new Date(2024, 0, 11),
      method: "Corporate Card"
    },
    {
      id: "TXN-003",
      prId: "PR-2023-047",
      title: "Training Materials",
      amount: 1200,
      status: "pending",
      transferredDate: new Date(2024, 0, 10),
      method: "Check"
    }
  ];

  const budgets = [
    {
      department: "IT",
      allocated: 50000,
      used: 34200,
      remaining: 15800,
      utilization: 68.4
    },
    {
      department: "Marketing",
      allocated: 30000,
      used: 22100,
      remaining: 7900,
      utilization: 73.7
    },
    {
      department: "Development",
      allocated: 75000,
      used: 45300,
      remaining: 29700,
      utilization: 60.4
    },
    {
      department: "Operations",
      allocated: 25000,
      used: 18700,
      remaining: 6300,
      utilization: 74.8
    }
  ];

  const handleTransferFunds = (prId: string) => {
    toast.success(`Initiating fund transfer for ${prId}`);
  };

  const handleExportReport = (type: string) => {
    toast.success(`Generating ${type} report...`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Accounting Dashboard</h1>
          <p className="text-muted-foreground">
            Manage financial approvals, transfers, and budgets
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current-month">Current Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => handleExportReport('financial')}>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                  ) : stat.trend === "down" ? (
                    <ArrowDownRight className="mr-1 h-3 w-3 text-red-500" />
                  ) : null}
                  <span className={stat.trend === "up" ? "text-green-600" : stat.trend === "down" ? "text-red-600" : ""}>
                    {stat.change}
                  </span>
                  <span className="ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="transfers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="transfers">Pending Transfers</TabsTrigger>
          <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
          <TabsTrigger value="budgets">Department Budgets</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        {/* Pending Transfers Tab */}
        <TabsContent value="transfers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Fund Transfers</CardTitle>
              <CardDescription>
                Purchase requests approved and awaiting fund transfer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingTransfers.map((transfer) => (
                  <div key={transfer.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex flex-col">
                        <div className="font-medium">{transfer.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {transfer.id} • {transfer.requester} • {transfer.department}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Approved: {format(transfer.approvedDate, "MMM dd, yyyy")}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge variant={transfer.priority === "high" ? "destructive" : "secondary"}>
                        {transfer.priority}
                      </Badge>
                      <div className="text-right">
                        <div className="font-bold">${transfer.amount.toLocaleString()}</div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => handleTransferFunds(transfer.id)}
                        >
                          Transfer Funds
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recent Transactions Tab */}
        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>
                Recently completed and pending fund transfers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                        {transaction.status === "completed" ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : transaction.status === "pending" ? (
                          <Clock className="h-5 w-5 text-orange-600" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <div className="font-medium">{transaction.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {transaction.prId} • {transaction.method}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {format(transaction.transferredDate, "MMM dd, yyyy")}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge variant={
                        transaction.status === "completed" ? "default" : 
                        transaction.status === "pending" ? "secondary" : "destructive"
                      }>
                        {transaction.status}
                      </Badge>
                      <div className="text-right">
                        <div className="font-bold">${transaction.amount.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Department Budgets Tab */}
        <TabsContent value="budgets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Department Budget Overview</CardTitle>
              <CardDescription>
                Current budget utilization by department
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {budgets.map((budget) => (
                  <div key={budget.department} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{budget.department}</div>
                      <div className="text-sm text-muted-foreground">
                        ${budget.used.toLocaleString()} / ${budget.allocated.toLocaleString()}
                      </div>
                    </div>
                    <Progress value={budget.utilization} className="h-2" />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{budget.utilization.toFixed(1)}% utilized</span>
                      <span>${budget.remaining.toLocaleString()} remaining</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Financial Summary</CardTitle>
                <CardDescription>Monthly financial overview</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => handleExportReport('financial-summary')}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Budget Analysis</CardTitle>
                <CardDescription>Department budget breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => handleExportReport('budget-analysis')}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Transaction History</CardTitle>
                <CardDescription>Detailed transaction log</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => handleExportReport('transaction-history')}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
