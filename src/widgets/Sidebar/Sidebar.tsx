'use client';

import React, { useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Store,
  FolderTree,
  Wallet,
  ScrollText,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Shield,
  type LucideIcon,
} from 'lucide-react';
import { NAV_ITEMS, SIDEBAR_COLLAPSED_WIDTH, SIDEBAR_WIDTH } from '@/shared/constants';
import { useNavigationStore, useAuthStore } from '@/app/store';
import { useIsMobile } from '@/hooks/use-mobile';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { NavItem, NavigationPage } from '@/shared/types';

// ─── Icon Map ─────────────────────────────────────────────────────────────────
const ICON_MAP: Record<string, LucideIcon> = {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Store,
  FolderTree,
  Wallet,
  ScrollText,
  Settings,
  Shield,
};

// ─── Animation Variants ───────────────────────────────────────────────────────
const sidebarVariants = {
  expanded: { width: SIDEBAR_WIDTH },
  collapsed: { width: SIDEBAR_COLLAPSED_WIDTH },
};

const navLabelVariants = {
  expanded: { opacity: 1, x: 0, display: 'block' },
  collapsed: { opacity: 0, x: -8, transitionEnd: { display: 'none' } },
};

const activeIndicatorVariants = {
  hidden: { scaleY: 0, opacity: 0 },
  visible: { scaleY: 1, opacity: 1 },
  exit: { scaleY: 0, opacity: 0 },
};

const badgeVariants = {
  expanded: { opacity: 1, scale: 1, display: 'flex' },
  collapsed: { opacity: 0, scale: 0.5, transitionEnd: { display: 'none' } },
};

// ─── NavItem Component ────────────────────────────────────────────────────────
interface NavItemButtonProps {
  item: NavItem;
  isActive: boolean;
  isCollapsed: boolean;
  onClick: () => void;
}

function NavItemButton({ item, isActive, isCollapsed, onClick }: NavItemButtonProps) {
  const Icon = ICON_MAP[item.icon] || LayoutDashboard;

  const button = (
    <button
      onClick={onClick}
      className={cn(
        'group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 outline-none',
        'focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-1 focus-visible:ring-offset-transparent',
        'cursor-pointer',
        isCollapsed ? 'justify-center px-0' : '',
        isActive
          ? 'text-foreground'
          : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
      )}
      aria-current={isActive ? 'page' : undefined}
    >
      {/* Active indicator — 2px left border accent */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            variants={activeIndicatorVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-primary"
          />
        )}
      </AnimatePresence>

      {/* Active background highlight */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            layoutId="nav-active-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="absolute inset-0 rounded-lg bg-primary/10"
          />
        )}
      </AnimatePresence>

      {/* Icon */}
      <span
        className={cn(
          'relative z-10 shrink-0 transition-colors duration-200',
          isActive ? 'text-primary' : 'text-sidebar-foreground group-hover:text-sidebar-accent-foreground'
        )}
      >
        <Icon className="h-[20px] w-[20px]" strokeWidth={isActive ? 2 : 1.75} />
      </span>

      {/* Label */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.span
            variants={navLabelVariants}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="relative z-10 truncate font-body text-[13.5px]"
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Badge */}
      {item.badge != null && item.badge > 0 && (
        <AnimatePresence>
          {!isCollapsed && (
            <motion.span
              variants={badgeVariants}
              initial="collapsed"
              animate="expanded"
              exit="collapsed"
              transition={{ duration: 0.15, ease: 'easeInOut' }}
              className="relative z-10 ml-auto flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold leading-none"
            >
              {item.badge > 99 ? '99+' : item.badge}
            </motion.span>
          )}
        </AnimatePresence>
      )}
    </button>
  );

  if (isCollapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent
          side="right"
          sideOffset={12}
          className="bg-card border-border text-sidebar-accent-foreground font-body text-xs px-3 py-1.5 rounded-lg shadow-xl"
        >
          <span className="flex items-center gap-1.5">
            {item.badge != null && item.badge > 0 && (
              <Badge className="h-4 min-w-[16px] px-1 text-[9px] bg-primary text-primary-foreground border-0 rounded-full">
                {item.badge > 99 ? '99+' : item.badge}
              </Badge>
            )}
            {item.label}
          </span>
        </TooltipContent>
      </Tooltip>
    );
  }

  return button;
}

// ─── User Profile Section ─────────────────────────────────────────────────────
function UserProfileSection({ isCollapsed }: { isCollapsed: boolean }) {
  const { user, logout } = useAuthStore();

  const initials = useMemo(() => {
    if (!user?.name) return '??';
    const parts = user.name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return parts[0].slice(0, 2).toUpperCase();
  }, [user]);

  const roleLabel = useMemo(() => {
    if (!user?.role) return '';
    const labels: Record<string, string> = {
      super_admin: 'Super Admin',
      admin: 'Admin',
      support: 'Support',
      finance: 'Finance',
    };
    return labels[user.role] || user.role;
  }, [user]);

  const profile = (
    <div
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200',
        'hover:bg-sidebar-accent',
        isCollapsed ? 'justify-center px-0' : ''
      )}
    >
      <Avatar className={cn('shrink-0 border-2 border-border transition-colors', !isCollapsed && 'h-9 w-9')}>
        <AvatarImage src={user?.avatar} alt={user?.name || 'User'} />
        <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold font-body">
          {initials}
        </AvatarFallback>
      </Avatar>

      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            variants={navLabelVariants}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="flex flex-1 items-center justify-between min-w-0"
          >
            <div className="flex flex-col min-w-0">
              <span className="truncate text-[13px] font-semibold text-sidebar-accent-foreground font-body leading-tight">
                {user?.name || 'Unknown User'}
              </span>
              <span className="truncate text-[11px] text-sidebar-foreground/60 font-body leading-tight mt-0.5">
                {roleLabel}
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                logout();
              }}
              className="shrink-0 ml-1 flex items-center justify-center h-8 w-8 rounded-md text-sidebar-foreground/50 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring/50 cursor-pointer"
              aria-label="Log out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  if (isCollapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{profile}</TooltipTrigger>
        <TooltipContent
          side="right"
          sideOffset={12}
          className="bg-card border-border text-sidebar-accent-foreground font-body text-xs px-3 py-1.5 rounded-lg shadow-xl"
        >
          <span className="flex flex-col">
            <span className="font-semibold">{user?.name || 'User'}</span>
            <span className="text-sidebar-foreground/60">{roleLabel}</span>
          </span>
        </TooltipContent>
      </Tooltip>
    );
  }

  return profile;
}

// ─── Sidebar Brand ────────────────────────────────────────────────────────────
function SidebarBrand({ isCollapsed }: { isCollapsed: boolean }) {
  const brand = (
    <div
      className={cn(
        'flex items-center gap-3 px-3 py-4',
        isCollapsed ? 'justify-center px-0' : ''
      )}
    >
      {/* Logo */}
      <div className="relative shrink-0 flex items-center justify-center h-9 w-9 rounded-xl overflow-hidden bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] shadow-lg shadow-[#4F46E5]/20">
        <Image src="/learnova-logo.jpg" alt="Learnova" width={36} height={36} className="object-cover" />
      </div>

      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            variants={navLabelVariants}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="flex flex-col overflow-hidden"
          >
            <span className="font-display text-[16px] font-bold tracking-tight text-foreground leading-none">
              Learnova
            </span>
            <span className="font-body text-[10.5px] font-medium text-sidebar-foreground/40 tracking-wide uppercase leading-none mt-1">
              Admin Panel
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  if (isCollapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{brand}</TooltipTrigger>
        <TooltipContent
          side="right"
          sideOffset={12}
          className="bg-card border-border text-sidebar-accent-foreground font-body text-xs px-3 py-1.5 rounded-lg shadow-xl"
        >
          <span className="font-display font-semibold">Learnova</span>
        </TooltipContent>
      </Tooltip>
    );
  }

  return brand;
}

// ─── Collapse Toggle ──────────────────────────────────────────────────────────
function CollapseToggle({ isCollapsed, onClick }: { isCollapsed: boolean; onClick: () => void }) {
  const toggle = (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center justify-center w-full rounded-lg py-2 text-sidebar-foreground/50',
        'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
        'transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
        'cursor-pointer',
        isCollapsed ? 'px-0' : 'gap-2 px-3'
      )}
      aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
    >
      <motion.div
        animate={{ rotate: isCollapsed ? 180 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4 shrink-0" />
        ) : (
          <ChevronLeft className="h-4 w-4 shrink-0" />
        )}
      </motion.div>
      <AnimatePresence>
        {!isCollapsed && (
          <motion.span
            variants={navLabelVariants}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            transition={{ duration: 0.15, ease: 'easeInOut' }}
            className="text-[12px] font-medium font-body"
          >
            Collapse
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );

  if (isCollapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{toggle}</TooltipTrigger>
        <TooltipContent
          side="right"
          sideOffset={12}
          className="bg-card border-border text-sidebar-accent-foreground font-body text-xs px-3 py-1.5 rounded-lg shadow-xl"
        >
          Expand sidebar
        </TooltipContent>
      </Tooltip>
    );
  }

  return toggle;
}

// ─── Sidebar Inner Content ────────────────────────────────────────────────────
interface SidebarInnerProps {
  isCollapsed: boolean;
  onNavigate: (page: NavigationPage) => void;
  onToggleCollapse: () => void;
  isMobile?: boolean;
}

function SidebarInner({ isCollapsed, onNavigate, onToggleCollapse, isMobile }: SidebarInnerProps) {
  const currentPage = useNavigationStore((s) => s.currentPage);
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const hasRole = useAuthStore((s) => s.hasRole);

  // Filter nav items based on permissions and roles
  const visibleNavItems = useMemo(() => {
    return NAV_ITEMS.filter((item) => {
      // Check permission
      if (item.permission && !hasPermission(item.permission)) return false;
      // Check roles
      if (item.roles && item.roles.length > 0) {
        if (!item.roles.some((role) => hasRole(role as 'super_admin' | 'admin' | 'support' | 'finance'))) return false;
      }
      return true;
    });
  }, [hasPermission, hasRole]);

  const handleNavClick = useCallback(
    (page: NavigationPage) => {
      onNavigate(page);
    },
    [onNavigate]
  );

  return (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <SidebarBrand isCollapsed={isCollapsed} />

      <Separator className="mx-3 w-auto" />

      {/* Navigation items */}
      <ScrollArea className="flex-1 px-2 py-3">
        <nav className="flex flex-col gap-1" role="navigation" aria-label="Main navigation">
          {visibleNavItems.map((item) => (
            <NavItemButton
              key={item.id}
              item={item}
              isActive={currentPage === item.id}
              isCollapsed={isCollapsed}
              onClick={() => handleNavClick(item.id)}
            />
          ))}
        </nav>
      </ScrollArea>

      <Separator className="mx-3 w-auto" />

      {/* Bottom section */}
      <div className="px-2 py-2 flex flex-col gap-1">
        {/* User profile */}
        <UserProfileSection isCollapsed={isCollapsed} />

        {/* Collapse toggle (desktop only) */}
        {!isMobile && (
          <CollapseToggle isCollapsed={isCollapsed} onClick={onToggleCollapse} />
        )}
      </div>
    </div>
  );
}

// ─── Mobile Sidebar (Sheet) ───────────────────────────────────────────────────
function MobileSidebar() {
  const sidebarOpen = useNavigationStore((s) => s.sidebarOpen);
  const setSidebarOpen = useNavigationStore((s) => s.setSidebarOpen);
  const navigate = useNavigationStore((s) => s.navigate);

  const handleNavigate = useCallback(
    (page: NavigationPage) => {
      navigate(page);
      setSidebarOpen(false);
    },
    [navigate, setSidebarOpen]
  );

  return (
    <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <SheetContent
        side="left"
        className="w-[280px] p-0 bg-sidebar border-r border-sidebar-border [&>button]:hidden"
      >
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <div className="h-full">
          <SidebarInner
            isCollapsed={false}
            onNavigate={handleNavigate}
            onToggleCollapse={() => {}}
            isMobile
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ─── Main Sidebar Component ───────────────────────────────────────────────────
export function Sidebar() {
  const isMobile = useIsMobile();
  const sidebarCollapsed = useNavigationStore((s) => s.sidebarCollapsed);
  const toggleSidebarCollapse = useNavigationStore((s) => s.toggleSidebarCollapse);
  const navigate = useNavigationStore((s) => s.navigate);
  const currentPage = useNavigationStore((s) => s.currentPage);

  const handleNavigate = useCallback(
    (page: NavigationPage) => {
      navigate(page);
    },
    [navigate]
  );

  // Mobile: use Sheet overlay
  if (isMobile) {
    return <MobileSidebar />;
  }

  // Desktop: fixed sidebar
  return (
    <motion.aside
      variants={sidebarVariants}
      animate={sidebarCollapsed ? 'collapsed' : 'expanded'}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        'fixed left-0 top-0 z-40 h-screen flex flex-col',
        'bg-sidebar border-r border-sidebar-border',
        'overflow-hidden select-none'
      )}
      aria-label="Sidebar navigation"
    >
      {/* Subtle top gradient glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-primary/[0.04] to-transparent" />

      {/* Subtle left accent line */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-primary/30 via-primary/10 to-transparent" />

      <SidebarInner
        isCollapsed={sidebarCollapsed}
        onNavigate={handleNavigate}
        onToggleCollapse={toggleSidebarCollapse}
      />
    </motion.aside>
  );
}
