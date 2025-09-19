// Purchase and Project Request Management System Types

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

export type RequestType = 'purchase' | 'project';

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string | null;
  department_id?: number | null;
  direct_manager_id?: number | null;
  position?: string;
  phone?: string;
  bio?: string;
  avatar?: string;
  avatar_url?: string;
  timezone?: string;
  date_format?: string;
  currency?: string;
  notification_preferences?: {
    email: boolean;
    push: boolean;
    sms: boolean;
    request_updates: boolean;
    approval_reminders: boolean;
    system_updates: boolean;
  };
  language_preference: string;
  created_at: string;
  updated_at: string;
  // Additional fields for frontend
  role?: UserRole;
  role_names?: string[]; // Role names array from backend
  teamId?: string;
  status?: 'active' | 'inactive';
  lastLoginAt?: Date;
  roles?: string[];
  permissions?: string[];
}

export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  department_id?: number;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

export interface Department {
  id: number;
  name: string;
  description?: string;
  code?: string;
  manager_id?: number;
  created_at: string;
  updated_at: string;
}

export interface DepartmentListResponse {
  data: Department[];
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: User;
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

// Base interface for both purchase and project requests
export interface BaseRequest {
  id: string;
  requesterId: string;
  requester?: User;
  title: string;
  description: string;
  type: RequestType;
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
  quotes: PRQuote[];
  approvals: Approval[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PurchaseRequest extends BaseRequest {
  type: 'purchase';
  items: PRItem[];
}

export interface ProjectRequest extends BaseRequest {
  type: 'project';
  clientName: string;
  projectDescription: string;
  totalCost: number;
  totalBenefit: number;
  totalPrice: number;
  items?: PRItem[]; // Make items optional for project requests
}

// Union type for handling both request types
export type Request = PurchaseRequest | ProjectRequest;

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  data?: unknown;
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
  meta?: unknown;
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
  // Project-specific stats
  totalProjects?: number;
  totalProjectValue?: number;
  totalProjectBenefit?: number;
  projectsCompletionRate?: number;
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
export interface BaseCreateRequestForm {
  type: RequestType;
  title: string;
  description: string;
  category: string;
  desiredCost: number;
  currency: Currency;
  neededByDate: Date;
}

export interface CreatePurchaseRequestForm extends BaseCreateRequestForm {
  type: 'purchase';
  items: Omit<PRItem, 'id' | 'total'>[];
}

export interface CreateProjectRequestForm extends BaseCreateRequestForm {
  type: 'project';
  clientName: string;
  projectDescription: string;
  totalCost: number;
  totalBenefit: number;
  totalPrice: number;
  items?: Omit<PRItem, 'id' | 'total'>[];
}

// Union type for handling form data
export type CreateRequestForm = CreatePurchaseRequestForm | CreateProjectRequestForm;

// For backward compatibility
export type CreatePRForm = CreatePurchaseRequestForm;

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
  type?: RequestType[];
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
    field: keyof BaseRequest;
    direction: 'asc' | 'desc';
  };
  page?: number;
  limit?: number;
}