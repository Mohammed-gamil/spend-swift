// Purchase Request Management System Types

export type UserRole = 'USER' | 'DIRECT_MANAGER' | 'ACCOUNTANT' | 'FINAL_MANAGER' | 'ADMIN';

export type PRState = 
  | 'DRAFT'
  | 'SUBMITTED'
  | 'DM_APPROVED'
  | 'DM_REJECTED'
  | 'ACCT_APPROVED'
  | 'ACCT_REJECTED'
  | 'FINAL_APPROVED'
  | 'FINAL_REJECTED'
  | 'FUNDS_TRANSFERRED';

export type PayoutChannel = 'WALLET' | 'COMPANY' | 'COURIER';

export type Currency = 'EGP' | 'SAR' | 'USD' | 'EUR' | 'GBP' | 'AED';

export type ApprovalStage = 'DM' | 'ACCT' | 'FINAL';

export type Decision = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  teamId?: string;
  status: 'active' | 'inactive';
  avatar?: string;
}

export interface Team {
  id: string;
  name: string;
  managerId: string;
  manager?: User;
}

export interface PRItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  vendorHint?: string;
  total: number;
}

export interface PRQuote {
  id: string;
  vendorName: string;
  quoteTotal: number;
  filePath: string;
  notes?: string;
  uploadedAt: Date;
}

export interface Approval {
  id: string;
  stage: ApprovalStage;
  approverId: string;
  approver?: User;
  decision: Decision;
  comment?: string;
  decidedAt?: Date;
  createdAt: Date;
}

export interface PurchaseRequest {
  id: string;
  requesterId: string;
  requester?: User;
  title: string;
  description: string;
  category: string;
  desiredCost: number;
  currency: Currency;
  neededByDate: Date;
  state: PRState;
  currentApproverId?: string;
  currentApprover?: User;
  payoutChannel?: PayoutChannel;
  payoutReference?: string;
  fundsTransferredAt?: Date;
  items: PRItem[];
  quotes: PRQuote[];
  approvals: Approval[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  data?: any;
  readAt?: Date;
  createdAt: Date;
}

export interface AuditLog {
  id: string;
  userId?: string;
  user?: User;
  action: string;
  entityType: string;
  entityId: string;
  meta?: any;
  ip?: string;
  userAgent?: string;
  createdAt: Date;
}

export interface Budget {
  id: string;
  teamId: string;
  team?: Team;
  fiscalYear: number;
  cap: number;
  consumed: number;
  remaining: number;
  utilizationPercentage: number;
}

export interface DashboardStats {
  totalPRs: number;
  pendingApprovals: number;
  approvedThisMonth: number;
  averageApprovalTime: number;
  budgetUtilization: number;
  recentActivity: AuditLog[];
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
  error?: {
    code: number;
    message: string;
    details?: string[];
  };
}

// Form Types
export interface CreatePRForm {
  title: string;
  description: string;
  category: string;
  desiredCost: number;
  currency: Currency;
  neededByDate: Date;
  items: Omit<PRItem, 'id' | 'total'>[];
}

export interface ApprovalForm {
  decision: 'APPROVED' | 'REJECTED';
  comment?: string;
  payoutChannel?: PayoutChannel;
}

export interface FundsTransferForm {
  payoutReference: string;
  transferredAt: Date;
}

// Filter and Search Types
export interface PRFilters {
  state?: PRState[];
  requesterId?: string;
  teamId?: string;
  currentApproverId?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  amountRange?: {
    min: number;
    max: number;
  };
}

export interface PRSearchParams {
  search?: string;
  filters?: PRFilters;
  sort?: {
    field: keyof PurchaseRequest;
    direction: 'asc' | 'desc';
  };
  page?: number;
  limit?: number;
}