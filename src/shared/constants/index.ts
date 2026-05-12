import type { NavItem, UserRole } from '@/shared/types';

export const APP_NAME = 'Learnova';
export const APP_VERSION = '1.0.0';
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export const SIDEBAR_WIDTH = 260;
export const SIDEBAR_COLLAPSED_WIDTH = 72;
export const TOPBAR_HEIGHT = 64;

export const PAGE_SIZES = [10, 20, 50, 100] as const;
export const DEFAULT_PAGE_SIZE = 20;

export const USER_ROLES: { value: UserRole; label: string; description: string }[] = [
  { value: 'super_admin', label: 'Super Admin', description: 'Full system access with all permissions' },
  { value: 'admin', label: 'Admin', description: 'Administrative access with most permissions' },
  { value: 'support', label: 'Support', description: 'Customer support and user management' },
  { value: 'finance', label: 'Finance', description: 'Financial data and payout management' },
];

export const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { id: 'users', label: 'Users', icon: 'Users', permission: 'users.read' },
  { id: 'instructors', label: 'Instructors', icon: 'GraduationCap', permission: 'instructors.read' },
  { id: 'courses', label: 'Courses', icon: 'BookOpen', permission: 'courses.read' },
  { id: 'agents', label: 'Agents & POS', icon: 'Store', permission: 'agents.read' },
  { id: 'categories', label: 'Categories', icon: 'FolderTree', permission: 'categories.read' },
  { id: 'finance', label: 'Finance', icon: 'Wallet', permission: 'finance.read', roles: ['super_admin', 'admin', 'finance'] },
  { id: 'audit-logs', label: 'Audit Log', icon: 'ScrollText', permission: 'audit.read' },
  { id: 'settings', label: 'Settings', icon: 'Settings', permission: 'settings.read', roles: ['super_admin', 'admin'] },
];

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  super_admin: ['*'],
  admin: ['users.read', 'users.update', 'users.suspend', 'courses.read', 'courses.approve', 'courses.delete', 'instructors.read', 'instructors.review', 'agents.read', 'agents.manage', 'categories.read', 'categories.manage', 'finance.read', 'audit.read', 'settings.read', 'settings.update'],
  support: ['users.read', 'users.update', 'courses.read', 'instructors.read', 'audit.read'],
  finance: ['finance.read', 'finance.manage', 'users.read', 'audit.read'],
};

export const STATUS_COLORS: Record<string, string> = {
  active: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  published: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  approved: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  completed: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  pending: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  pending_review: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  draft: 'bg-slate-500/15 text-slate-400 border-slate-500/20',
  unpublished: 'bg-slate-500/15 text-slate-400 border-slate-500/20',
  suspended: 'bg-red-500/15 text-red-400 border-red-500/20',
  rejected: 'bg-red-500/15 text-red-400 border-red-500/20',
  banned: 'bg-red-500/15 text-red-400 border-red-500/20',
  failed: 'bg-red-500/15 text-red-400 border-red-500/20',
  refunded: 'bg-orange-500/15 text-orange-400 border-orange-500/20',
};

export const CURRENCY = 'USD';
export const CURRENCY_SYMBOL = '$';

export const CHART_COLORS = ['#4F46E5', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6366F1'];
