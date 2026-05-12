// Auth types
export type UserRole = 'super_admin' | 'admin' | 'support' | 'finance';
export type UserStatus = 'active' | 'suspended' | 'pending' | 'banned';
export type CourseStatus = 'draft' | 'pending_review' | 'published' | 'unpublished' | 'rejected';
export type InstructorStatus = 'pending' | 'approved' | 'rejected' | 'suspended';
export type PaymentStatus = 'completed' | 'pending' | 'failed' | 'refunded';
export type AuditAction = 'create' | 'update' | 'delete' | 'login' | 'logout' | 'approve' | 'reject' | 'suspend' | 'activate';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  phone?: string;
  country?: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  violationCount: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructorId: string;
  instructorName: string;
  categoryId: string;
  categoryName: string;
  thumbnail?: string;
  price: number;
  status: CourseStatus;
  enrolledCount: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface Instructor {
  id: string;
  userId: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  specialization: string;
  status: InstructorStatus;
  commissionRate: number;
  totalEarnings: number;
  courseCount: number;
  studentCount: number;
  rating: number;
  appliedAt: string;
  reviewedAt?: string;
  withdrawalRequests: WithdrawalRequest[];
}

export interface WithdrawalRequest {
  id: string;
  instructorId: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
  processedAt?: string;
  bankDetails: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  parentId?: string;
  courseCount: number;
  order: number;
  createdAt: string;
  children?: Category[];
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  balance: number;
  totalRecharged: number;
  totalSpent: number;
  transactionCount: number;
  status: 'active' | 'suspended';
  createdAt: string;
}

export interface Transaction {
  id: string;
  agentId: string;
  type: 'recharge' | 'purchase' | 'withdrawal' | 'commission';
  amount: number;
  balanceAfter: number;
  description: string;
  createdAt: string;
  referenceId?: string;
}

export interface FinancialRecord {
  id: string;
  type: 'earning' | 'payout' | 'refund' | 'commission';
  amount: number;
  status: PaymentStatus;
  description: string;
  createdAt: string;
  referenceId?: string;
  method?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: AuditAction;
  resource: string;
  resourceId?: string;
  details?: string;
  previousState?: Record<string, unknown>;
  newState?: Record<string, unknown>;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
}

export interface DashboardStats {
  totalCourses: number;
  totalRevenue: number;
  totalUsers: number;
  newUsersThisMonth: number;
  popularCategory: string;
  monthlySubscriptions: { month: string; count: number }[];
  monthlyNewUsers: { month: string; count: number }[];
  categoryDistribution: { name: string; value: number }[];
  recentCourses: Course[];
  activityFeed: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: 'course_published' | 'user_registered' | 'instructor_approved' | 'payment_received' | 'review_submitted' | 'system_update';
  title: string;
  description: string;
  timestamp: string;
  user?: string;
  icon?: string;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface ResetPasswordPayload {
  email: string;
  otp: string;
  newPassword: string;
}

// Permissions
export interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
}

export interface Role {
  id: string;
  name: UserRole;
  displayName: string;
  description: string;
  permissions: Permission[];
}

// Settings
export interface SystemSettings {
  general: GeneralSettings;
  security: SecuritySettings;
  notifications: NotificationSettings;
  payments: PaymentSettings;
}

export interface GeneralSettings {
  siteName: string;
  siteDescription: string;
  logoUrl: string;
  faviconUrl: string;
  contactEmail: string;
  supportPhone: string;
  maintenanceMode: boolean;
}

export interface SecuritySettings {
  maxLoginAttempts: number;
  passwordMinLength: number;
  passwordRequireUppercase: boolean;
  passwordRequireNumbers: boolean;
  passwordRequireSymbols: boolean;
  sessionTimeout: number;
  twoFactorRequired: boolean;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  newCourseAlert: boolean;
  newUserAlert: boolean;
  withdrawalRequestAlert: boolean;
  systemAlerts: boolean;
}

export interface PaymentSettings {
  currency: string;
  taxRate: number;
  minWithdrawalAmount: number;
  payoutSchedule: 'weekly' | 'biweekly' | 'monthly';
  enabledMethods: string[];
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Navigation
export type NavigationPage =
  | 'dashboard'
  | 'users'
  | 'instructors'
  | 'courses'
  | 'agents'
  | 'categories'
  | 'finance'
  | 'settings'
  | 'audit-logs'
  | 'auth'
  | 'not-found'
  | 'unauthorized';

export interface NavItem {
  id: NavigationPage;
  label: string;
  icon: string;
  badge?: number;
  permission?: string;
  roles?: UserRole[];
}
