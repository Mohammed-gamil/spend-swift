import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "@/stores/authStore";
import RoleGuard from "@/components/auth/RoleGuard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  Plus,
  Calendar,
  Building,
  MessageSquare
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { ar as arSA } from "date-fns/locale";
import { PurchaseRequest, PayoutChannel, UserRole } from "@/types";
import toast from "react-hot-toast";
import { useTranslation } from "@/hooks/use-translation";

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
  type: 'purchase',
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
  payoutReference: z.string().min(1, "prDetails.payoutReferenceRequired"),
  transferredAt: z.date(),
});

const quoteUploadSchema = z.object({
  vendorName: z.string().min(1, "prDetails.vendorNameRequired"),
  quoteTotal: z.number().positive("prDetails.quoteTotalPositive"),
});

type ApprovalFormData = z.infer<typeof approvalSchema>;
type FundsTransferFormData = z.infer<typeof fundsTransferSchema>;
type QuoteUploadFormData = z.infer<typeof quoteUploadSchema>;

const stateSteps = [
  'prDetails.stepDraft',
  'prDetails.stepSubmitted',
  'prDetails.stepManagerApproved',
  'prDetails.stepAccountantApproved',
  'prDetails.stepFinalApproved',
  'prDetails.stepFundsTransferred',
];
const rejectedStates = ["DM_REJECTED", "ACCT_REJECTED", "FINAL_REJECTED"];

export default function PRDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [showFundsDialog, setShowFundsDialog] = useState(false);
  const [showQuoteDialog, setShowQuoteDialog] = useState(false);
  const [quoteFiles, setQuoteFiles] = useState<File[]>([]);
  const { t, language } = useTranslation();

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
  
  const quoteForm = useForm<QuoteUploadFormData>({
    resolver: zodResolver(quoteUploadSchema),
    defaultValues: {
      vendorName: "",
      quoteTotal: 0,
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
    const locale = language === 'ar' ? 'ar-EG' : 'en-US';
    return new Intl.NumberFormat(locale, {
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
      toast.success(t('prDetails.toast.approvalSuccess'));
      setShowApprovalDialog(false);
      // In real app, this would update the PR state and navigate
    } catch (error) {
      toast.error(t('prDetails.toast.approvalError'));
    }
  };

  const handleFundsTransfer = async (data: FundsTransferFormData) => {
    try {
      console.log("Marking funds as transferred:", data);
      toast.success(t('prDetails.toast.fundsSuccess'));
      setShowFundsDialog(false);
    } catch (error) {
      toast.error(t('prDetails.toast.fundsError'));
    }
  };

  const downloadQuote = (quote: any) => {
    // In real app, this would download the file
    toast.success(t('prDetails.toast.downloadingQuote').replace('{vendor}', quote.vendorName));
  };
  
  const handleQuoteUpload = async (data: QuoteUploadFormData) => {
    try {
      if (quoteFiles.length === 0) {
        toast.error(t('prDetails.toast.noQuoteFiles'));
        return;
      }
      
      // Get the first file (since we only allow one)
      const file = quoteFiles[0];
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(t('prDetails.toast.fileTooLarge'));
        return;
      }
      
      console.log("Uploading quote:", {
        ...data,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      });
      
      // In a real app, this would be an API call to upload the file and create the quote
      // For demo, we'll just show success and close the dialog
      toast.success(t('prDetails.toast.quoteUploadSuccess').replace('{vendor}', data.vendorName));
      
      // Reset form and close dialog
      quoteForm.reset();
      setQuoteFiles([]);
      setShowQuoteDialog(false);
    } catch (error) {
      toast.error(t('common.errorOccurred'));
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/prs")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('prDetails.backToPRs')}
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{mockPR.title}</h1>
              <Badge className={getStateColor(mockPR.state)}>
                {t((`status.${mockPR.state}`) as any)}
              </Badge>
            </div>
            <p className="text-gray-600 mt-1">{t('prDetails.prNumber')}{mockPR.id}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <RoleGuard allowedRoles={['DIRECT_MANAGER', 'ACCOUNTANT', 'FINAL_MANAGER']}>
            {canApprove() && (
              <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {t('prDetails.review')}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t('prDetails.reviewDialogTitle')}</DialogTitle>
                    <DialogDescription>
                      {t('prDetails.reviewDialogDescription')}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={approvalForm.handleSubmit(handleApproval)} className="space-y-4">
                    <div className="space-y-2">
                      <Label>{t('prDetails.decision')}</Label>
                      <Select onValueChange={(value: "APPROVED" | "REJECTED") => approvalForm.setValue("decision", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder={t('prDetails.selectDecision')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="APPROVED">{t('prDetails.approve')}</SelectItem>
                          <SelectItem value="REJECTED">{t('prDetails.reject')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {user?.role === 'ACCOUNTANT' && approvalForm.watch("decision") === "APPROVED" && (
                      <div className="space-y-2">
                        <Label>{t('prDetails.payoutChannel')}</Label>
                        <Select onValueChange={(value: PayoutChannel) => approvalForm.setValue("payoutChannel", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder={t('prDetails.selectPayoutChannel')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="WALLET">{t('prDetails.payoutWallet')}</SelectItem>
                            <SelectItem value="COMPANY">{t('prDetails.payoutCompany')}</SelectItem>
                            <SelectItem value="COURIER">{t('prDetails.payoutCourier')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label>{approvalForm.watch("decision") === "REJECTED" ? t('prDetails.commentRequired') : t('prDetails.comment')}</Label>
                      <Textarea
                        placeholder={t('prDetails.commentPlaceholder')}
                        {...approvalForm.register("comment")}
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setShowApprovalDialog(false)}>
                        {t('common.cancel')}
                      </Button>
                      <Button type="submit">
                        {t('prDetails.submitDecision')}
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
                    {t('prDetails.markFundsTransferred')}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t('prDetails.fundsDialogTitle')}</DialogTitle>
                    <DialogDescription>
                      {t('prDetails.fundsDialogDescription')}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={fundsForm.handleSubmit(handleFundsTransfer)} className="space-y-4">
                    <div className="space-y-2">
                      <Label>{t('prDetails.payoutReference')}</Label>
                      <input
                        type="text"
                        placeholder={t('prDetails.payoutReferencePlaceholder')}
                        {...fundsForm.register("payoutReference")}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>{t('prDetails.transferDate')}</Label>
                      <input
                        type="date"
                        {...fundsForm.register("transferredAt", { valueAsDate: true })}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setShowFundsDialog(false)}>
                        {t('common.cancel')}
                      </Button>
                      <Button type="submit">
                        {t('prDetails.markAsTransferred')}
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
            steps={stateSteps.map((k) => t(k as any))} 
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
              <TabsTrigger value="overview">{t('prDetails.tabOverview')}</TabsTrigger>
              <TabsTrigger value="items">{t('prDetails.tabItems')}</TabsTrigger>
              <TabsTrigger value="quotes">{t('prDetails.tabQuotes')}</TabsTrigger>
              <TabsTrigger value="approvals">{t('prDetails.tabApprovals')}</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{t('prDetails.requestDetails')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="font-medium text-sm text-gray-500">{t('prDetails.category')}</h4>
                      <p>{mockPR.category}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-gray-500">{t('prDetails.estimatedCost')}</h4>
                      <p className="text-lg font-semibold">
                        {formatCurrency(mockPR.desiredCost, mockPR.currency)}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-gray-500">{t('prDetails.neededBy')}</h4>
                      <p>{format(mockPR.neededByDate, "PPP", { locale: language === 'ar' ? arSA : undefined })}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-gray-500">{t('prDetails.created')}</h4>
                      <p>{formatDistanceToNow(mockPR.createdAt, { addSuffix: true, locale: language === 'ar' ? arSA : undefined })}</p>
                    </div>
                  </div>

                  {mockPR.description && (
                    <div>
                      <h4 className="font-medium text-sm text-gray-500 mb-2">{t('prDetails.description')}</h4>
                      <p className="text-gray-700">{mockPR.description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="items" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{t('prDetails.itemsCount').replace('{count}', String(mockPR.items.length))}</CardTitle>
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
                          <div>{t('prDetails.quantity')}: {item.quantity}</div>
                          <div>{t('prDetails.unitPrice')}: {formatCurrency(item.unitPrice, mockPR.currency)}</div>
                          {item.vendorHint && <div>{t('prDetails.vendorHint')}: {item.vendorHint}</div>}
                        </div>
                      </div>
                    ))}
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center font-bold">
                        <span>{t('prDetails.total')}</span>
                        <span>{formatCurrency(mockPR.items.reduce((sum, item) => sum + item.total, 0), mockPR.currency)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="quotes" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>{t('prDetails.quotesCount').replace('{count}', String(mockPR.quotes.length))}</CardTitle>
                  <RoleGuard allowedRoles={['ACCOUNTANT', 'ADMIN']}>
                    <Button size="sm" onClick={() => setShowQuoteDialog(true)}>
                      <Plus className="h-4 w-4 mr-1" />
                      {t('prDetails.uploadQuote')}
                    </Button>
                  </RoleGuard>
                </CardHeader>
                <CardContent>
                  {mockPR.quotes.length > 0 ? (
                    <div className="space-y-4">
                      {mockPR.quotes.map((quote) => (
                        <div key={quote.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-medium">{quote.vendorName}</h4>
                            <p className="text-sm text-gray-600">
                              {t('prDetails.total')}: {formatCurrency(quote.quoteTotal, mockPR.currency)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {t('prDetails.uploaded')} {formatDistanceToNow(quote.uploadedAt, { addSuffix: true, locale: language === 'ar' ? arSA : undefined })}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => downloadQuote(quote)}>
                              <Eye className="h-4 w-4 mr-1" />
                              {t('prDetails.view')}
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => downloadQuote(quote)}>
                              <Download className="h-4 w-4 mr-1" />
                              {t('prDetails.download')}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div>
                      <p className="text-gray-500 text-center py-4">{t('prDetails.noQuotes')}</p>
                      <RoleGuard allowedRoles={['ACCOUNTANT', 'ADMIN']}>
                        <div className="flex justify-center py-4">
                          <Button variant="outline" onClick={() => setShowQuoteDialog(true)}>
                            <Plus className="h-4 w-4 mr-1" />
                            {t('prDetails.uploadQuote')}
                          </Button>
                        </div>
                      </RoleGuard>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="approvals" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{t('prDetails.approvalHistory')}</CardTitle>
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
                              {t('prDetails.stageApproval').replace('{stage}', t((`prDetails.stage.${approval.stage}`) as any))}
                            </Badge>
                            <Badge 
                              className={
                                approval.decision === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                approval.decision === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }
                            >
                              {t((`status.${approval.decision}`) as any)}
                            </Badge>
                          </div>
                          {approval.comment && (
                            <p className="text-sm text-gray-600 mb-2">{approval.comment}</p>
                          )}
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            {approval.decidedAt 
                              ? `${t('prDetails.decided')} ${formatDistanceToNow(approval.decidedAt, { addSuffix: true, locale: language === 'ar' ? arSA : undefined })}`
                              : `${t('prDetails.pendingSince')} ${formatDistanceToNow(approval.createdAt, { addSuffix: true, locale: language === 'ar' ? arSA : undefined })}`
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
                {t('prDetails.requester')}
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
                    {t((`roles.${mockPR.requester?.role}`) as any)}
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
                  {t('prDetails.currentApprover')}
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
                      {t((`roles.${mockPR.currentApprover.role}`) as any)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>{t('prDetails.quickActions')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                {t('prDetails.exportPdf')}
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="mr-2 h-4 w-4" />
                {t('prDetails.addComment')}
              </Button>
              <RoleGuard allowedRoles={['USER']}>
                {mockPR.state === 'DRAFT' && (
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href={`/prs/${mockPR.id}/edit`}>
                      <FileText className="mr-2 h-4 w-4" />
                      {t('prDetails.editRequest')}
                    </a>
                  </Button>
                )}
              </RoleGuard>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Upload Quote Dialog */}
      <Dialog open={showQuoteDialog} onOpenChange={setShowQuoteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('prDetails.uploadQuoteDialogTitle')}</DialogTitle>
            <DialogDescription>
              {t('prDetails.uploadQuoteDialogDescription')}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={quoteForm.handleSubmit(handleQuoteUpload)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="vendorName">{t('prDetails.vendorName')}</Label>
              <Input
                id="vendorName"
                placeholder={t('prDetails.vendorNamePlaceholder')}
                {...quoteForm.register("vendorName")}
              />
              {quoteForm.formState.errors.vendorName && (
                <p className="text-sm text-red-500">{quoteForm.formState.errors.vendorName.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quoteTotal">{t('prDetails.quoteTotal')}</Label>
              <Input
                id="quoteTotal"
                type="number"
                step="0.01"
                {...quoteForm.register("quoteTotal", { valueAsNumber: true })}
              />
              {quoteForm.formState.errors.quoteTotal && (
                <p className="text-sm text-red-500">{quoteForm.formState.errors.quoteTotal.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quoteFile">{t('prCreate.uploadQuotesTitle')}</Label>
              <Input 
                id="quoteFile"
                type="file" 
                accept="application/pdf,image/jpeg,image/png"
                onChange={(e) => {
                  const files = e.target.files;
                  if (files && files.length > 0) {
                    setQuoteFiles(Array.from(files));
                  } else {
                    setQuoteFiles([]);
                  }
                }}
              />
              <p className="text-xs text-muted-foreground">
                {t('prCreate.supportedFormats')}: PDF, JPEG, PNG (5MB max)
              </p>
            </div>
            
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setShowQuoteDialog(false)}>
                {t('common.cancel')}
              </Button>
              <Button type="submit">
                {t('prDetails.submitQuote')}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
