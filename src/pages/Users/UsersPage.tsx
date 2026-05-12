'use client';

import { useState, useMemo } from 'react';
import { mockUsers } from '@/shared/mocks';
import type { User, UserRole, UserStatus } from '@/shared/types';
import { formatDateTime, getInitials } from '@/shared/lib';
import { STATUS_COLORS, USER_ROLES } from '@/shared/constants';
import { motion, AnimatePresence } from 'framer-motion';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import {
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Ban,
  CheckCircle,
  Shield,
  UserCog,
  Mail,
  Plus,
  ChevronLeft,
  ChevronRight,
  Users as UsersIcon,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Constants local to this page
// ---------------------------------------------------------------------------

const PAGE_SIZE = 10;

const ALL_ROLES: { value: UserRole; label: string }[] = [
  { value: 'admin', label: 'Admin' },
  { value: 'instructor', label: 'Instructor' },
  { value: 'student', label: 'Student' },
  { value: 'support', label: 'Support' },
  { value: 'finance', label: 'Finance' },
];

const ALL_STATUSES: { value: UserStatus; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'suspended', label: 'Suspended' },
  { value: 'banned', label: 'Banned' },
  { value: 'pending', label: 'Pending' },
];

const ROLE_VARIANT: Record<UserRole, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  admin: 'destructive',
  instructor: 'default',
  student: 'secondary',
  support: 'outline',
  finance: 'outline',
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getRoleBadgeClass(role: UserRole): string {
  const map: Record<UserRole, string> = {
    admin: 'bg-violet-500/15 text-violet-400 border-violet-500/20',
    instructor: 'bg-sky-500/15 text-sky-400 border-sky-500/20',
    student: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    support: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    finance: 'bg-orange-500/15 text-orange-400 border-orange-500/20',
  };
  return map[role] ?? 'bg-slate-500/15 text-slate-400 border-slate-500/20';
}

function getRoleLabel(role: UserRole): string {
  return ALL_ROLES.find((r) => r.value === role)?.label ?? role;
}

// ---------------------------------------------------------------------------
// Row animation
// ---------------------------------------------------------------------------

const rowVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.03, duration: 0.3, ease: 'easeOut' },
  }),
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

// ---------------------------------------------------------------------------
// Stat card
// ---------------------------------------------------------------------------

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <Card className="bg-card border-border/50">
      <CardContent className="p-4 flex items-center gap-3">
        <div className={`rounded-lg p-2.5 ${color}`}>
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-xl font-semibold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function UsersPage() {
  // ---- State ----
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Dialog state
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', phone: '' });

  // Role change dialog
  const [roleChangeUser, setRoleChangeUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<UserRole>('student');

  // Toast-like feedback (simple state flag)
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // ---- Derived data ----
  const stats = useMemo(() => {
    const total = mockUsers.length;
    const active = mockUsers.filter((u) => u.status === 'active').length;
    const suspended = mockUsers.filter((u) => u.status === 'suspended').length;
    const banned = mockUsers.filter((u) => u.status === 'banned').length;
    return { total, active, suspended, banned };
  }, []);

  const filteredUsers = useMemo(() => {
    return mockUsers.filter((user) => {
      // Search
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesSearch =
          user.name.toLowerCase().includes(q) ||
          user.email.toLowerCase().includes(q);
        if (!matchesSearch) return false;
      }
      // Role
      if (roleFilter !== 'all' && user.role !== roleFilter) return false;
      // Status
      if (statusFilter !== 'all' && user.status !== statusFilter) return false;
      return true;
    });
  }, [searchQuery, roleFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedUsers = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filteredUsers.slice(start, start + PAGE_SIZE);
  }, [filteredUsers, safePage]);

  // Reset to page 1 when filters change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };
  const handleRoleFilterChange = (value: string) => {
    setRoleFilter(value);
    setCurrentPage(1);
  };
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  // ---- Dialog handlers ----
  const openEditDialog = (user: User) => {
    setEditUser(user);
    setEditForm({ name: user.name, email: user.email, phone: user.phone ?? '' });
  };

  const closeEditDialog = () => {
    setEditUser(null);
    setEditForm({ name: '', email: '', phone: '' });
  };

  const openRoleChangeDialog = (user: User) => {
    setRoleChangeUser(user);
    setNewRole(user.role);
  };

  const closeRoleChangeDialog = () => {
    setRoleChangeUser(null);
    setNewRole('student');
  };

  const showFeedback = (msg: string) => {
    setActionFeedback(msg);
    setTimeout(() => setActionFeedback(null), 2500);
  };

  // ---- Render ----
  return (
    <div className="space-y-6">
      {/* ================================================================= */}
      {/* Header                                                           */}
      {/* ================================================================= */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
            <Badge variant="secondary" className="text-xs font-medium">
              <UsersIcon className="mr-1 h-3 w-3" />
              {stats.total}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Manage platform users, roles, and permissions
          </p>
        </div>

        <Button className="mt-3 sm:mt-0 gap-2" size="sm">
          <Plus className="h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* ================================================================= */}
      {/* Toolbar                                                          */}
      {/* ================================================================= */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground hidden sm:block" />

          <Select value={roleFilter} onValueChange={handleRoleFilterChange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {ALL_ROLES.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {ALL_STATUSES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ================================================================= */}
      {/* Stats row                                                         */}
      {/* ================================================================= */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          icon={UsersIcon}
          label="Total Users"
          value={stats.total}
          color="bg-blue-500/15 text-blue-400"
        />
        <StatCard
          icon={CheckCircle}
          label="Active"
          value={stats.active}
          color="bg-emerald-500/15 text-emerald-400"
        />
        <StatCard
          icon={Ban}
          label="Suspended"
          value={stats.suspended}
          color="bg-amber-500/15 text-amber-400"
        />
        <StatCard
          icon={Shield}
          label="Banned"
          value={stats.banned}
          color="bg-red-500/15 text-red-400"
        />
      </div>

      {/* ================================================================= */}
      {/* Data Table                                                        */}
      {/* ================================================================= */}
      <Card className="border-border/50 overflow-hidden">
        <CardContent className="p-0">
          {/* Desktop Table */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="pl-6">User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-center">Violations</TableHead>
                  <TableHead className="text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                <AnimatePresence mode="popLayout">
                  {paginatedUsers.length === 0 ? (
                    <TableRow key="empty">
                      <TableCell colSpan={7} className="h-48 text-center">
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                          <Search className="h-8 w-8 opacity-40" />
                          <p className="text-sm font-medium">No users found</p>
                          <p className="text-xs">
                            Try adjusting your search or filters
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedUsers.map((user, idx) => (
                      <motion.tr
                        key={user.id}
                        custom={idx}
                        variants={rowVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="group border-b border-border/30 transition-colors hover:bg-muted/50"
                      >
                        {/* User */}
                        <TableCell className="pl-6 py-3.5">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarFallback className="text-xs font-medium bg-primary/10 text-primary">
                                {getInitials(user.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <p className="text-sm font-medium truncate max-w-[180px]">
                                {user.name}
                              </p>
                              <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        {/* Role */}
                        <TableCell className="py-3.5">
                          <Badge
                            variant={ROLE_VARIANT[user.role] ?? 'secondary'}
                            className={`text-xs font-medium border ${getRoleBadgeClass(user.role)}`}
                          >
                            {getRoleLabel(user.role)}
                          </Badge>
                        </TableCell>

                        {/* Status */}
                        <TableCell className="py-3.5">
                          <Badge
                            variant="outline"
                            className={`text-xs capitalize font-medium ${STATUS_COLORS[user.status] ?? ''}`}
                          >
                            {user.status}
                          </Badge>
                        </TableCell>

                        {/* Country */}
                        <TableCell className="py-3.5 text-sm text-muted-foreground">
                          {user.country}
                        </TableCell>

                        {/* Joined */}
                        <TableCell className="py-3.5 text-sm text-muted-foreground">
                          {formatDateTime(user.createdAt)}
                        </TableCell>

                        {/* Violations */}
                        <TableCell className="py-3.5 text-center">
                          <span
                            className={`text-sm font-semibold ${
                              user.violationCount > 0
                                ? 'text-red-400'
                                : 'text-muted-foreground'
                            }`}
                          >
                            {user.violationCount}
                          </span>
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="py-3.5 pr-6 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem
                                onClick={() => openEditDialog(user)}
                                className="gap-2 cursor-pointer"
                              >
                                <Edit className="h-4 w-4" />
                                Edit Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => openRoleChangeDialog(user)}
                                className="gap-2 cursor-pointer"
                              >
                                <UserCog className="h-4 w-4" />
                                Change Role
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {user.status === 'active' ? (
                                <DropdownMenuItem
                                  onClick={() =>
                                    showFeedback(`${user.name} has been suspended`)
                                  }
                                  className="gap-2 cursor-pointer text-amber-400 focus:text-amber-400"
                                >
                                  <Ban className="h-4 w-4" />
                                  Suspend User
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  onClick={() =>
                                    showFeedback(`${user.name} has been activated`)
                                  }
                                  className="gap-2 cursor-pointer text-emerald-400 focus:text-emerald-400"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                  Activate User
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() =>
                                  showFeedback(
                                    `Viewing ${user.violationCount} violation(s) for ${user.name}`
                                  )
                                }
                                className="gap-2 cursor-pointer"
                              >
                                <Shield className="h-4 w-4" />
                                View Violations
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-border/30">
            <AnimatePresence mode="popLayout">
              {paginatedUsers.length === 0 ? (
                <div key="empty-mobile" className="flex flex-col items-center gap-2 py-16 text-muted-foreground">
                  <Search className="h-8 w-8 opacity-40" />
                  <p className="text-sm font-medium">No users found</p>
                  <p className="text-xs">Try adjusting your search or filters</p>
                </div>
              ) : (
                paginatedUsers.map((user, idx) => (
                  <motion.div
                    key={user.id}
                    custom={idx}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="p-4 space-y-3"
                  >
                    {/* Top row: avatar + name + actions */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="text-xs font-medium bg-primary/10 text-primary">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">
                            {user.name}
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </p>
                        </div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            onClick={() => openEditDialog(user)}
                            className="gap-2 cursor-pointer"
                          >
                            <Edit className="h-4 w-4" />
                            Edit Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openRoleChangeDialog(user)}
                            className="gap-2 cursor-pointer"
                          >
                            <UserCog className="h-4 w-4" />
                            Change Role
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {user.status === 'active' ? (
                            <DropdownMenuItem
                              onClick={() => showFeedback(`${user.name} has been suspended`)}
                              className="gap-2 cursor-pointer text-amber-400 focus:text-amber-400"
                            >
                              <Ban className="h-4 w-4" />
                              Suspend User
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => showFeedback(`${user.name} has been activated`)}
                              className="gap-2 cursor-pointer text-emerald-400 focus:text-emerald-400"
                            >
                              <CheckCircle className="h-4 w-4" />
                              Activate User
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => showFeedback(`Viewing ${user.violationCount} violation(s) for ${user.name}`)}
                            className="gap-2 cursor-pointer"
                          >
                            <Shield className="h-4 w-4" />
                            View Violations
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Bottom row: badges + meta */}
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant={ROLE_VARIANT[user.role] ?? 'secondary'}
                        className={`text-xs font-medium border ${getRoleBadgeClass(user.role)}`}
                      >
                        {getRoleLabel(user.role)}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`text-xs capitalize font-medium ${STATUS_COLORS[user.status] ?? ''}`}
                      >
                        {user.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {user.country}
                      </span>
                      {user.violationCount > 0 && (
                        <span className="ml-auto text-xs font-semibold text-red-400">
                          {user.violationCount} violation{user.violationCount !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </CardContent>

        {/* Pagination */}
        {filteredUsers.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-border/30">
            <p className="text-sm text-muted-foreground">
              Showing{' '}
              <span className="font-medium text-foreground">
                {(safePage - 1) * PAGE_SIZE + 1}
              </span>{' '}
              to{' '}
              <span className="font-medium text-foreground">
                {Math.min(safePage * PAGE_SIZE, filteredUsers.length)}
              </span>{' '}
              of{' '}
              <span className="font-medium text-foreground">
                {filteredUsers.length}
              </span>{' '}
              results
            </p>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={safePage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous page</span>
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  // Show first, last, and nearby pages
                  if (totalPages <= 5) return true;
                  if (page === 1 || page === totalPages) return true;
                  return Math.abs(page - safePage) <= 1;
                })
                .map((page, i, arr) => {
                  const prev = arr[i - 1];
                  const showEllipsis = prev != null && page - prev > 1;

                  return (
                    <span key={page} className="flex items-center">
                      {showEllipsis && (
                        <span className="px-1 text-xs text-muted-foreground">
                          ...
                        </span>
                      )}
                      <Button
                        variant={page === safePage ? 'default' : 'outline'}
                        size="icon"
                        className="h-8 w-8 text-xs"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                        <span className="sr-only">Page {page}</span>
                      </Button>
                    </span>
                  );
                })}

              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={safePage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next page</span>
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* ================================================================= */}
      {/* Edit Profile Dialog                                               */}
      {/* ================================================================= */}
      <Dialog open={editUser !== null} onOpenChange={(open) => !open && closeEditDialog()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User Profile</DialogTitle>
            <DialogDescription>
              Update the user&apos;s profile information below.
            </DialogDescription>
          </DialogHeader>

          {editUser && (
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="text-sm font-medium bg-primary/10 text-primary">
                    {getInitials(editUser.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{editUser.name}</p>
                  <p className="text-xs text-muted-foreground">{editUser.email}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="Enter full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-email">Email Address</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, email: e.target.value }))
                  }
                  placeholder="Enter email address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone Number</Label>
                <Input
                  id="edit-phone"
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, phone: e.target.value }))
                  }
                  placeholder="Enter phone number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-notes">Notes</Label>
                <Textarea
                  id="edit-notes"
                  placeholder="Add notes about this user..."
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={closeEditDialog}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                showFeedback(`${editForm.name}'s profile has been updated`);
                closeEditDialog();
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ================================================================= */}
      {/* Change Role Dialog                                                */}
      {/* ================================================================= */}
      <Dialog
        open={roleChangeUser !== null}
        onOpenChange={(open) => !open && closeRoleChangeDialog()}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription>
              Select a new role for this user. This will affect their permissions and access.
            </DialogDescription>
          </DialogHeader>

          {roleChangeUser && (
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="text-xs font-medium bg-primary/10 text-primary">
                    {getInitials(roleChangeUser.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{roleChangeUser.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Current role:{' '}
                    <Badge
                      variant={ROLE_VARIANT[roleChangeUser.role] ?? 'secondary'}
                      className={`ml-1 text-xs font-medium border ${getRoleBadgeClass(roleChangeUser.role)}`}
                    >
                      {getRoleLabel(roleChangeUser.role)}
                    </Badge>
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>New Role</Label>
                <Select value={newRole} onValueChange={(v) => setNewRole(v as UserRole)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {USER_ROLES.map((r) => (
                      <SelectItem key={r.value} value={r.value}>
                        <span className="flex items-center gap-2">
                          <span>{r.label}</span>
                          <span className="text-xs text-muted-foreground">
                            — {r.description}
                          </span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {newRole === 'super_admin' && (
                <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 text-sm text-amber-400">
                  <Shield className="inline h-4 w-4 mr-1" />
                  Warning: Super Admin has unrestricted access to all system features.
                </div>
              )}
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={closeRoleChangeDialog}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                showFeedback(
                  `${roleChangeUser?.name}'s role changed to ${getRoleLabel(newRole)}`
                );
                closeRoleChangeDialog();
              }}
            >
              Update Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ================================================================= */}
      {/* Feedback toast                                                    */}
      {/* ================================================================= */}
      <AnimatePresence>
        {actionFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 rounded-lg border border-border/50 bg-card px-4 py-3 shadow-lg"
          >
            <p className="text-sm font-medium">{actionFeedback}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
