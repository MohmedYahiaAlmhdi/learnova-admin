'use client';

import { useState, useMemo } from 'react';
import { mockCourses } from '@/shared/mocks';
import type { Course, CourseStatus } from '@/shared/types';
import { formatDateTime, formatCurrency } from '@/shared/lib';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Search,
  Filter,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  BookOpen,
  Upload,
  Star,
  ChevronLeft,
  ChevronRight,
  Users,
  FileText,
  Clock,
  AlertCircle,
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
const STATUS_LABELS: Record<CourseStatus, string> = {
  draft: 'Draft',
  pending_review: 'Pending Review',
  published: 'Published',
  unpublished: 'Unpublished',
  rejected: 'Rejected',
};

/* ── Stat Card Component ── */
interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

function StatCard({ label, value, icon, color, bgColor }: StatCardProps) {
  return (
    <Card className="bg-card border-border hover:border-border transition-colors">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-medium mb-1">{label}</p>
            <p className="text-xl font-display font-bold text-foreground">{value}</p>
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
    return <span className="text-xs text-muted-foreground/70">No reviews</span>;
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
                : 'text-muted-foreground/40'
            }`}
          />
        ))}
      </div>
      <span className="text-xs text-foreground/80 font-medium ml-0.5">{rating.toFixed(1)}</span>
    </div>
  );
}

/* ── Main Component ── */
export function CoursesPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [previewCourse, setPreviewCourse] = useState<Course | null>(null);
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const pageSize = 10;

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(mockCourses.map((c) => c.categoryName)));
    return cats.sort();
  }, []);

  // Filter courses
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch =
        search === '' ||
        course.title.toLowerCase().includes(search.toLowerCase()) ||
        course.instructorName.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' || course.status === statusFilter;
      const matchesCategory =
        categoryFilter === 'all' || course.categoryName === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [courses, search, statusFilter, categoryFilter]);

  // Stats
  const stats = useMemo(() => {
    const published = courses.filter((c) => c.status === 'published').length;
    const pending = courses.filter((c) => c.status === 'pending_review').length;
    const draft = courses.filter((c) => c.status === 'draft').length;
    const totalEnrolled = courses.reduce((sum, c) => sum + c.enrolledCount, 0);
    return { published, pending, draft, totalEnrolled };
  }, [courses]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredCourses.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedCourses = useMemo(() => {
    const start = (safeCurrentPage - 1) * pageSize;
    return filteredCourses.slice(start, start + pageSize);
  }, [filteredCourses, safeCurrentPage]);

  // Action handlers
  const handleStatusChange = (courseId: string, newStatus: CourseStatus) => {
    setCourses((prev) =>
      prev.map((c) =>
        c.id === courseId
          ? { ...c, status: newStatus, updatedAt: new Date().toISOString() }
          : c
      )
    );
    setPreviewCourse((prev) =>
      prev && prev.id === courseId
        ? { ...prev, status: newStatus, updatedAt: new Date().toISOString() }
        : prev
    );
  };

  const handleDelete = (courseId: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== courseId));
    setPreviewCourse(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  // Reset page when filters change
  const handleFilterChange = (setter: (val: string) => void, val: string) => {
    setter(val);
    setCurrentPage(1);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* ── Header ── */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground tracking-tight">
            Course Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} found
            {search || statusFilter !== 'all' || categoryFilter !== 'all'
              ? ' (filtered)'
              : ''}
          </p>
        </div>
        <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/80 hover:to-primary text-primary-foreground font-semibold text-sm shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 h-10 px-5 cursor-pointer">
          <Upload className="w-4 h-4 mr-2" />
          New Course
        </Button>
      </motion.div>

      {/* ── Stats Row ── */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Published"
          value={stats.published}
          icon={<CheckCircle className="w-5 h-5" />}
          color="#10B981"
          bgColor="rgba(16, 185, 129, 0.1)"
        />
        <StatCard
          label="Pending Review"
          value={stats.pending}
          icon={<Clock className="w-5 h-5" />}
          color="#F59E0B"
          bgColor="rgba(245, 158, 11, 0.1)"
        />
        <StatCard
          label="Draft"
          value={stats.draft}
          icon={<FileText className="w-5 h-5" />}
          color="#7C8597"
          bgColor="rgba(124, 133, 151, 0.1)"
        />
        <StatCard
          label="Total Enrolled"
          value={stats.totalEnrolled.toLocaleString()}
          icon={<Users className="w-5 h-5" />}
          color="#06B6D4"
          bgColor="rgba(6, 182, 212, 0.1)"
        />
      </motion.div>

      {/* ── Toolbar ── */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70 pointer-events-none" />
          <Input
            placeholder="Search courses by title or instructor..."
            value={search}
            onChange={(e) => handleFilterChange(setSearch, e.target.value)}
            className="h-10 pl-10 bg-card border-border text-foreground placeholder:text-muted-foreground text-sm focus-visible:border-primary focus-visible:ring-primary/20"
          />
        </div>
        <div className="flex gap-3">
          <Select value={statusFilter} onValueChange={(v) => handleFilterChange(setStatusFilter, v)}>
            <SelectTrigger className="w-[160px] h-10 bg-card border-border text-sm text-foreground/80">
              <Filter className="w-4 h-4 mr-2 text-muted-foreground/70" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="all" className="text-foreground/80 focus:bg-primary/10 focus:text-primary-foreground">All Statuses</SelectItem>
              <SelectItem value="published" className="text-foreground/80 focus:bg-primary/10 focus:text-primary-foreground">Published</SelectItem>
              <SelectItem value="pending_review" className="text-foreground/80 focus:bg-primary/10 focus:text-primary-foreground">Pending Review</SelectItem>
              <SelectItem value="draft" className="text-foreground/80 focus:bg-primary/10 focus:text-primary-foreground">Draft</SelectItem>
              <SelectItem value="unpublished" className="text-foreground/80 focus:bg-primary/10 focus:text-primary-foreground">Unpublished</SelectItem>
              <SelectItem value="rejected" className="text-foreground/80 focus:bg-primary/10 focus:text-primary-foreground">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={(v) => handleFilterChange(setCategoryFilter, v)}>
            <SelectTrigger className="w-[170px] h-10 bg-card border-border text-sm text-foreground/80">
              <BookOpen className="w-4 h-4 mr-2 text-muted-foreground/70" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="all" className="text-foreground/80 focus:bg-primary/10 focus:text-primary-foreground">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat} className="text-foreground/80 focus:bg-primary/10 focus:text-primary-foreground">
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* ── Table ── */}
      <motion.div variants={itemVariants}>
        <Card className="bg-card border-border overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold h-11">Course</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold h-11">Instructor</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold h-11">Category</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold h-11 text-right">Price</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold h-11 text-right">Enrolled</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold h-11">Rating</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold h-11">Status</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold h-11 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCourses.length === 0 ? (
                  <TableRow className="border-border">
                    <TableCell colSpan={8} className="h-40 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <BookOpen className="w-10 h-10 text-muted-foreground/40" />
                        <p className="text-sm text-muted-foreground">No courses found</p>
                        <p className="text-xs text-muted-foreground/70">Try adjusting your search or filter criteria</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedCourses.map((course, index) => (
                    <TableRow
                      key={course.id}
                      className="border-border hover:bg-primary/[0.04] transition-colors group"
                    >
                      {/* Title with thumbnail */}
                      <TableCell className="py-3 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-[#06B6D4]/10 border border-border flex items-center justify-center shrink-0">
                            <BookOpen className="w-4 h-4 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground truncate max-w-[220px]">
                              {course.title}
                            </p>
                            <p className="text-xs text-muted-foreground/70 mt-0.5">
                              ID: {course.id}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Instructor */}
                      <TableCell className="py-3">
                        <span className="text-sm text-foreground/80">{course.instructorName}</span>
                      </TableCell>

                      {/* Category */}
                      <TableCell className="py-3">
                        <Badge
                          variant="outline"
                          className="text-xs font-normal bg-card border-border text-foreground/80 hover:bg-card"
                        >
                          {course.categoryName}
                        </Badge>
                      </TableCell>

                      {/* Price */}
                      <TableCell className="py-3 text-right">
                        <span className="text-sm font-medium text-foreground">
                          {formatCurrency(course.price)}
                        </span>
                      </TableCell>

                      {/* Enrolled */}
                      <TableCell className="py-3 text-right">
                        <span className="text-sm text-foreground/80">
                          {course.enrolledCount > 0
                            ? course.enrolledCount.toLocaleString()
                            : '—'}
                        </span>
                      </TableCell>

                      {/* Rating */}
                      <TableCell className="py-3">
                        <StarRating rating={course.rating} />
                      </TableCell>

                      {/* Status */}
                      <TableCell className="py-3">
                        <Badge
                          variant="outline"
                          className={`text-xs font-medium ${STATUS_COLORS[course.status] || ''}`}
                        >
                          {STATUS_LABELS[course.status]}
                        </Badge>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="py-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-muted-foreground/70 hover:text-foreground hover:bg-primary/10 cursor-pointer"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-48 bg-popover border-border shadow-xl"
                          >
                            <DropdownMenuItem
                              onClick={() => setPreviewCourse(course)}
                              className="text-foreground/80 focus:bg-primary/10 focus:text-primary-foreground cursor-pointer"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Preview
                            </DropdownMenuItem>

                            {course.status === 'pending_review' && (
                              <>
                                <DropdownMenuItem
                                  onClick={() => handleStatusChange(course.id, 'published')}
                                  className="text-emerald-400 focus:bg-emerald-500/10 focus:text-emerald-300 cursor-pointer"
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleStatusChange(course.id, 'rejected')}
                                  className="text-red-400 focus:bg-red-500/10 focus:text-red-300 cursor-pointer"
                                >
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Reject
                                </DropdownMenuItem>
                              </>
                            )}

                            {course.status === 'published' && (
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(course.id, 'unpublished')}
                                className="text-amber-400 focus:bg-amber-500/10 focus:text-amber-300 cursor-pointer"
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Unpublish
                              </DropdownMenuItem>
                            )}

                            {course.status === 'unpublished' && (
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(course.id, 'published')}
                                className="text-emerald-400 focus:bg-emerald-500/10 focus:text-emerald-300 cursor-pointer"
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Republish
                              </DropdownMenuItem>
                            )}

                            {course.status === 'draft' && (
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(course.id, 'pending_review')}
                                className="text-[#06B6D4] focus:bg-[#06B6D4]/10 focus:text-[#22D3EE] cursor-pointer"
                              >
                                <Upload className="w-4 h-4 mr-2" />
                                Submit for Review
                              </DropdownMenuItem>
                            )}

                            <DropdownMenuItem
                              onClick={() => handleDelete(course.id)}
                              className="text-red-400 focus:bg-red-500/10 focus:text-red-300 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* ── Pagination ── */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-border">
              <p className="text-xs text-muted-foreground/70">
                Showing {(safeCurrentPage - 1) * pageSize + 1}–
                {Math.min(safeCurrentPage * pageSize, filteredCourses.length)} of{' '}
                {filteredCourses.length}
              </p>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handlePageChange(safeCurrentPage - 1)}
                  disabled={safeCurrentPage === 1}
                  className="h-8 w-8 p-0 text-muted-foreground/70 hover:text-foreground hover:bg-primary/10 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className={`h-8 w-8 p-0 text-xs font-medium cursor-pointer ${
                      page === safeCurrentPage
                        ? 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-primary/10'
                    }`}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handlePageChange(safeCurrentPage + 1)}
                  disabled={safeCurrentPage === totalPages}
                  className="h-8 w-8 p-0 text-muted-foreground/70 hover:text-foreground hover:bg-primary/10 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      </motion.div>

      {/* ── Course Preview Dialog ── */}
      <Dialog open={!!previewCourse} onOpenChange={(open) => !open && setPreviewCourse(null)}>
        <DialogContent className="bg-popover border-border shadow-2xl max-w-lg">
          {previewCourse && (
            <>
              <DialogHeader>
                <DialogTitle className="text-lg font-display font-bold text-foreground flex items-center gap-2">
                  <Eye className="w-5 h-5 text-primary" />
                  Course Preview
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-5 py-2">
                {/* Thumbnail placeholder */}
                <div className="w-full h-36 rounded-xl bg-gradient-to-br from-primary/20 via-card to-[#06B6D4]/10 border border-border flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-primary/40" />
                </div>

                {/* Title & Status */}
                <div>
                  <h3 className="text-base font-semibold text-foreground leading-snug">
                    {previewCourse.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-2">
                    <Badge
                      variant="outline"
                      className={`text-xs font-medium ${STATUS_COLORS[previewCourse.status] || ''}`}
                    >
                      {STATUS_LABELS[previewCourse.status]}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="text-xs font-normal bg-card border-border text-foreground/80"
                    >
                      {previewCourse.categoryName}
                    </Badge>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                    Description
                  </Label>
                  <p className="text-sm text-foreground/80 mt-1.5 leading-relaxed">
                    {previewCourse.description}
                  </p>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-card border border-border p-3">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">
                      Instructor
                    </p>
                    <p className="text-sm text-foreground font-medium mt-1">
                      {previewCourse.instructorName}
                    </p>
                  </div>
                  <div className="rounded-lg bg-card border border-border p-3">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">
                      Price
                    </p>
                    <p className="text-sm text-foreground font-medium mt-1">
                      {formatCurrency(previewCourse.price)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-card border border-border p-3">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">
                      Enrolled
                    </p>
                    <p className="text-sm text-foreground font-medium mt-1">
                      {previewCourse.enrolledCount.toLocaleString()} students
                    </p>
                  </div>
                  <div className="rounded-lg bg-card border border-border p-3">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">
                      Rating
                    </p>
                    <div className="mt-1">
                      <StarRating rating={previewCourse.rating} />
                    </div>
                  </div>
                  <div className="rounded-lg bg-card border border-border p-3">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">
                      Created
                    </p>
                    <p className="text-sm text-foreground font-medium mt-1">
                      {formatDateTime(previewCourse.createdAt)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-card border border-border p-3">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">
                      Updated
                    </p>
                    <p className="text-sm text-foreground font-medium mt-1">
                      {formatDateTime(previewCourse.updatedAt)}
                    </p>
                  </div>
                </div>

                {previewCourse.publishedAt && (
                  <div className="rounded-lg bg-card border border-border p-3">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">
                      Published At
                    </p>
                    <p className="text-sm text-foreground font-medium mt-1">
                      {formatDateTime(previewCourse.publishedAt)}
                    </p>
                  </div>
                )}
              </div>

              <DialogFooter className="gap-2 sm:gap-2">
                {previewCourse.status === 'pending_review' && (
                  <>
                    <Button
                      onClick={() => handleStatusChange(previewCourse.id, 'published')}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm h-9 cursor-pointer"
                    >
                      <CheckCircle className="w-4 h-4 mr-1.5" />
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleStatusChange(previewCourse.id, 'rejected')}
                      className="flex-1 bg-red-600 hover:bg-red-500 text-white font-semibold text-sm h-9 cursor-pointer"
                    >
                      <XCircle className="w-4 h-4 mr-1.5" />
                      Reject
                    </Button>
                  </>
                )}
                {previewCourse.status === 'published' && (
                  <Button
                    variant="outline"
                    onClick={() => handleStatusChange(previewCourse.id, 'unpublished')}
                    className="flex-1 border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:text-amber-300 font-semibold text-sm h-9 cursor-pointer"
                  >
                    <XCircle className="w-4 h-4 mr-1.5" />
                    Unpublish
                  </Button>
                )}
                <Button
                  variant="ghost"
                  onClick={() => setPreviewCourse(null)}
                  className="text-muted-foreground hover:text-foreground hover:bg-muted text-sm h-9 cursor-pointer"
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
