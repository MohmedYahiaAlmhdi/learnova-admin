'use client';

import { useState } from 'react';
import {
  Store,
  Users,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  RefreshCw,
  Ban,
  CheckCircle2,
  DollarSign,
  Clock,
} from 'lucide-react';
import { mockAgents, mockTransactions } from '@/shared/mocks';
import { formatCurrency, formatDateTime } from '@/shared/lib';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { STATUS_COLORS } from '@/shared/constants';

const TRANSACTION_TYPE_COLORS: Record<string, string> = {
  recharge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  purchase: 'bg-violet-500/15 text-violet-400 border-violet-500/20',
  withdrawal: 'bg-orange-500/15 text-orange-400 border-orange-500/20',
  commission: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
};

export function AgentsPage() {
  const [agents, setAgents] = useState(mockAgents);
  const [rechargeDialogOpen, setRechargeDialogOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [rechargeAmount, setRechargeAmount] = useState('');

  const totalAgents = agents.length;
  const activeBalance = agents.reduce((sum, a) => sum + a.balance, 0);
  const totalTransactions = agents.reduce((sum, a) => sum + a.transactionCount, 0);
  const totalRecharged = agents.reduce((sum, a) => sum + a.totalRecharged, 0);

  const handleRecharge = () => {
    if (!selectedAgent || !rechargeAmount) return;
    const amount = parseFloat(rechargeAmount);
    if (isNaN(amount) || amount <= 0) return;
    setAgents((prev) =>
      prev.map((a) =>
        a.id === selectedAgent
          ? {
              ...a,
              balance: a.balance + amount,
              totalRecharged: a.totalRecharged + amount,
            }
          : a
      )
    );
    setRechargeDialogOpen(false);
    setRechargeAmount('');
    setSelectedAgent(null);
  };

  const handleToggleStatus = (agentId: string) => {
    setAgents((prev) =>
      prev.map((a) =>
        a.id === agentId
          ? { ...a, status: a.status === 'active' ? 'suspended' : 'active' }
          : a
      )
    );
  };

  const getAgentName = (agentId: string) =>
    agents.find((a) => a.id === agentId)?.name ?? 'Unknown';

  const stats = [
    {
      label: 'Total Agents',
      value: totalAgents,
      icon: Users,
      color: 'text-violet-400',
      bg: 'bg-violet-500/10',
    },
    {
      label: 'Active Balance',
      value: formatCurrency(activeBalance),
      icon: Wallet,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
    {
      label: 'Total Transactions',
      value: totalTransactions.toLocaleString(),
      icon: CreditCard,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
    },
    {
      label: 'Total Recharged',
      value: formatCurrency(totalRecharged),
      icon: DollarSign,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Agents &amp; Point of Sale
        </h1>
        <p className="text-sm text-[#7C8597] mt-1">
          Manage agents, balances, and transaction history
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="bg-[#12131A] border-[#2B2F3E] shadow-none"
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-[#7C8597] uppercase tracking-wider">
                    {stat.label}
                  </p>
                  <p className="text-xl font-bold text-white mt-1">{stat.value}</p>
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

      {/* Tabs */}
      <Tabs defaultValue="agents" className="space-y-4">
        <TabsList className="bg-[#12131A] border border-[#2B2F3E] p-1 h-10">
          <TabsTrigger
            value="agents"
            className="data-[state=active]:bg-[#1D2030] data-[state=active]:text-white text-[#7C8597] text-sm font-medium rounded-lg px-4 transition-colors"
          >
            Agents
          </TabsTrigger>
          <TabsTrigger
            value="transactions"
            className="data-[state=active]:bg-[#1D2030] data-[state=active]:text-white text-[#7C8597] text-sm font-medium rounded-lg px-4 transition-colors"
          >
            Transactions
          </TabsTrigger>
        </TabsList>

        {/* Agents Tab */}
        <TabsContent value="agents" className="mt-4">
          <Card className="bg-[#12131A] border-[#2B2F3E] shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-white">
                All Agents
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-[#2B2F3E] hover:bg-transparent">
                      <TableHead className="text-[#7C8597] text-xs font-medium uppercase tracking-wider">
                        Name
                      </TableHead>
                      <TableHead className="text-[#7C8597] text-xs font-medium uppercase tracking-wider">
                        Email
                      </TableHead>
                      <TableHead className="text-[#7C8597] text-xs font-medium uppercase tracking-wider">
                        Balance
                      </TableHead>
                      <TableHead className="text-[#7C8597] text-xs font-medium uppercase tracking-wider">
                        Total Spent
                      </TableHead>
                      <TableHead className="text-[#7C8597] text-xs font-medium uppercase tracking-wider">
                        Transactions
                      </TableHead>
                      <TableHead className="text-[#7C8597] text-xs font-medium uppercase tracking-wider">
                        Status
                      </TableHead>
                      <TableHead className="text-[#7C8597] text-xs font-medium uppercase tracking-wider text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {agents.map((agent) => (
                      <TableRow
                        key={agent.id}
                        className="border-b border-[#1D2030] hover:bg-[#1D2030]/50"
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-[#4F46E5]/10 flex items-center justify-center shrink-0">
                              <Store className="w-4 h-4 text-[#4F46E5]" />
                            </div>
                            <span className="text-sm font-medium text-white">
                              {agent.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-[#7C8597]">
                            {agent.email}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-semibold text-emerald-400">
                            {formatCurrency(agent.balance)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-[#B6BCC8]">
                            {formatCurrency(agent.totalSpent)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-[#B6BCC8]">
                            {agent.transactionCount}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`text-xs ${STATUS_COLORS[agent.status] || ''}`}
                          >
                            {agent.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 px-2.5 text-xs text-[#06B6D4] hover:text-[#22D3EE] hover:bg-[#06B6D4]/10"
                              onClick={() => {
                                setSelectedAgent(agent.id);
                                setRechargeDialogOpen(true);
                              }}
                            >
                              <DollarSign className="w-3.5 h-3.5 mr-1" />
                              Recharge
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className={`h-8 px-2.5 text-xs ${
                                agent.status === 'active'
                                  ? 'text-red-400 hover:text-red-300 hover:bg-red-400/10'
                                  : 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10'
                              }`}
                              onClick={() => handleToggleStatus(agent.id)}
                            >
                              {agent.status === 'active' ? (
                                <Ban className="w-3.5 h-3.5 mr-1" />
                              ) : (
                                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                              )}
                              {agent.status === 'active' ? 'Suspend' : 'Activate'}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="mt-4">
          <Card className="bg-[#12131A] border-[#2B2F3E] shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-white">
                Transaction History
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-[#2B2F3E] hover:bg-transparent">
                      <TableHead className="text-[#7C8597] text-xs font-medium uppercase tracking-wider">
                        Agent
                      </TableHead>
                      <TableHead className="text-[#7C8597] text-xs font-medium uppercase tracking-wider">
                        Type
                      </TableHead>
                      <TableHead className="text-[#7C8597] text-xs font-medium uppercase tracking-wider">
                        Amount
                      </TableHead>
                      <TableHead className="text-[#7C8597] text-xs font-medium uppercase tracking-wider">
                        Balance After
                      </TableHead>
                      <TableHead className="text-[#7C8597] text-xs font-medium uppercase tracking-wider">
                        Description
                      </TableHead>
                      <TableHead className="text-[#7C8597] text-xs font-medium uppercase tracking-wider">
                        Date
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockTransactions.map((txn) => (
                      <TableRow
                        key={txn.id}
                        className="border-b border-[#1D2030] hover:bg-[#1D2030]/50"
                      >
                        <TableCell>
                          <span className="text-sm font-medium text-white">
                            {getAgentName(txn.agentId)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`text-xs capitalize ${
                              TRANSACTION_TYPE_COLORS[txn.type] || ''
                            }`}
                          >
                            {txn.type === 'recharge' && (
                              <ArrowDownRight className="w-3 h-3 mr-1" />
                            )}
                            {txn.type === 'purchase' && (
                              <ArrowUpRight className="w-3 h-3 mr-1" />
                            )}
                            {txn.type === 'withdrawal' && (
                              <ArrowUpRight className="w-3 h-3 mr-1" />
                            )}
                            {txn.type === 'commission' && (
                              <RefreshCw className="w-3 h-3 mr-1" />
                            )}
                            {txn.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`text-sm font-semibold ${
                              txn.type === 'recharge' || txn.type === 'commission'
                                ? 'text-emerald-400'
                                : 'text-orange-400'
                            }`}
                          >
                            {txn.type === 'recharge' || txn.type === 'commission'
                              ? '+'
                              : '-'}
                            {formatCurrency(txn.amount)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-[#B6BCC8]">
                            {formatCurrency(txn.balanceAfter)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-[#7C8597] max-w-[200px] truncate block">
                            {txn.description}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3 h-3 text-[#5A6178]" />
                            <span className="text-sm text-[#7C8597]">
                              {formatDateTime(txn.createdAt)}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Recharge Dialog */}
      <Dialog open={rechargeDialogOpen} onOpenChange={setRechargeDialogOpen}>
        <DialogContent className="bg-[#12131A] border-[#2B2F3E] sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle className="text-white">
              Recharge Agent Wallet
            </DialogTitle>
            <DialogDescription className="text-[#7C8597]">
              Add funds to{' '}
              <span className="text-white font-medium">
                {agents.find((a) => a.id === selectedAgent)?.name}
              </span>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-sm text-[#B6BCC8] font-medium">
                Amount (USD)
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A6178]" />
                <Input
                  type="number"
                  placeholder="0.00"
                  min="1"
                  step="0.01"
                  value={rechargeAmount}
                  onChange={(e) => setRechargeAmount(e.target.value)}
                  className="h-11 pl-10 pr-4 rounded-xl bg-[#0B0B12] border-[#2B2F3E] text-white placeholder:text-[#5A6178] text-sm focus-visible:border-[#4F46E5] focus-visible:ring-[#4F46E5]/20"
                />
              </div>
              <p className="text-xs text-[#5A6178]">
                Current balance:{' '}
                <span className="text-emerald-400">
                  {formatCurrency(
                    agents.find((a) => a.id === selectedAgent)?.balance ?? 0
                  )}
                </span>
              </p>
            </div>
            <div className="flex gap-2">
              {[100, 500, 1000, 5000].map((preset) => (
                <Button
                  key={preset}
                  size="sm"
                  variant="outline"
                  className="flex-1 h-9 text-xs bg-[#0B0B12] border-[#2B2F3E] text-[#B6BCC8] hover:bg-[#1D2030] hover:text-white hover:border-[#4F46E5]/30"
                  onClick={() => setRechargeAmount(String(preset))}
                >
                  {formatCurrency(preset)}
                </Button>
              ))}
            </div>
          </div>
          <DialogFooter className="gap-2 pt-2">
            <Button
              variant="outline"
              className="bg-transparent border-[#2B2F3E] text-[#B6BCC8] hover:bg-[#1D2030] hover:text-white"
              onClick={() => setRechargeDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-[#4F46E5] to-[#4338CA] hover:from-[#6366F1] hover:to-[#4F46E5] text-white font-semibold text-sm shadow-lg shadow-[#4F46E5]/20"
              onClick={handleRecharge}
              disabled={!rechargeAmount || parseFloat(rechargeAmount) <= 0}
            >
              <DollarSign className="w-4 h-4 mr-1.5" />
              Recharge
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
