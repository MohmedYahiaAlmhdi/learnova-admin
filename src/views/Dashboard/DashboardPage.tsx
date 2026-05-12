'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  DollarSign,
  Users,
  BookOpen,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Clock,
  Star,
  UserPlus,
  CreditCard,
  Eye,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { mockDashboardStats } from '@/shared/mocks';
import { formatCurrency, formatNumber, getInitials } from '@/shared/lib';
import { STATUS_COLORS, CHART_COLORS } from '@/shared/constants';
import type { ActivityItem } from '@/shared/types';

/* ─── Animation Variants ─── */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

/* ─── Custom Chart Tooltip ─── */
function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-xl">
      <p className="mb-1 text-xs text-muted-foreground">{label}</p>
      <p className="font-display text-sm font-semibold text-foreground">
        {payload[0].value.toLocaleString()}
      </p>
    </div>
  );
}

/* ─── Pie Chart Center Label ─── */
function PieCenterLabel({ viewBox }: { viewBox?: { cx: number; cy: number } }) {
  if (!viewBox) return null;
  return (
    <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
      <tspan x={viewBox.cx} y={viewBox.cy - 8} className="fill-foreground" style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-space-grotesk)' }}>
        {mockDashboardStats.categoryDistribution.reduce((sum, c) => sum + c.value, 0)}%
      </tspan>
      <tspan x={viewBox.cx} y={viewBox.cy + 14} className="fill-muted-foreground" style={{ fontSize: 11, fontFamily: 'var(--font-dm-sans)' }}>
        Total Share
      </tspan>
    </text>
  );
}

/* ─── Star Rating ─── */
function StarRating({ rating }: { rating: number }) {
  if (rating === 0) {
    return <span className="text-xs text-muted-foreground">N/A</span>;
  }
  return (
    <div className="flex items-center gap-1">
      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
      <span className="font-display text-sm font-medium text-foreground">{rating.toFixed(1)}</span>
    </div>
  );
}

/* ─── Relative Time ─── */
function relativeTime(timestamp: string): string {
  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now.getTime() - then.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return then.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/* ─── Activity Icon Map ─── */
function getActivityIcon(type: ActivityItem['type']) {
  const map: Record<ActivityItem['type'], { icon: React.ReactNode; color: string }> = {
    course_published: {
      icon: <BookOpen className="h-4 w-4" />,
      color: 'bg-emerald-500/15 text-emerald-400',
    },
    user_registered: {
      icon: <UserPlus className="h-4 w-4" />,
      color: 'bg-blue-500/15 text-blue-400',
    },
    payment_received: {
      icon: <CreditCard className="h-4 w-4" />,
      color: 'bg-violet-500/15 text-violet-400',
    },
    instructor_approved: {
      icon: <CheckCircle className="h-4 w-4" />,
      color: 'bg-cyan-500/15 text-cyan-400',
    },
    review_submitted: {
      icon: <Eye className="h-4 w-4" />,
      color: 'bg-amber-500/15 text-amber-400',
    },
    system_update: {
      icon: <AlertCircle className="h-4 w-4" />,
      color: 'bg-slate-500/15 text-slate-400',
    },
  };
  return map[type] || map.system_update;
}

/* ─── Stat Card Data ─── */
const statCards = [
  {
    label: 'Total Revenue',
    value: formatCurrency(mockDashboardStats.totalRevenue),
    change: 12.5,
    positive: true,
    icon: <DollarSign className="h-5 w-5" />,
    iconBg: 'from-indigo-500/20 to-indigo-600/5 text-indigo-400 border-indigo-500/10',
  },
  {
    label: 'Total Users',
    value: formatNumber(mockDashboardStats.totalUsers),
    change: 8.2,
    positive: true,
    icon: <Users className="h-5 w-5" />,
    iconBg: 'from-cyan-500/20 to-cyan-600/5 text-cyan-400 border-cyan-500/10',
  },
  {
    label: 'Total Courses',
    value: formatNumber(mockDashboardStats.totalCourses),
    change: 5.1,
    positive: true,
    icon: <BookOpen className="h-5 w-5" />,
    iconBg: 'from-emerald-500/20 to-emerald-600/5 text-emerald-400 border-emerald-500/10',
  },
  {
    label: 'New Users (Month)',
    value: formatNumber(mockDashboardStats.newUsersThisMonth),
    change: 15.3,
    positive: true,
    icon: <TrendingUp className="h-5 w-5" />,
    iconBg: 'from-amber-500/20 to-amber-600/5 text-amber-400 border-amber-500/10',
  },
];

/* ═══════════════════════════════════════════════════
   ─── Dashboard Page ───
   ═══════════════════════════════════════════════════ */
export function DashboardPage() {
  const {
    monthlySubscriptions,
    categoryDistribution,
    recentCourses,
    activityFeed,
  } = mockDashboardStats;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* ─── Row 1: Stat Cards ─── */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <motion.div key={stat.label} variants={itemVariants}>
            <Card className="hover-lift overflow-hidden border-border bg-card">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-muted-foreground font-body">
                      {stat.label}
                    </p>
                    <p className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl border bg-gradient-to-br ${stat.iconBg}`}
                  >
                    {stat.icon}
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1.5">
                  {stat.positive ? (
                    <ArrowUpRight className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-400" />
                  )}
                  <span
                    className={`text-sm font-semibold font-display ${
                      stat.positive ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {stat.change}%
                  </span>
                  <span className="text-xs text-muted-foreground font-body">
                    vs last month
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* ─── Row 2: Charts ─── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Area Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="border-border bg-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="font-display text-base font-semibold text-foreground">
                    Monthly Subscriptions
                  </CardTitle>
                  <CardDescription className="font-body">
                    Subscription growth over the past 12 months
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-1.5">
                  <Activity className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground font-body">
                    2024
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={monthlySubscriptions}
                    margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="subscriptionGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#4F46E5" stopOpacity={0.3} />
                        <stop offset="60%" stopColor="#4F46E5" stopOpacity={0.08} />
                        <stop offset="100%" stopColor="#4F46E5" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 6"
                      stroke="#2B2F3E"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#7C8597', fontSize: 12, fontFamily: 'var(--font-dm-sans)' }}
                      dy={8}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#7C8597', fontSize: 12, fontFamily: 'var(--font-dm-sans)' }}
                      dx={-4}
                      tickFormatter={(v: number) => `${(v / 1000).toFixed(1)}k`}
                    />
                    <Tooltip
                      content={<ChartTooltip />}
                      cursor={{
                        stroke: '#4F46E5',
                        strokeWidth: 1,
                        strokeDasharray: '4 4',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="count"
                      name="Subscriptions"
                      stroke="#4F46E5"
                      strokeWidth={2.5}
                      fill="url(#subscriptionGradient)"
                      dot={false}
                      activeDot={{
                        r: 5,
                        fill: '#4F46E5',
                        stroke: '#1D2030',
                        strokeWidth: 3,
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Donut Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <Card className="border-border bg-card h-full">
            <CardHeader>
              <div className="space-y-1">
                <CardTitle className="font-display text-base font-semibold text-foreground">
                  Category Distribution
                </CardTitle>
                <CardDescription className="font-body">
                  Courses by category
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={72}
                      outerRadius={105}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="none"
                    >
                      {categoryDistribution.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={CHART_COLORS[index % CHART_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        const data = payload[0];
                        return (
                          <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-xl">
                            <div className="flex items-center gap-2">
                              <div
                                className="h-2.5 w-2.5 rounded-full"
                                style={{ backgroundColor: data.payload.fill }}
                              />
                              <p className="text-xs text-muted-foreground font-body">
                                {data.name}
                              </p>
                            </div>
                            <p className="mt-1 font-display text-sm font-semibold text-foreground">
                              {data.value}%
                            </p>
                          </div>
                        );
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {/* Legend */}
              <div className="mt-2 space-y-2">
                {categoryDistribution.map((cat, i) => (
                  <div key={cat.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2.5 w-2.5 rounded-sm"
                        style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                      />
                      <span className="text-xs text-muted-foreground font-body truncate max-w-[120px]">
                        {cat.name}
                      </span>
                    </div>
                    <span className="font-display text-xs font-semibold text-foreground">
                      {cat.value}%
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ─── Row 3: Recent Courses + Activity Feed ─── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Courses Table */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="border-border bg-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="font-display text-base font-semibold text-foreground">
                    Recent Courses
                  </CardTitle>
                  <CardDescription className="font-body">
                    Latest course activity on the platform
                  </CardDescription>
                </div>
                <Badge variant="outline" className="border-border text-muted-foreground font-body text-xs">
                  {recentCourses.length} courses
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="max-h-[420px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="text-muted-foreground font-body">Title</TableHead>
                      <TableHead className="text-muted-foreground font-body">Instructor</TableHead>
                      <TableHead className="text-muted-foreground font-body hidden sm:table-cell">Category</TableHead>
                      <TableHead className="text-muted-foreground font-body text-right">Price</TableHead>
                      <TableHead className="text-muted-foreground font-body">Status</TableHead>
                      <TableHead className="text-muted-foreground font-body hidden md:table-cell">Rating</TableHead>
                      <TableHead className="text-muted-foreground font-body text-right hidden lg:table-cell">Enrolled</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentCourses.map((course) => (
                      <TableRow
                        key={course.id}
                        className="border-border hover:bg-muted/30 transition-colors"
                      >
                        <TableCell className="max-w-[200px]">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/10">
                              <BookOpen className="h-4 w-4 text-primary" />
                            </div>
                            <span className="truncate font-medium text-foreground text-sm font-body">
                              {course.title}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="bg-muted text-[10px] text-muted-foreground">
                                {getInitials(course.instructorName)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-muted-foreground font-body">
                              {course.instructorName}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <span className="text-sm text-muted-foreground font-body">
                            {course.categoryName}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="font-display text-sm font-semibold text-foreground">
                            {formatCurrency(course.price)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`border text-xs font-medium font-body ${STATUS_COLORS[course.status] || ''}`}
                          >
                            {course.status.replace(/_/g, ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <StarRating rating={course.rating} />
                        </TableCell>
                        <TableCell className="text-right hidden lg:table-cell">
                          <span className="font-display text-sm font-medium text-foreground">
                            {course.enrolledCount.toLocaleString()}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Activity Feed */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <Card className="border-border bg-card h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="font-display text-base font-semibold text-foreground">
                    Recent Activity
                  </CardTitle>
                  <CardDescription className="font-body">
                    Latest platform events
                  </CardDescription>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500/15 to-violet-600/5 border border-violet-500/10">
                  <Activity className="h-4 w-4 text-violet-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="max-h-[420px] space-y-0 overflow-y-auto">
                {activityFeed.map((item, index) => {
                  const activityMeta = getActivityIcon(item.type);
                  return (
                    <React.Fragment key={item.id}>
                      <div className="group flex gap-3 py-3.5">
                        {/* Icon */}
                        <div
                          className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${activityMeta.color}`}
                        >
                          {activityMeta.icon}
                        </div>

                        {/* Content */}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-foreground font-body leading-snug">
                            {item.title}
                          </p>
                          <p className="mt-0.5 text-xs text-muted-foreground font-body leading-relaxed line-clamp-2">
                            {item.description}
                          </p>
                          <div className="mt-1.5 flex items-center gap-1.5">
                            <Clock className="h-3 w-3 text-muted-foreground/60" />
                            <span className="text-[11px] text-muted-foreground/70 font-body">
                              {relativeTime(item.timestamp)}
                            </span>
                          </div>
                        </div>
                      </div>
                      {index < activityFeed.length - 1 && (
                        <div className="border-b border-border/60" />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default DashboardPage;
