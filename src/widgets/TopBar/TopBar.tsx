'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Command,
} from 'lucide-react';

import { useNavigationStore, useAuthStore } from '@/app/store';
import { useIsMobile } from '@/hooks/use-mobile';
import { SIDEBAR_WIDTH, SIDEBAR_COLLAPSED_WIDTH, NAV_ITEMS } from '@/shared/constants';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';

// ── Page title map ──────────────────────────────────────────────
const PAGE_TITLES: Record<string, string> = {
  dashboard: 'Dashboard',
  users: 'Users',
  instructors: 'Instructors',
  courses: 'Courses',
  agents: 'Agents & POS',
  categories: 'Categories',
  finance: 'Finance',
  settings: 'Settings',
  'audit-logs': 'Audit Log',
  auth: 'Authentication',
  'not-found': 'Not Found',
  unauthorized: 'Unauthorized',
};

// ── Animation ───────────────────────────────────────────────────
const topbarVariants = {
  hidden: { opacity: 0, y: -8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

// ── Component ───────────────────────────────────────────────────
export function TopBar() {
  const isMobile = useIsMobile();

  // Navigation store
  const currentPage = useNavigationStore((s) => s.currentPage);
  const sidebarCollapsed = useNavigationStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useNavigationStore((s) => s.toggleSidebar);
  const setCommandPaletteOpen = useNavigationStore((s) => s.setCommandPaletteOpen);

  // Auth store
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  // Derived
  const pageTitle = PAGE_TITLES[currentPage] ?? 'Dashboard';
  const sidebarWidth = sidebarCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH;
  const unreadCount = 3; // placeholder for notification count

  // User initials for avatar fallback
  const initials = !user?.name
    ? 'U'
    : user.name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

  // User display role
  const displayRole = (() => {
    if (!user?.role) return '';
    const item = NAV_ITEMS.find((n) => n.id === user.role);
    if (item) return item.label;
    return user.role
      .split('_')
      .map((w) => w[0].toUpperCase() + w.slice(1))
      .join(' ');
  })();

  // Keyboard shortcut: Cmd/Ctrl + K → open command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [setCommandPaletteOpen]);

  // Sidebar left offset — hidden on mobile
  const leftStyle = isMobile
    ? undefined
    : { left: `${sidebarWidth}px` };

  return (
    <motion.header
      variants={topbarVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        'fixed top-0 right-0 z-40',
        'flex items-center',
        'h-[64px] px-4 md:px-6',
        'topbar-gradient',
        // Subtle bottom border
        'border-b border-border/60',
      )}
      style={{
        left: leftStyle?.left,
        width: leftStyle ? `calc(100% - ${sidebarWidth}px)` : '100%',
      }}
    >
      {/* ── Left: hamburger + breadcrumb ──────────────────── */}
      <div className="flex items-center gap-3 min-w-0 flex-shrink-0">
        {/* Mobile hamburger */}
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="size-9 text-muted-foreground hover:text-foreground"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <Menu className="size-[18px]" />
          </Button>
        )}

        {/* Breadcrumb / Page title */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground truncate">
            {isMobile ? pageTitle : `Home`}
          </span>
          {!isMobile && (
            <>
              <ChevronDown className="size-3 text-muted-foreground/60 -rotate-90" />
              <span className="text-sm font-semibold text-foreground truncate">
                {pageTitle}
              </span>
            </>
          )}
        </nav>
      </div>

      {/* ── Center: search ───────────────────────────────── */}
      <div className="flex-1 flex justify-center px-4">
        <button
          type="button"
          onClick={() => setCommandPaletteOpen(true)}
          className={cn(
            'hidden sm:flex items-center gap-3',
            'w-full max-w-md',
            'h-9 px-3.5 rounded-lg',
            'bg-secondary/60 text-muted-foreground',
            'border border-border/50',
            'cursor-pointer select-none',
            'transition-colors duration-150',
            'hover:bg-secondary hover:border-border',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
          )}
          aria-label="Search or press Command+K"
        >
          <Search className="size-[15px] shrink-0" />
          <span className="text-sm flex-1 text-left truncate">
            Search courses, users, settings...
          </span>
          <kbd
            className={cn(
              'inline-flex items-center gap-0.5',
              'h-5 px-1.5 rounded-[4px]',
              'bg-background/60 border border-border/50',
              'text-[11px] font-mono text-muted-foreground/70',
              'pointer-events-none',
            )}
          >
            <Command className="size-3" />
            <span>K</span>
          </kbd>
        </button>

        {/* Mobile: icon-only search */}
        <Button
          variant="ghost"
          size="icon"
          className="sm:hidden size-9 text-muted-foreground hover:text-foreground"
          onClick={() => setCommandPaletteOpen(true)}
          aria-label="Search"
        >
          <Search className="size-[18px]" />
        </Button>
      </div>

      {/* ── Right: notifications + user menu ─────────────── */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {/* Notification bell */}
        <Button
          variant="ghost"
          size="icon"
          className="relative size-9 text-muted-foreground hover:text-foreground"
          aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        >
          <Bell className="size-[18px]" />
          {unreadCount > 0 && (
            <span
              className={cn(
                'absolute top-1.5 right-1.5',
                'flex items-center justify-center',
                'size-4 rounded-full',
                'bg-destructive text-destructive-foreground',
                'text-[10px] font-bold leading-none',
              )}
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>

        <Separator orientation="vertical" className="mx-1.5 h-6 bg-border/50" />

        {/* User avatar dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                'relative flex items-center gap-2.5 h-9 px-2',
                'rounded-lg',
                'hover:bg-secondary/60',
                'transition-colors duration-150',
                'cursor-pointer',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
              )}
              aria-label="User menu"
            >
              <Avatar className="size-7">
                {user?.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
                <AvatarFallback className="bg-primary/15 text-primary text-[11px] font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:inline-block text-sm font-medium text-foreground truncate max-w-[120px]">
                {user?.name ?? 'User'}
              </span>
              <ChevronDown className="size-3.5 text-muted-foreground hidden md:inline-block" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="w-56"
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-1 py-1">
                <p className="text-sm font-medium leading-none">
                  {user?.name ?? 'User'}
                </p>
                <p className="text-xs text-muted-foreground leading-none mt-1">
                  {user?.email ?? 'user@example.com'}
                </p>
                {displayRole && (
                  <Badge
                    variant="secondary"
                    className="mt-1.5 w-fit text-[10px] px-1.5 py-0 h-5"
                  >
                    {displayRole}
                  </Badge>
                )}
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="cursor-pointer gap-2.5 py-2">
              <User className="size-4" />
              <span>Profile</span>
            </DropdownMenuItem>

            <DropdownMenuItem className="cursor-pointer gap-2.5 py-2">
              <Settings className="size-4" />
              <span>Settings</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              variant="destructive"
              className="cursor-pointer gap-2.5 py-2"
              onClick={() => logout()}
            >
              <LogOut className="size-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  );
}
