import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "@/stores/authStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Stepper } from "@/components/ui/stepper";
import { 
  ArrowLeft, 
  FileText, 
  Clock, 
  User, 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  Download,
  Eye,
  Calendar,
  Building,
  MessageSquare
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { PurchaseRequest, PayoutChannel, UserRole } from "@/types";
import RoleGuard from "@/components/auth/RoleGuard";
import toast from "react-hot-toast";

// Mock data - in real app this would come from API
const mockPR: PurchaseRequest = {
  id: "PR-2024-001",
  requesterId: "2",
  requester: { id: "2", name: "Sarah Ahmed", email: "sarah@company.com", role: "USER", status: "active" },
  title: "New MacBook Pro for Development Team",
  description: "Urgent requirement for M3 MacBook Pro to replace aging development machine. The current laptop is experiencing frequent crashes and performance issues that are impacting productivity.",
  category: "IT Equipment",
  desiredCost: 2499,
  currency: "USD",
  neededByDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  state: "SUBMITTED",
  currentApproverId: "1",
  currentApprover: { id: "1", name: "Ahmed Hassan", email: "ahmed@company.com", role: "DIRECT_MANAGER", status: "active" },
  items: [
    { id: "1", name: "MacBook Pro M3 14-inch", quantity: 1, unitPrice: 2499, total: 2499, vendorHint: "Apple Store or authorized reseller" }
  ],
  quotes: [
    { id: "1", vendorName: "Apple Store", quoteTotal: 2499, filePath: "/quotes/apple-quote.pdf", uploadedAt: new Date() },
    { id: "2", vendorName: "Best Buy", quoteTotal: 2450, filePath: "/quotes/bestbuy-quote.pdf", uploadedAt: new Date() }
  ],
  approvals: [
    {
      id: "1",
      stage: "DM",
      approverId: "1",
      approver: { id: "1", name: "Ahmed Hassan", email: "ahmed@company.com", role: "DIRECT_MANAGER", status: "active" },
      decision: "PENDING",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
    }
  ],
  createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
};

const approvalSchema = z.object({
  decision: z.enum(["APPROVED", "REJECTED"]),
  comment: z.string().optional(),
  payoutChannel: z.enum(["WALLET", "COMPANY", "COURIER"]).optional(),
});

const fundsTransferSchema = z.object({
  payoutReference: z.string().min(1, "Reference is required"),
  transferredAt: z.date(),
});

type ApprovalFormData = z.infer<typeof approvalSchema>;
type FundsTransferFormData = z.infer<typeof fundsTransferSchema>;

const stateSteps = ["Draft", "Submitted", "Manager Approved", "Accountant Approved", "Final Approved", "Funds Transferred"];
const rejectedStates = ["DM_REJECTED", "ACCT_REJECTED", "FINAL_REJECTED"];

export default function PRDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [showFundsDialog, setShowFundsDialog] = useState(false);

  const approvalForm = useForm<ApprovalFormData>({
    resolver: zodResolver(approvalSchema),
    defaultValues: {
      decision: "APPROVED",
      comment: "",
    },
  });

  const fundsForm = useForm<FundsTransferFormData>({
    resolver: zodResolver(fundsTransferSchema),
    defaultValues: {
      payoutReference: "",
      transferredAt: new Date(),
    },
  });

  const getStateColor = (state: string) => {
    if (rejectedStates.includes(state)) return "bg-red-100 text-red-800";
    switch (state) {
      case 'DRAFT': return 'bg-gray-100 text-gray-800';
      case 'SUBMITTED': return 'bg-blue-100 text-blue-800';
      case 'DM_APPROVED': return 'bg-green-100 text-green-800';
      case 'ACCT_APPROVED': return 'bg-purple-100 text-purple-800';
      case 'FINAL_APPROVED': return 'bg-emerald-100 text-emerald-800';
      case 'FUNDS_TRANSFERRED': return 'bg-cyan-100 text-cyan-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCurrentStepIndex = (state: string) => {
    switch (state) {
      case 'DRAFT': return 0;
      case 'SUBMITTED': return 1;
      case 'DM_APPROVED': return 2;
      case 'ACCT_APPROVED': return 3;
      case 'FINAL_APPROVED': return 4;
      case 'FUNDS_TRANSFERRED': return 5;
      default: return 1;
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const canApprove = () => {
    if (!user) return false;
    return mockPR.currentApproverId === user.id;
  };

  const canMarkFundsTransferred = () => {
    if (!user) return false;
    return user.role === 'ACCOUNTANT' && mockPR.state === 'FINAL_APPROVED';
  };

  const handleApproval = async (data: ApprovalFormData) => {
    try {
      console.log("Submitting approval:", data);
      toast.success(`PR ${data.decision.toLowerCase()} successfully`);
      setShowApprovalDialog(false);
      // In real app, this would update the PR state and navigate
    } catch (error) {
      toast.error("Failed to process approval");
    }
  };

  const handleFundsTransfer = async (data: FundsTransferFormData) => {
    try {
      console.log("Marking funds as transferred:", data);
      toast.success("Funds marked as transferred successfully");
      setShowFundsDialog(false);
    } catch (error) {
      toast.error("Failed to mark funds as transferred");
    }
  };

  const downloadQuote = (quote: any) => {
    // In real app, this would download the file
    toast.success(`Downloading ${quote.vendorName} quote`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/prs")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to PRs
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{mockPR.title}</h1>
              <Badge className={getStateColor(mockPR.state)}>
                {mockPR.state.replace('_', ' ')}
              </Badge>
            </div>
            <p className="text-gray-600 mt-1">PR #{mockPR.id}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <RoleGuard allowedRoles={['DIRECT_MANAGER', 'ACCOUNTANT', 'FINAL_MANAGER']}>
            {canApprove() && (
              <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Review
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Review Purchase Request</DialogTitle>
                    <DialogDescription>
                      Please review and make a decision on this purchase request.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={approvalForm.handleSubmit(handleApproval)} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Decision</Label>
                      <Select onValueChange={(value: "APPROVED" | "REJECTED") => approvalForm.setValue("decision", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select decision" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="APPROVED">Approve</SelectItem>
                          <SelectItem value="REJECTED">Reject</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {user?.role === 'ACCOUNTANT' && approvalForm.watch("decision") === "APPROVED" && (
                      <div className="space-y-2">
                        <Label>Payout Channel</Label>
                        <Select onValueChange={(value: PayoutChannel) => approvalForm.setValue("payoutChannel", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select payout channel" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="WALLET">Digital Wallet</SelectItem>
                            <SelectItem value="COMPANY">Company Account</SelectItem>
                            <SelectItem value="COURIER">Cash on Delivery</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label>Comment {approvalForm.watch("decision") === "REJECTED" && "*"}</Label>
                      <Textarea
                        placeholder="Add your comments..."
                        {...approvalForm.register("comment")}
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setShowApprovalDialog(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">
                        Submit Decision
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </RoleGuard>

          <RoleGuard allowedRoles={['ACCOUNTANT']}>
            {canMarkFundsTransferred() && (
              <Dialog open={showFundsDialog} onOpenChange={setShowFundsDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Mark Funds Transferred
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Mark Funds as Transferred</DialogTitle>
                    <DialogDescription>
                      Confirm that the funds have been transferred for this purchase request.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={fundsForm.handleSubmit(handleFundsTransfer)} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Payout Reference *</Label>
                      <input
                        type="text"
                        placeholder="Enter transaction reference"
                        {...fundsForm.register("payoutReference")}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Transfer Date *</Label>
                      <input
                        type="date"
                        {...fundsForm.register("transferredAt", { valueAsDate: true })}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setShowFundsDialog(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">
                        Mark as Transferred
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </RoleGuard>
        </div>
      </div>

      {/* Status Stepper */}
      <Card>
        <CardContent className="pt-6">
          <Stepper 
            steps={stateSteps} 
            currentStep={getCurrentStepIndex(mockPR.state)} 
          />
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Details */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="items">Items</TabsTrigger>
              <TabsTrigger value="quotes">Quotes</TabsTrigger>
              <TabsTrigger value="approvals">Approvals</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Request Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="font-medium text-sm text-gray-500">Category</h4>
                      <p>{mockPR.category}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-gray-500">Estimated Cost</h4>
                      <p className="text-lg font-semibold">
                        {formatCurrency(mockPR.desiredCost, mockPR.currency)}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-gray-500">Needed By</h4>
                      <p>{format(mockPR.neededByDate, "PPP")}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-gray-500">Created</h4>
                      <p>{formatDistanceToNow(mockPR.createdAt, { addSuffix: true })}</p>
                    </div>
                  </div>

                  {mockPR.description && (
                    <div>
                      <h4 className="font-medium text-sm text-gray-500 mb-2">Description</h4>
                      <p className="text-gray-700">{mockPR.description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="items" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Items ({mockPR.items.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockPR.items.map((item) => (
                      <div key={item.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{item.name}</h4>
                          <span className="font-semibold">
                            {formatCurrency(item.total, mockPR.currency)}
                          </span>
                        </div>
                        <div className="grid gap-2 md:grid-cols-3 text-sm text-gray-600">
                          <div>Quantity: {item.quantity}</div>
                          <div>Unit Price: {formatCurrency(item.unitPrice, mockPR.currency)}</div>
                          {item.vendorHint && <div>Vendor Hint: {item.vendorHint}</div>}
                        </div>
                      </div>
                    ))}
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center font-bold">
                        <span>Total</span>
                        <span>{formatCurrency(mockPR.items.reduce((sum, item) => sum + item.total, 0), mockPR.currency)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="quotes" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Vendor Quotes ({mockPR.quotes.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {mockPR.quotes.length > 0 ? (
                    <div className="space-y-4">
                      {mockPR.quotes.map((quote) => (
                        <div key={quote.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-medium">{quote.vendorName}</h4>
                            <p className="text-sm text-gray-600">
                              Total: {formatCurrency(quote.quoteTotal, mockPR.currency)}
                            </p>
                            <p className="text-xs text-gray-500">
                              Uploaded {formatDistanceToNow(quote.uploadedAt, { addSuffix: true })}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => downloadQuote(quote)}>
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => downloadQuote(quote)}>
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">No quotes uploaded yet</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="approvals" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Approval History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockPR.approvals.map((approval) => (
                      <div key={approval.id} className="flex items-start gap-3 p-4 border rounded-lg">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={approval.approver?.avatar} />
                          <AvatarFallback>
                            {approval.approver?.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{approval.approver?.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {approval.stage} Approval
                            </Badge>
                            <Badge 
                              className={
                                approval.decision === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                approval.decision === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }
                            >
                              {approval.decision}
                            </Badge>
                          </div>
                          {approval.comment && (
                            <p className="text-sm text-gray-600 mb-2">{approval.comment}</p>
                          )}
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            {approval.decidedAt 
                              ? `Decided ${formatDistanceToNow(approval.decidedAt, { addSuffix: true })}`
                              : `Pending since ${formatDistanceToNow(approval.createdAt, { addSuffix: true })}`
                            }
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Requester Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Requester
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={mockPR.requester?.avatar} />
                  <AvatarFallback>
                    {mockPR.requester?.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{mockPR.requester?.name}</p>
                  <p className="text-sm text-gray-600">{mockPR.requester?.email}</p>
                  <Badge variant="outline" className="text-xs mt-1">
                    {mockPR.requester?.role}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Approver */}
          {mockPR.currentApprover && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Current Approver
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={mockPR.currentApprover.avatar} />
                    <AvatarFallback>
                      {mockPR.currentApprover.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{mockPR.currentApprover.name}</p>
                    <p className="text-sm text-gray-600">{mockPR.currentApprover.email}</p>
                    <Badge variant="outline" className="text-xs mt-1">
                      {mockPR.currentApprover.role}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="mr-2 h-4 w-4" />
                Add Comment
              </Button>
              <RoleGuard allowedRoles={['USER']}>
                {mockPR.state === 'DRAFT' && (
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href={`/prs/${mockPR.id}/edit`}>
                      <FileText className="mr-2 h-4 w-4" />
                      Edit Request
                    </a>
                  </Button>
                )}
              </RoleGuard>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
