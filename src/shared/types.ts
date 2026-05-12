// ============================================================================
// Learnova Admin Panel — Shared Type Definitions
// ============================================================================

// ---- User ----

export type UserRole = 'admin' | 'instructor' | 'student' | 'support' | 'finance';
export type UserStatus = 'active' | 'suspended' | 'banned' | 'pending';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  phone: string;
  country: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  violationCount: number;
}

// ---- Course ----

export type CourseStatus =
  | 'draft'
  | 'pending_review'
  | 'published'
  | 'unpublished'
  | 'rejected';

export interface Course {
  id: string;
  title: string;
  description: string;
  instructorId: string;
  instructorName: string;
  categoryId: string;
  categoryName: string;
  price: number;
  status: CourseStatus;
  enrolledCount: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

// ---- Category ----

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  courseCount: number;
  order: number;
  createdAt: string;
  parentId?: string;
  children?: Category[];
}

// ---- Instructor ----

export type InstructorStatus = 'approved' | 'pending' | 'rejected' | 'suspended';

export interface WithdrawalRequest {
  id: string;
  instructorId: string;
  amount: number;
  status: 'approved' | 'pending' | 'rejected';
  requestedAt: string;
  processedAt?: string;
  bankDetails?: string;
}

export interface Instructor {
  id: string;
  userId: string;
  name: string;
  email: string;
  bio: string;
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

// ---- Agent ----

export type AgentStatus = 'active' | 'suspended' | 'banned';

export interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  balance: number;
  totalRecharged: number;
  totalSpent: number;
  transactionCount: number;
  status: AgentStatus;
  createdAt: string;
}

// ---- Transaction ----

export type TransactionType = 'recharge' | 'purchase' | 'commission' | 'withdrawal';

export interface Transaction {
  id: string;
  agentId: string;
  type: TransactionType;
  amount: number;
  balanceAfter: number;
  description: string;
  createdAt: string;
  referenceId?: string;
}

// ---- Finance ----

export type FinancialRecordType = 'earning' | 'payout' | 'commission' | 'refund';
export type FinancialRecordStatus = 'completed' | 'pending' | 'failed';

export interface FinancialRecord {
  id: string;
  type: FinancialRecordType;
  amount: number;
  status: FinancialRecordStatus;
  description: string;
  createdAt: string;
  method?: string;
  referenceId?: string;
}

export interface FinanceSummary {
  totalEarnings: number;
  availableBalance: number;
  pendingPayouts: number;
  nextPayoutDate: string;
  monthlyGrowth: number;
  avgOrderValue: number;
  totalRefunds: number;
  platformFees: number;
}

// ---- Audit Log ----

export type AuditAction =
  | 'create'
  | 'update'
  | 'delete'
  | 'approve'
  | 'reject'
  | 'suspend'
  | 'login'
  | 'logout';

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: AuditAction;
  resource: string;
  resourceId?: string;
  details: string;
  previousState?: Record<string, unknown>;
  newState?: Record<string, unknown>;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
}

// ---- Dashboard ----

export interface MonthlyDataPoint {
  month: string;
  count: number;
}

export interface CategoryDistribution {
  name: string;
  value: number;
}

export type ActivityType =
  | 'course_published'
  | 'user_registered'
  | 'payment_received'
  | 'instructor_approved'
  | 'review_submitted'
  | 'system_update';

export interface ActivityFeedItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  user?: string;
}

export interface DashboardStats {
  totalCourses: number;
  totalRevenue: number;
  totalUsers: number;
  newUsersThisMonth: number;
  popularCategory: string;
  monthlySubscriptions: MonthlyDataPoint[];
  monthlyNewUsers: MonthlyDataPoint[];
  categoryDistribution: CategoryDistribution[];
  recentCourses: Course[];
  activityFeed: ActivityFeedItem[];
}

// ---- Common ----

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code: string;
  details?: string;
}
