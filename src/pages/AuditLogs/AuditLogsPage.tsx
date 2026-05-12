'use client';

import { useState, useMemo } from 'react';
import {
  ScrollText,
  Filter,
  Plus,
  Edit,
  Trash2,
  Shield,
  Clock,
  Globe,
  Monitor,
  ChevronDown,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  LogIn,
  LogOut,
  Ban,
  ThumbsUp,
  RefreshCw,
} from 'lucide-react';
import { mockAuditLogs } from '@/shared/mocks';
import { formatDateTime } from '@/shared/lib';
import { STATUS_COLORS } from '@/shared/constants';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

const ACTION_COLORS: Record<string, string> = {
  create: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  approve: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  activate: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  update: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
  delete: 'bg-red-500/15 text-red-400 border-red-500/20',
  suspend: 'bg-red-500/15 text-red-400 border-red-500/20',
  reject: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  login: 'bg-violet-500/15 text-violet-400 border-violet-500/20',
  logout: 'bg-slate-500/15 text-slate-400 border-slate-500/20',
};

const ACTION_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  create: Plus,
  approve: ThumbsUp,
  activate: CheckCircle2,
  update: Edit,
  delete: Trash2,
  suspend: Ban,
  reject: XCircle,
  login: LogIn,
  logout: LogOut,
};

const ROLE_COLORS: Record<string, string> = {
  super_admin: 'bg-red-500/15 text-red-400 border-red-500/20',
  admin: 'bg-violet-500/15 text-violet-400 border-violet-500/20',
  support: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
  finance: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
};

const RESOURCE_COLORS: Record<string, string> = {
  course: 'text-violet-400',
  user: 'text-cyan-400',
  category: 'text-emerald-400',
  withdrawal: 'text-amber-400',
  settings: 'text-pink-400',
  auth: 'text-slate-400',
};

export function AuditLogsPage() {
  const [logs] = useState(mockAuditLogs);
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [userFilter, setUserFilter] = useState<string>('all');

  const uniqueUsers = useMemo(
    () => [...new Set(logs.map((l) => l.userName))],
    [logs]
  );

  const uniqueActions = useMemo(
    () => [...new Set(logs.map((l) => l.action))],
    [logs]
  );

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      if (actionFilter !== 'all' && log.action !== actionFilter) return false;
      if (userFilter !== 'all' && log.userName !== userFilter) return false;
      return true;
    });
  }, [logs, actionFilter, userFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Audit Log
        </h1>
        <p className="text-sm text-[#7C8597] mt-1">
          Track system activity and changes across all resources
        </p>
      </div>

      {/* Filters */}
      <Card className="bg-[#12131A] border-[#2B2F3E] shadow-none">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-[#7C8597]">
              <Filter className="w-4 h-4" />
              <span className="font-medium">Filters:</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Select
                value={actionFilter}
                onValueChange={setActionFilter}
              >
                <SelectTrigger className="w-full sm:w-[180px] h-9 bg-[#0B0B12] border-[#2B2F3E] text-sm text-[#B6BCC8] rounded-lg">
                  <SelectValue placeholder="Action type" />
                </SelectTrigger>
                <SelectContent className="bg-[#12131A] border-[#2B2F3E]">
                  <SelectItem value="all" className="text-[#B6BCC8]">All Actions</SelectItem>
                  {uniqueActions.map((action) => (
                    <SelectItem key={action} value={action} className="capitalize text-[#B6BCC8]">
                      {action}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={userFilter}
                onValueChange={setUserFilter}
              >
                <SelectTrigger className="w-full sm:w-[180px] h-9 bg-[#0B0B12] border-[#2B2F3E] text-sm text-[#B6BCC8] rounded-lg">
                  <SelectValue placeholder="User" />
                </SelectTrigger>
                <SelectContent className="bg-[#12131A] border-[#2B2F3E]">
                  <SelectItem value="all" className="text-[#B6BCC8]">All Users</SelectItem>
                  {uniqueUsers.map((user) => (
                    <SelectItem key={user} value={user} className="text-[#B6BCC8]">
                      {user}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                className="h-9 bg-[#0B0B12] border-[#2B2F3E] text-[#7C8597] hover:text-white hover:bg-[#1D2030]"
                onClick={() => {
                  setActionFilter('all');
                  setUserFilter('all');
                }}
              >
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <div className="relative">
        {/* Timeline connecting line */}
        <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-[#2B2F3E] via-[#2B2F3E] to-transparent hidden md:block" />

        <div className="space-y-4">
          {filteredLogs.map((log, index) => {
            const ActionIcon = ACTION_ICONS[log.action] || Info;
            const hasStateChanges = log.previousState && log.newState;

            return (
              <div key={log.id} className="relative md:pl-12">
                {/* Timeline dot */}
                <div className="hidden md:flex absolute left-3.5 top-5 w-3.5 h-3.5 rounded-full border-2 border-[#2B2F3E] bg-[#12131A] z-10 items-center justify-center">
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      log.action === 'create' || log.action === 'approve' || log.action === 'activate'
                        ? 'bg-emerald-400'
                        : log.action === 'update'
                          ? 'bg-cyan-400'
                          : log.action === 'delete' || log.action === 'suspend'
                            ? 'bg-red-400'
                            : log.action === 'reject'
                              ? 'bg-amber-400'
                              : 'bg-violet-400'
                    }`}
                  />
                </div>

                <Card className="bg-[#12131A] border-[#2B2F3E] shadow-none hover:border-[#3B3F4E] transition-colors">
                  <CardContent className="p-4">
                    {/* Main row */}
                    <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                      {/* Icon + Action */}
                      <div className="flex items-center gap-2.5 shrink-0">
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                            log.action === 'create' || log.action === 'approve' || log.action === 'activate'
                              ? 'bg-emerald-500/10'
                              : log.action === 'update'
                                ? 'bg-cyan-500/10'
                                : log.action === 'delete' || log.action === 'suspend'
                                  ? 'bg-red-500/10'
                                  : log.action === 'reject'
                                    ? 'bg-amber-500/10'
                                    : 'bg-violet-500/10'
                          }`}
                        >
                          <ActionIcon
                            className={`w-4 h-4 ${
                              log.action === 'create' || log.action === 'approve' || log.action === 'activate'
                                ? 'text-emerald-400'
                                : log.action === 'update'
                                  ? 'text-cyan-400'
                                  : log.action === 'delete' || log.action === 'suspend'
                                    ? 'text-red-400'
                                    : log.action === 'reject'
                                      ? 'text-amber-400'
                                      : 'text-violet-400'
                            }`}
                          />
                        </div>
                        <Badge
                          variant="outline"
                          className={`text-xs capitalize ${
                            ACTION_COLORS[log.action] || ''
                          }`}
                        >
                          {log.action}
                        </Badge>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-semibold text-white">
                              {log.userName}
                            </span>
                            <Badge
                              variant="outline"
                              className={`text-[10px] px-1.5 py-0 ${
                                ROLE_COLORS[log.userRole] || ''
                              }`}
                            >
                              {log.userRole}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <Clock className="w-3 h-3 text-[#5A6178]" />
                            <span className="text-xs text-[#5A6178]">
                              {formatDateTime(log.createdAt)}
                            </span>
                          </div>
                        </div>

                        {/* Resource + details */}
                        <div className="mt-2">
                          <p className="text-sm text-[#B6BCC8]">
                            <span
                              className={`font-medium capitalize ${
                                RESOURCE_COLORS[log.resource] || 'text-[#B6BCC8]'
                              }`}
                            >
                              {log.resource}
                              {log.resourceId ? ` #${log.resourceId}` : ''}
                            </span>
                            {' — '}
                            {log.details}
                          </p>
                        </div>

                        {/* Before/After state */}
                        {hasStateChanges && (
                          <Collapsible className="mt-3">
                            <CollapsibleTrigger className="flex items-center gap-1.5 text-xs text-[#4F46E5] hover:text-[#6366F1] transition-colors py-1 cursor-pointer">
                              <ChevronDown className="w-3 h-3 transition-transform duration-200 [[data-state=open]>&]:rotate-180" />
                              View state changes
                            </CollapsibleTrigger>
                            <CollapsibleContent className="mt-2 space-y-2">
                              <div className="rounded-lg bg-[#0B0B12] border border-[#1D2030] p-3">
                                <p className="text-[10px] font-medium text-red-400 uppercase tracking-wider mb-1.5">
                                  Before
                                </p>
                                <pre className="text-xs text-[#7C8597] font-mono overflow-x-auto">
                                  {JSON.stringify(log.previousState, null, 2)}
                                </pre>
                              </div>
                              <div className="rounded-lg bg-[#0B0B12] border border-[#1D2030] p-3">
                                <p className="text-[10px] font-medium text-emerald-400 uppercase tracking-wider mb-1.5">
                                  After
                                </p>
                                <pre className="text-xs text-[#7C8597] font-mono overflow-x-auto">
                                  {JSON.stringify(log.newState, null, 2)}
                                </pre>
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        )}

                        {/* IP + User Agent */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 pt-2 border-t border-[#1D2030]">
                          <div className="flex items-center gap-1.5 text-xs text-[#5A6178]">
                            <Globe className="w-3 h-3" />
                            <span>{log.ipAddress}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-[#5A6178]">
                            <Monitor className="w-3 h-3" />
                            <span>{log.userAgent}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}

          {filteredLogs.length === 0 && (
            <Card className="bg-[#12131A] border-[#2B2F3E] shadow-none">
              <CardContent className="py-16 text-center">
                <ScrollText className="w-10 h-10 text-[#2B2F3E] mx-auto mb-3" />
                <p className="text-sm text-[#5A6178]">No audit logs found</p>
                <p className="text-xs text-[#3B3F4E] mt-1">
                  Try adjusting your filters
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
