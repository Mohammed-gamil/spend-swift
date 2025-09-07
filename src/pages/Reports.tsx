import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  BarChart as ReBarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  PieChart as RePieChart,
  Pie,
  Cell,
  LineChart as ReLineChart,
  Line
} from "recharts";
import { Download, Filter, Percent, PieChart, TrendingUp, Users } from "lucide-react";

type Status = "ALL" | "SUBMITTED" | "DM_APPROVED" | "ACCT_APPROVED" | "FINAL_APPROVED" | "REJECTED" | "FUNDS_TRANSFERRED";

type RequesterStat = {
  name: string;
  count: number;
  spend: number;
};

const mockMonthly = [
  { month: "Jan", submitted: 20, approved: 15, spend: 12000 },
  { month: "Feb", submitted: 24, approved: 18, spend: 14500 },
  { month: "Mar", submitted: 26, approved: 21, spend: 15200 },
  { month: "Apr", submitted: 22, approved: 19, spend: 13100 },
  { month: "May", submitted: 28, approved: 25, spend: 17400 },
  { month: "Jun", submitted: 31, approved: 27, spend: 18900 },
  { month: "Jul", submitted: 29, approved: 24, spend: 17650 },
  { month: "Aug", submitted: 33, approved: 29, spend: 20120 },
  { month: "Sep", submitted: 30, approved: 26, spend: 18750 },
  { month: "Oct", submitted: 27, approved: 23, spend: 16500 },
  { month: "Nov", submitted: 25, approved: 21, spend: 15800 },
  { month: "Dec", submitted: 22, approved: 18, spend: 14000 },
];

const mockCategories = [
  { name: "IT Equipment", value: 54000 },
  { name: "Office Supplies", value: 18200 },
  { name: "Travel", value: 22350 },
  { name: "Marketing", value: 16400 },
  { name: "Consulting", value: 28900 },
];

const mockRequesters: RequesterStat[] = [
  { name: "Sarah Ahmed", count: 18, spend: 24500 },
  { name: "Mohamed Ali", count: 15, spend: 21750 },
  { name: "Omar Khaled", count: 12, spend: 18340 },
  { name: "Laila Hassan", count: 9, spend: 15200 },
  { name: "Youssef Nabil", count: 7, spend: 10850 },
];

export default function Reports() {
  const [status, setStatus] = useState<Status>("ALL");
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");

  // Derived metrics
  const totals = useMemo(() => {
    const submitted = mockMonthly.reduce((a, b) => a + b.submitted, 0);
    const approved = mockMonthly.reduce((a, b) => a + b.approved, 0);
    const spend = mockMonthly.reduce((a, b) => a + b.spend, 0);
    const approvalRate = submitted > 0 ? Math.round((approved / submitted) * 100) : 0;
    return { submitted, approved, spend, approvalRate };
  }, []);

  // Colors for charts (validated in ChartContainer)
  const chartConfig = {
    submitted: { label: "Submitted", color: "hsl(221 83% 53%)" },
    approved: { label: "Approved", color: "hsl(142 70% 45%)" },
    spend: { label: "Spend", color: "hsl(27 96% 61%)" },
    categoryA: { label: "Category", color: "hsl(217 91% 60%)" },
    categoryB: { label: "Category", color: "hsl(267 84% 81%)" },
    categoryC: { label: "Category", color: "hsl(199 89% 48%)" },
    categoryD: { label: "Category", color: "hsl(339 90% 51%)" },
    categoryE: { label: "Category", color: "hsl(43 96% 56%)" },
  } as const;

  const categoryColors = [
    "hsl(217 91% 60%)",
    "hsl(267 84% 81%)",
    "hsl(199 89% 48%)",
    "hsl(339 90% 51%)",
    "hsl(43 96% 56%)",
  ];

  const exportCSV = () => {
    const rows = [
      ["Month", "Submitted", "Approved", "Spend"],
      ...mockMonthly.map((m) => [m.month, m.submitted, m.approved, m.spend]),
      [],
      ["Top Requesters"],
      ["Name", "Count", "Spend"],
      ...mockRequesters.map((r) => [r.name, r.count, r.spend]),
    ];

    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `reports-export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground mt-1">Manager insights and analytics</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={exportCSV}>
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="luxury-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Filter className="h-4 w-4" /> Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="grid gap-1">
            <label className="text-sm text-muted-foreground">Status</label>
            <Select value={status} onValueChange={(v: Status) => setStatus(v)}>
              <SelectTrigger>
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All</SelectItem>
                <SelectItem value="SUBMITTED">Submitted</SelectItem>
                <SelectItem value="DM_APPROVED">DM Approved</SelectItem>
                <SelectItem value="ACCT_APPROVED">Accounting Approved</SelectItem>
                <SelectItem value="FINAL_APPROVED">Final Approved</SelectItem>
                <SelectItem value="FUNDS_TRANSFERRED">Funds Transferred</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1">
            <label className="text-sm text-muted-foreground">From</label>
            <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div className="grid gap-1">
            <label className="text-sm text-muted-foreground">To</label>
            <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="luxury-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Submitted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.submitted}</div>
          </CardContent>
        </Card>
        <Card className="luxury-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.approved}</div>
          </CardContent>
        </Card>
        <Card className="luxury-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Spend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totals.spend.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="luxury-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <Percent className="h-4 w-4" /> Approval Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.approvalRate}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Volume by Month */}
        <Card className="lg:col-span-2 luxury-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-500" /> PR Volume by Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="w-full h-[320px]">
              <ReBarChart data={mockMonthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Bar dataKey="submitted" name="Submitted" fill="var(--color-submitted)" radius={4} />
                <Bar dataKey="approved" name="Approved" fill="var(--color-approved)" radius={4} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
              </ReBarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Approval Rate Donut */}
        <Card className="luxury-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-green-600 dark:text-green-500" /> Approval Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ approved: { label: "Approved", color: "hsl(142 70% 45%)" }, other: { label: "Others", color: "hsl(215 20% 65%)" } }} className="w-full h-[320px]">
              <RePieChart>
                <Pie
                  dataKey="value"
                  nameKey="name"
                  data={[{ name: "Approved", value: totals.approvalRate }, { name: "Others", value: 100 - totals.approvalRate }]}
                  innerRadius={60}
                  outerRadius={100}
                >
                  <Cell fill="var(--color-approved)" />
                  <Cell fill="var(--color-other)" />
                </Pie>
                <ChartLegend content={<ChartLegendContent />} />
                <ChartTooltip content={<ChartTooltipContent />} />
              </RePieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Spend by Category + Top Requesters */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="luxury-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-amber-600 dark:text-amber-400" /> Spend by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="w-full h-[320px]">
              <RePieChart>
                <Pie data={mockCategories.map((c, i) => ({ name: c.name, value: c.value, fill: categoryColors[i % categoryColors.length] }))} dataKey="value" nameKey="name" outerRadius={110}>
                  {mockCategories.map((_, i) => (
                    <Cell key={i} fill={categoryColors[i % categoryColors.length]} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent nameKey="name" />} />
              </RePieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="luxury-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" /> Top Requesters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-muted-foreground border-b">
                    <th className="py-2 text-left font-medium">Name</th>
                    <th className="py-2 text-right font-medium">Requests</th>
                    <th className="py-2 text-right font-medium">Total Spend</th>
                  </tr>
                </thead>
                <tbody>
                  {mockRequesters.map((r) => (
                    <tr key={r.name} className="border-b last:border-0 hover:bg-accent/40 transition-colors">
                      <td className="py-2">{r.name}</td>
                      <td className="py-2 text-right">{r.count}</td>
                      <td className="py-2 text-right">${r.spend.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
