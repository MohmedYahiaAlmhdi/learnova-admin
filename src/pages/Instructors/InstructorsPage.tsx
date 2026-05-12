'use client';

import { useState, useMemo } from 'react';
import { mockInstructors } from '@/shared/mocks';
import type { Instructor, InstructorStatus } from '@/shared/types';
import { formatDateTime, formatCurrency, getInitials } from '@/shared/lib';
import { STATUS_COLORS } from '@/shared/constants';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Eye,
  DollarSign,
  Star,
  Users,
  GraduationCap,
  Clock,
  AlertTriangle,
  Ban,
  ShieldCheck,
  Wallet,
  Building,
  CalendarDays,
} from 'lucide-react';

/* ── Animation Variants ── */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ── Status Label Map ── */
const INSTRUCTOR_STATUS_LABELS: Record<InstructorStatus, string> = {
  approved: 'Approved',
  pending: 'Pending',
  rejected: 'Rejected',
  suspended: 'Suspended',
};

/* ── Withdrawal Status Colors ── */
const WITHDRAWAL_STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  approved: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  rejected: 'bg-red-500/15 text-red-400 border-red-500/20',
};

/* ── Stat Card ── */
interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

function StatCard({ label, value, icon, color, bgColor }: StatCardProps) {
  return (
    <Card className="bg-[#1D2030]/60 border-[#2B2F3E]/60 hover:border-[#3D4255]/80 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-[#7C8597] font-medium mb-1">{label}</p>
            <p className="text-xl font-display font-bold text-white">{value}</p>
          </div>
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: bgColor }}
          >
            <div style={{ color }}>{icon}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ── Star Rating Component ── */
function StarRating({ rating }: { rating: number }) {
  if (rating === 0) {
    return <span className="text-xs text-[#5A6178]">No reviews</span>;
  }
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3.5 h-3.5 ${
              star <= Math.round(rating)
                ? 'text-amber-400 fill-amber-400'
                : 'text-[#3D4255]'
            }`}
          />
        ))}
      </div>
      <span className="text-xs text-[#B6BCC8] font-medium ml-0.5">{rating.toFixed(1)}</span>
    </div>
  );
}

/* ── Avatar Colors ── */
const AVATAR_COLORS = [
  'bg-[#4F46E5]/20 text-[#4F46E5]',
  'bg-[#06B6D4]/20 text-[#06B6D4]',
  'bg-[#10B981]/20 text-[#10B981]',
  'bg-[#F59E0B]/20 text-[#F59E0B]',
  'bg-[#EF4444]/20 text-[#EF4444]',
  'bg-[#8B5CF6]/20 text-[#8B5CF6]',
];

function getAvatarColor(index: number): string {
  return AVATAR_COLORS[index % AVATAR_COLORS.length];
}

/* ── Main Component ── */
export function InstructorsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('all');
  const [instructors, setInstructors] = useState<Instructor[]>(mockInstructors);
  const [previewInstructor, setPreviewInstructor] = useState<Instructor | null>(null);

  // Filter instructors
  const filteredInstructors = useMemo(() => {
    return instructors.filter((inst) => {
      const matchesSearch =
        search === '' ||
        inst.name.toLowerCase().includes(search.toLowerCase()) ||
        inst.email.toLowerCase().includes(search.toLowerCase()) ||
        inst.specialization.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' || inst.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [instructors, search, statusFilter]);

  // Pending instructors (for tab 2)
  const pendingInstructors = useMemo(() => {
    return instructors.filter((i) => i.status === 'pending');
  }, [instructors]);

  // All withdrawal requests (for tab 3)
  const allWithdrawals = useMemo(() => {
    return instructors.flatMap((inst) =>
      inst.withdrawalRequests.map((wd) => ({
        ...wd,
        instructorName: inst.name,
        instructorId: inst.id,
      }))
    );
  }, [instructors]);

  const pendingWithdrawals = useMemo(
    () => allWithdrawals.filter((w) => w.status === 'pending'),
    [allWithdrawals]
  );

  const totalPendingAmount = useMemo(
    () => pendingWithdrawals.reduce((sum, w) => sum + w.amount, 0),
    [pendingWithdrawals]
  );

  // Stats
  const stats = useMemo(() => {
    const total = instructors.length;
    const approved = instructors.filter((i) => i.status === 'approved').length;
    const pending = instructors.filter((i) => i.status === 'pending').length;
    const totalEarnings = instructors.reduce((sum, i) => sum + i.totalEarnings, 0);
    return { total, approved, pending, totalEarnings };
  }, [instructors]);

  // Action handlers
  const handleInstructorStatusChange = (
    instructorId: string,
    newStatus: InstructorStatus
  ) => {
    setInstructors((prev) =>
      prev.map((i) =>
        i.id === instructorId
          ? { ...i, status: newStatus, reviewedAt: new Date().toISOString() }
          : i
      )
    );
    setPreviewInstructor((prev) =>
      prev && prev.id === instructorId
        ? { ...prev, status: newStatus, reviewedAt: new Date().toISOString() }
        : prev
    );
  };

  const handleWithdrawalAction = (
    withdrawalId: string,
    action: 'approved' | 'rejected'
  ) => {
    setInstructors((prev) =>
      prev.map((inst) => ({
        ...inst,
        withdrawalRequests: inst.withdrawalRequests.map((wd) =>
          wd.id === withdrawalId
            ? { ...wd, status: action, processedAt: new Date().toISOString() }
            : wd
        ),
      }))
    );
  };

  const handleFilterChange = (setter: (val: string) => void, val: string) => {
    setter(val);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* ── Header ── */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-display font-bold text-white tracking-tight">
          Instructor Management
        </h1>
        <p className="text-sm text-[#7C8597] mt-1">
          {instructors.length} instructor{instructors.length !== 1 ? 's' : ''} registered
        </p>
      </motion.div>

      {/* ── Tabs ── */}
      <motion.div variants={itemVariants}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-[#12131A] border border-[#2B2F3E] p-1 h-auto">
            <TabsTrigger
              value="all"
              className="px-4 py-2 text-sm font-medium data-[state=active]:bg-[#4F46E5] data-[state=active]:text-white text-[#7C8597] data-[state=inactive]:hover:text-[#B6BCC8] rounded-md transition-all cursor-pointer"
            >
              <Users className="w-4 h-4 mr-2" />
              All Instructors
              <Badge
                variant="outline"
                className="ml-2 text-[10px] bg-[#1D2030] border-[#2B2F3E] text-[#7C8597] h-5 min-w-[20px] px-1.5 data-[state=active]:bg-[#4F46E5]/20 data-[state=active]:border-[#4F46E5]/30 data-[state=active]:text-white"
              >
                {instructors.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              className="px-4 py-2 text-sm font-medium data-[state=active]:bg-[#4F46E5] data-[state=active]:text-white text-[#7C8597] data-[state=inactive]:hover:text-[#B6BCC8] rounded-md transition-all cursor-pointer"
            >
              <Clock className="w-4 h-4 mr-2" />
              Pending Applications
              {pendingInstructors.length > 0 && (
                <Badge
                  variant="outline"
                  className="ml-2 text-[10px] bg-amber-500/15 border-amber-500/20 text-amber-400 h-5 min-w-[20px] px-1.5"
                >
                  {pendingInstructors.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="withdrawals"
              className="px-4 py-2 text-sm font-medium data-[state=active]:bg-[#4F46E5] data-[state=active]:text-white text-[#7C8597] data-[state=inactive]:hover:text-[#B6BCC8] rounded-md transition-all cursor-pointer"
            >
              <Wallet className="w-4 h-4 mr-2" />
              Withdrawal Requests
              {pendingWithdrawals.length > 0 && (
                <Badge
                  variant="outline"
                  className="ml-2 text-[10px] bg-amber-500/15 border-amber-500/20 text-amber-400 h-5 min-w-[20px] px-1.5"
                >
                  {pendingWithdrawals.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* ── Tab 1: All Instructors ── */}
          <TabsContent value="all" className="space-y-6">
            {/* Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                label="Total Instructors"
                value={stats.total}
                icon={<GraduationCap className="w-5 h-5" />}
                color="#4F46E5"
                bgColor="rgba(79, 70, 229, 0.1)"
              />
              <StatCard
                label="Approved"
                value={stats.approved}
                icon={<ShieldCheck className="w-5 h-5" />}
                color="#10B981"
                bgColor="rgba(16, 185, 129, 0.1)"
              />
              <StatCard
                label="Pending"
                value={stats.pending}
                icon={<Clock className="w-5 h-5" />}
                color="#F59E0B"
                bgColor="rgba(245, 158, 11, 0.1)"
              />
              <StatCard
                label="Total Earnings"
                value={formatCurrency(stats.totalEarnings)}
                icon={<DollarSign className="w-5 h-5" />}
                color="#06B6D4"
                bgColor="rgba(6, 182, 212, 0.1)"
              />
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A6178] pointer-events-none" />
                <Input
                  placeholder="Search instructors by name, email, or specialization..."
                  value={search}
                  onChange={(e) => handleFilterChange(setSearch, e.target.value)}
                  className="h-10 pl-10 bg-[#12131A] border-[#2B2F3E] text-white placeholder:text-[#5A6178] text-sm focus-visible:border-[#4F46E5] focus-visible:ring-[#4F46E5]/20"
                />
              </div>
              <Select value={statusFilter} onValueChange={(v) => handleFilterChange(setStatusFilter, v)}>
                <SelectTrigger className="w-[160px] h-10 bg-[#12131A] border-[#2B2F3E] text-sm text-[#B6BCC8]">
                  <Filter className="w-4 h-4 mr-2 text-[#5A6178]" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-[#1D2030] border-[#2B2F3E]">
                  <SelectItem value="all" className="text-[#B6BCC8] focus:bg-[#4F46E5]/10 focus:text-white">All Statuses</SelectItem>
                  <SelectItem value="approved" className="text-[#B6BCC8] focus:bg-[#4F46E5]/10 focus:text-white">Approved</SelectItem>
                  <SelectItem value="pending" className="text-[#B6BCC8] focus:bg-[#4F46E5]/10 focus:text-white">Pending</SelectItem>
                  <SelectItem value="rejected" className="text-[#B6BCC8] focus:bg-[#4F46E5]/10 focus:text-white">Rejected</SelectItem>
                  <SelectItem value="suspended" className="text-[#B6BCC8] focus:bg-[#4F46E5]/10 focus:text-white">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            <Card className="bg-[#1D2030]/60 border-[#2B2F3E]/60 overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-[#2B2F3E]/60 hover:bg-transparent">
                      <TableHead className="text-[11px] uppercase tracking-wider text-[#7C8597] font-semibold h-11">Instructor</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider text-[#7C8597] font-semibold h-11">Specialization</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider text-[#7C8597] font-semibold h-11 text-right">Commission</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider text-[#7C8597] font-semibold h-11 text-right">Courses</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider text-[#7C8597] font-semibold h-11 text-right">Students</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider text-[#7C8597] font-semibold h-11">Rating</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider text-[#7C8597] font-semibold h-11">Status</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider text-[#7C8597] font-semibold h-11 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInstructors.length === 0 ? (
                      <TableRow className="border-[#2B2F3E]/30">
                        <TableCell colSpan={8} className="h-40 text-center">
                          <div className="flex flex-col items-center gap-2">
                            <GraduationCap className="w-10 h-10 text-[#3D4255]" />
                            <p className="text-sm text-[#7C8597]">No instructors found</p>
                            <p className="text-xs text-[#5A6178]">Try adjusting your search or filter</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredInstructors.map((inst, index) => (
                        <TableRow
                          key={inst.id}
                          className="border-[#2B2F3E]/30 hover:bg-[#4F46E5]/[0.04] transition-colors"
                        >
                          {/* Name with Avatar */}
                          <TableCell className="py-3 pr-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9 border border-[#2B2F3E]">
                                <AvatarFallback
                                  className={`text-xs font-semibold ${getAvatarColor(index)}`}
                                >
                                  {getInitials(inst.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-white truncate">
                                  {inst.name}
                                </p>
                                <p className="text-xs text-[#5A6178] mt-0.5 truncate">
                                  {inst.email}
                                </p>
                              </div>
                            </div>
                          </TableCell>

                          {/* Specialization */}
                          <TableCell className="py-3">
                            <span className="text-sm text-[#B6BCC8] line-clamp-1 max-w-[180px]">
                              {inst.specialization}
                            </span>
                          </TableCell>

                          {/* Commission Rate */}
                          <TableCell className="py-3 text-right">
                            <span className="text-sm font-medium text-[#06B6D4]">
                              {(inst.commissionRate * 100).toFixed(0)}%
                            </span>
                          </TableCell>

                          {/* Courses */}
                          <TableCell className="py-3 text-right">
                            <span className="text-sm text-[#B6BCC8]">
                              {inst.courseCount}
                            </span>
                          </TableCell>

                          {/* Students */}
                          <TableCell className="py-3 text-right">
                            <span className="text-sm text-[#B6BCC8]">
                              {inst.studentCount > 0
                                ? inst.studentCount.toLocaleString()
                                : '—'}
                            </span>
                          </TableCell>

                          {/* Rating */}
                          <TableCell className="py-3">
                            <StarRating rating={inst.rating} />
                          </TableCell>

                          {/* Status */}
                          <TableCell className="py-3">
                            <Badge
                              variant="outline"
                              className={`text-xs font-medium ${STATUS_COLORS[inst.status] || ''}`}
                            >
                              {INSTRUCTOR_STATUS_LABELS[inst.status]}
                            </Badge>
                          </TableCell>

                          {/* Actions */}
                          <TableCell className="py-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setPreviewInstructor(inst)}
                                className="h-8 w-8 p-0 text-[#5A6178] hover:text-white hover:bg-[#4F46E5]/10 cursor-pointer"
                              >
                                <Eye className="w-4 h-4" />
                                <span className="sr-only">View</span>
                              </Button>
                              {inst.status === 'pending' && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      handleInstructorStatusChange(inst.id, 'approved')
                                    }
                                    className="h-8 w-8 p-0 text-emerald-400 hover:bg-emerald-500/10 cursor-pointer"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                    <span className="sr-only">Approve</span>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      handleInstructorStatusChange(inst.id, 'rejected')
                                    }
                                    className="h-8 w-8 p-0 text-red-400 hover:bg-red-500/10 cursor-pointer"
                                  >
                                    <XCircle className="w-4 h-4" />
                                    <span className="sr-only">Reject</span>
                                  </Button>
                                </>
                              )}
                              {inst.status === 'approved' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleInstructorStatusChange(inst.id, 'suspended')
                                  }
                                  className="h-8 w-8 p-0 text-amber-400 hover:bg-amber-500/10 cursor-pointer"
                                >
                                  <Ban className="w-4 h-4" />
                                  <span className="sr-only">Suspend</span>
                                </Button>
                              )}
                              {inst.status === 'suspended' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleInstructorStatusChange(inst.id, 'approved')
                                  }
                                  className="h-8 w-8 p-0 text-emerald-400 hover:bg-emerald-500/10 cursor-pointer"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                  <span className="sr-only">Reactivate</span>
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          {/* ── Tab 2: Pending Applications ── */}
          <TabsContent value="pending" className="space-y-6">
            {pendingInstructors.length === 0 ? (
              <Card className="bg-[#1D2030]/60 border-[#2B2F3E]/60">
                <CardContent className="py-16 flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-emerald-500/40" />
                  </div>
                  <p className="text-base font-medium text-white">All caught up!</p>
                  <p className="text-sm text-[#7C8597]">No pending instructor applications</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {pendingInstructors.map((inst, index) => (
                  <motion.div
                    key={inst.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card className="bg-[#1D2030]/60 border-[#2B2F3E]/60 hover:border-[#3D4255]/80 transition-colors">
                      <CardContent className="p-5">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          {/* Avatar & Info */}
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <Avatar className="h-11 w-11 border border-[#2B2F3E]">
                              <AvatarFallback
                                className={`text-sm font-semibold ${getAvatarColor(index)}`}
                              >
                                {getInitials(inst.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="text-sm font-semibold text-white truncate">
                                  {inst.name}
                                </h3>
                                <Badge
                                  variant="outline"
                                  className="text-[10px] bg-amber-500/15 border-amber-500/20 text-amber-400 shrink-0"
                                >
                                  Pending
                                </Badge>
                              </div>
                              <p className="text-xs text-[#5A6178] mt-0.5">{inst.email}</p>
                              <p className="text-xs text-[#7C8597] mt-1 truncate">
                                {inst.specialization}
                              </p>
                            </div>
                          </div>

                          {/* Applied Date */}
                          <div className="text-xs text-[#5A6178] hidden md:block">
                            <CalendarDays className="w-3.5 h-3.5 inline mr-1" />
                            Applied {formatDateTime(inst.appliedAt)}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 shrink-0">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setPreviewInstructor(inst)}
                              className="h-9 px-3 text-[#7C8597] hover:text-white hover:bg-[#4F46E5]/10 text-sm cursor-pointer"
                            >
                              <Eye className="w-4 h-4 mr-1.5" />
                              View
                            </Button>
                            <Button
                              size="sm"
                              onClick={() =>
                                handleInstructorStatusChange(inst.id, 'approved')
                              }
                              className="h-9 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm cursor-pointer"
                            >
                              <CheckCircle className="w-4 h-4 mr-1.5" />
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleInstructorStatusChange(inst.id, 'rejected')
                              }
                              className="h-9 px-4 border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 font-semibold text-sm cursor-pointer"
                            >
                              <XCircle className="w-4 h-4 mr-1.5" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ── Tab 3: Withdrawal Requests ── */}
          <TabsContent value="withdrawals" className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard
                label="Total Requests"
                value={allWithdrawals.length}
                icon={<Wallet className="w-5 h-5" />}
                color="#4F46E5"
                bgColor="rgba(79, 70, 229, 0.1)"
              />
              <StatCard
                label="Pending Amount"
                value={formatCurrency(totalPendingAmount)}
                icon={<AlertTriangle className="w-5 h-5" />}
                color="#F59E0B"
                bgColor="rgba(245, 158, 11, 0.1)"
              />
              <StatCard
                label="Pending Requests"
                value={pendingWithdrawals.length}
                icon={<Clock className="w-5 h-5" />}
                color="#06B6D4"
                bgColor="rgba(6, 182, 212, 0.1)"
              />
            </div>

            {/* Withdrawals Table */}
            <Card className="bg-[#1D2030]/60 border-[#2B2F3E]/60 overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-[#2B2F3E]/60 hover:bg-transparent">
                      <TableHead className="text-[11px] uppercase tracking-wider text-[#7C8597] font-semibold h-11">Instructor</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider text-[#7C8597] font-semibold h-11 text-right">Amount</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider text-[#7C8597] font-semibold h-11">Status</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider text-[#7C8597] font-semibold h-11">Requested</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider text-[#7C8597] font-semibold h-11">Bank (Last 4)</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider text-[#7C8597] font-semibold h-11 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allWithdrawals.length === 0 ? (
                      <TableRow className="border-[#2B2F3E]/30">
                        <TableCell colSpan={6} className="h-40 text-center">
                          <div className="flex flex-col items-center gap-2">
                            <Wallet className="w-10 h-10 text-[#3D4255]" />
                            <p className="text-sm text-[#7C8597]">No withdrawal requests</p>
                            <p className="text-xs text-[#5A6178]">
                              Withdrawal requests will appear here
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      allWithdrawals
                        .sort(
                          (a, b) =>
                            new Date(b.requestedAt).getTime() -
                            new Date(a.requestedAt).getTime()
                        )
                        .map((wd) => (
                          <TableRow
                            key={wd.id}
                            className="border-[#2B2F3E]/30 hover:bg-[#4F46E5]/[0.04] transition-colors"
                          >
                            <TableCell className="py-3">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8 border border-[#2B2F3E]">
                                  <AvatarFallback className="text-[10px] font-semibold bg-[#4F46E5]/20 text-[#4F46E5]">
                                    {getInitials(wd.instructorName)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-sm font-medium text-white">
                                  {wd.instructorName}
                                </span>
                              </div>
                            </TableCell>

                            <TableCell className="py-3 text-right">
                              <span className="text-sm font-semibold text-white">
                                {formatCurrency(wd.amount)}
                              </span>
                            </TableCell>

                            <TableCell className="py-3">
                              <Badge
                                variant="outline"
                                className={`text-xs font-medium ${WITHDRAWAL_STATUS_COLORS[wd.status] || ''}`}
                              >
                                {wd.status.charAt(0).toUpperCase() + wd.status.slice(1)}
                              </Badge>
                            </TableCell>

                            <TableCell className="py-3">
                              <span className="text-xs text-[#B6BCC8]">
                                {formatDateTime(wd.requestedAt)}
                              </span>
                            </TableCell>

                            <TableCell className="py-3">
                              <div className="flex items-center gap-1.5">
                                <Building className="w-3.5 h-3.5 text-[#5A6178]" />
                                <span className="text-xs text-[#7C8597] font-mono">
                                  {wd.bankDetails || 'N/A'}
                                </span>
                              </div>
                            </TableCell>

                            <TableCell className="py-3 text-right">
                              {wd.status === 'pending' ? (
                                <div className="flex items-center justify-end gap-1">
                                  <Button
                                    size="sm"
                                    onClick={() =>
                                      handleWithdrawalAction(wd.id, 'approved')
                                    }
                                    className="h-7 px-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer"
                                  >
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Approve
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      handleWithdrawalAction(wd.id, 'rejected')
                                    }
                                    className="h-7 px-3 border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 text-xs font-semibold cursor-pointer"
                                  >
                                    <XCircle className="w-3 h-3 mr-1" />
                                    Reject
                                  </Button>
                                </div>
                              ) : (
                                <span className="text-xs text-[#5A6178]">
                                  {wd.processedAt
                                    ? formatDateTime(wd.processedAt)
                                    : '—'}
                                </span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* ── Instructor Preview Dialog ── */}
      <Dialog
        open={!!previewInstructor}
        onOpenChange={(open) => !open && setPreviewInstructor(null)}
      >
        <DialogContent className="bg-[#1D2030] border-[#2B2F3E] shadow-2xl max-w-lg max-h-[90vh] overflow-y-auto">
          {previewInstructor && (
            <>
              <DialogHeader>
                <DialogTitle className="text-lg font-display font-bold text-white flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-[#4F46E5]" />
                  Instructor Profile
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-5 py-2">
                {/* Profile Header */}
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 border-2 border-[#2B2F3E]">
                    <AvatarFallback className="text-lg font-bold bg-[#4F46E5]/20 text-[#4F46E5]">
                      {getInitials(previewInstructor.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-semibold text-white">
                      {previewInstructor.name}
                    </h3>
                    <p className="text-sm text-[#7C8597]">{previewInstructor.email}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Badge
                        variant="outline"
                        className={`text-xs font-medium ${STATUS_COLORS[previewInstructor.status] || ''}`}
                      >
                        {INSTRUCTOR_STATUS_LABELS[previewInstructor.status]}
                      </Badge>
                      <StarRating rating={previewInstructor.rating} />
                    </div>
                  </div>
                </div>

                {/* Bio */}
                {previewInstructor.bio && (
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-[#5A6178] font-semibold mb-1.5">
                      Bio
                    </p>
                    <p className="text-sm text-[#B6BCC8] leading-relaxed">
                      {previewInstructor.bio}
                    </p>
                  </div>
                )}

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-[#12131A] border border-[#2B2F3E] p-3">
                    <p className="text-[10px] uppercase tracking-wider text-[#5A6178] font-semibold">
                      Specialization
                    </p>
                    <p className="text-sm text-white font-medium mt-1">
                      {previewInstructor.specialization}
                    </p>
                  </div>
                  <div className="rounded-lg bg-[#12131A] border border-[#2B2F3E] p-3">
                    <p className="text-[10px] uppercase tracking-wider text-[#5A6178] font-semibold">
                      Commission Rate
                    </p>
                    <p className="text-sm text-[#06B6D4] font-semibold mt-1">
                      {(previewInstructor.commissionRate * 100).toFixed(0)}%
                    </p>
                  </div>
                  <div className="rounded-lg bg-[#12131A] border border-[#2B2F3E] p-3">
                    <p className="text-[10px] uppercase tracking-wider text-[#5A6178] font-semibold">
                      Total Earnings
                    </p>
                    <p className="text-sm text-white font-medium mt-1">
                      {formatCurrency(previewInstructor.totalEarnings)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-[#12131A] border border-[#2B2F3E] p-3">
                    <p className="text-[10px] uppercase tracking-wider text-[#5A6178] font-semibold">
                      Courses
                    </p>
                    <p className="text-sm text-white font-medium mt-1">
                      {previewInstructor.courseCount}
                    </p>
                  </div>
                  <div className="rounded-lg bg-[#12131A] border border-[#2B2F3E] p-3">
                    <p className="text-[10px] uppercase tracking-wider text-[#5A6178] font-semibold">
                      Students
                    </p>
                    <p className="text-sm text-white font-medium mt-1">
                      {previewInstructor.studentCount.toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-lg bg-[#12131A] border border-[#2B2F3E] p-3">
                    <p className="text-[10px] uppercase tracking-wider text-[#5A6178] font-semibold">
                      Applied At
                    </p>
                    <p className="text-sm text-white font-medium mt-1">
                      {formatDateTime(previewInstructor.appliedAt)}
                    </p>
                  </div>
                </div>

                {previewInstructor.reviewedAt && (
                  <div className="rounded-lg bg-[#12131A] border border-[#2B2F3E] p-3">
                    <p className="text-[10px] uppercase tracking-wider text-[#5A6178] font-semibold">
                      Reviewed At
                    </p>
                    <p className="text-sm text-white font-medium mt-1">
                      {formatDateTime(previewInstructor.reviewedAt)}
                    </p>
                  </div>
                )}

                {/* Withdrawal History */}
                {previewInstructor.withdrawalRequests.length > 0 && (
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-[#5A6178] font-semibold mb-2">
                      Withdrawal History
                    </p>
                    <div className="space-y-2">
                      {previewInstructor.withdrawalRequests.map((wd) => (
                        <div
                          key={wd.id}
                          className="flex items-center justify-between rounded-lg bg-[#12131A] border border-[#2B2F3E] p-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#1D2030] flex items-center justify-center">
                              <DollarSign className="w-4 h-4 text-[#7C8597]" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white">
                                {formatCurrency(wd.amount)}
                              </p>
                              <p className="text-xs text-[#5A6178]">
                                {formatDateTime(wd.requestedAt)}
                              </p>
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className={`text-[10px] font-medium ${WITHDRAWAL_STATUS_COLORS[wd.status] || ''}`}
                          >
                            {wd.status.charAt(0).toUpperCase() + wd.status.slice(1)}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter className="gap-2 sm:gap-2">
                {previewInstructor.status === 'pending' && (
                  <>
                    <Button
                      onClick={() =>
                        handleInstructorStatusChange(previewInstructor.id, 'approved')
                      }
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm h-9 cursor-pointer"
                    >
                      <CheckCircle className="w-4 h-4 mr-1.5" />
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() =>
                        handleInstructorStatusChange(previewInstructor.id, 'rejected')
                      }
                      className="flex-1 bg-red-600 hover:bg-red-500 text-white font-semibold text-sm h-9 cursor-pointer"
                    >
                      <XCircle className="w-4 h-4 mr-1.5" />
                      Reject
                    </Button>
                  </>
                )}
                {previewInstructor.status === 'approved' && (
                  <Button
                    variant="outline"
                    onClick={() =>
                      handleInstructorStatusChange(previewInstructor.id, 'suspended')
                    }
                    className="flex-1 border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:text-amber-300 font-semibold text-sm h-9 cursor-pointer"
                  >
                    <Ban className="w-4 h-4 mr-1.5" />
                    Suspend
                  </Button>
                )}
                {previewInstructor.status === 'suspended' && (
                  <Button
                    onClick={() =>
                      handleInstructorStatusChange(previewInstructor.id, 'approved')
                    }
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm h-9 cursor-pointer"
                  >
                    <CheckCircle className="w-4 h-4 mr-1.5" />
                    Reactivate
                  </Button>
                )}
                <Button
                  variant="ghost"
                  onClick={() => setPreviewInstructor(null)}
                  className="text-[#7C8597] hover:text-white hover:bg-[#2B2F3E] text-sm h-9 cursor-pointer"
                >
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
