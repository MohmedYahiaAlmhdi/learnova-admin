'use client';

import { useState } from 'react';
import {
  Wallet,
  DollarSign,
  Clock,
  TrendingUp,
  ArrowUpRight,
  Calendar,
  CreditCard,
  PiggyBank,
  BarChart3,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { mockFinanceRecords, mockFinanceSummary } from '@/shared/mocks';
import { formatCurrency, formatDateTime } from '@/shared/lib';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { STATUS_COLORS } from '@/shared/constants';

const TYPE_COLORS: Record<string, string> = {
  earning: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  payout: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
  refund: 'bg-red-500/15 text-red-400 border-red-500/20',
  commission: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
};

const TYPE_AMOUNT_COLORS: Record<string, string> = {
  earning: 'text-emerald-400',
  payout: 'text-cyan-400',
  refund: 'text-red-400',
  commission: 'text-amber-400',
};

export function FinancePage() {
  const [data] = useState({
    summary: mockFinanceSummary,
    records: mockFinanceRecords,
  });

  // Build chart data from monthly earnings records
  const monthlyEarnings = data.records
    .filter((r) => r.type === 'earning' && r.description.includes('Monthly'))
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )
    .map((r) => ({
      month: new Date(r.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        year: '2-digit',
      }),
      amount: r.amount,
    }));

  const stats = [
    {
      label: 'Total Earnings',
      value: formatCurrency(data.summary.totalEarnings),
      icon: DollarSign,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      change: `+${data.summary.monthlyGrowth}%`,
    },
    {
      label: 'Available Balance',
      value: formatCurrency(data.summary.availableBalance),
      icon: Wallet,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
    },
    {
      label: 'Pending Payouts',
      value: formatCurrency(data.summary.pendingPayouts),
      icon: Clock,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
    },
    {
      label: 'Platform Fees',
      value: formatCurrency(data.summary.platformFees),
      icon: CreditCard,
      color: 'text-violet-400',
      bg: 'bg-violet-500/10',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          Financial Overview
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Revenue, payouts, and financial analytics
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="bg-card border-border shadow-none"
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {stat.label}
                  </p>
                  <p className="text-xl font-bold text-foreground mt-1">
                    {stat.value}
                  </p>
                  {stat.change && (
                    <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                      <ArrowUpRight className="w-3 h-3" />
                      {stat.change} this month
                    </p>
                  )}
                </div>
                <div
                  className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}
                >
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card border-border shadow-none">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#06B6D4]/10 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-[#06B6D4]" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Next Payout Date</p>
                <p className="text-sm font-semibold text-foreground">
                  {new Date(data.summary.nextPayoutDate).toLocaleDateString(
                    'en-US',
                    { month: 'long', day: 'numeric', year: 'numeric' }
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border shadow-none">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Monthly Growth</p>
                <p className="text-sm font-semibold text-emerald-400">
                  +{data.summary.monthlyGrowth}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border shadow-none">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <PiggyBank className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Avg Order Value</p>
                <p className="text-sm font-semibold text-foreground">
                  {formatCurrency(data.summary.avgOrderValue)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card className="bg-card border-border shadow-none">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#4F46E5]" />
            <CardTitle className="text-base font-semibold text-foreground">
              Monthly Revenue Trend
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyEarnings}>
                <defs>
                  <linearGradient
                    id="revenueGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#4F46E5"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="#4F46E5"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border)"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                  axisLine={{ stroke: 'var(--border)' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                  axisLine={{ stroke: 'var(--border)' }}
                  tickLine={false}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '10px',
                    color: 'var(--foreground)',
                    fontSize: '13px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                  }}
                  labelStyle={{ color: 'var(--muted-foreground)' }}
                  formatter={(value: number) => [
                    formatCurrency(value),
                    'Revenue',
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#4F46E5"
                  strokeWidth={2.5}
                  fill="url(#revenueGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Earnings History Table */}
      <Card className="bg-card border-border shadow-none">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-foreground">
            Earnings History
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                    Date
                  </TableHead>
                  <TableHead className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                    Type
                  </TableHead>
                  <TableHead className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                    Amount
                  </TableHead>
                  <TableHead className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                    Status
                  </TableHead>
                  <TableHead className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                    Method
                  </TableHead>
                  <TableHead className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                    Description
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.records.map((record) => (
                  <TableRow
                    key={record.id}
                    className="border-b border-border/50 hover:bg-muted/50"
                  >
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-muted-foreground/70" />
                        <span className="text-sm text-muted-foreground">
                          {formatDateTime(record.createdAt)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-xs capitalize ${
                          TYPE_COLORS[record.type] || ''
                        }`}
                      >
                        {record.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`text-sm font-semibold ${
                          TYPE_AMOUNT_COLORS[record.type] || 'text-foreground'
                        }`}
                      >
                        {record.type === 'refund' ? '-' : '+'}
                        {formatCurrency(record.amount)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          STATUS_COLORS[record.status] || ''
                        }`}
                      >
                        {record.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {record.method || '—'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground max-w-[240px] truncate block">
                        {record.description}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
