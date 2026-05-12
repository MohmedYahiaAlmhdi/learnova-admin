'use client';

import React, { useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppProviders } from '@/app/providers';
import { useNavigationStore, useAuthStore } from '@/app/store';
import { Sidebar } from '@/widgets/Sidebar';
import { TopBar } from '@/widgets/TopBar';
import { LoginPage } from '@/views/Auth';
import { SIDEBAR_COLLAPSED_WIDTH, SIDEBAR_WIDTH, TOPBAR_HEIGHT } from '@/shared/constants';
import { useIsMobile } from '@/hooks/use-mobile';

const DashboardPage = lazy(() => import('@/views/Dashboard/DashboardPage').then(m => ({ default: m.DashboardPage })));
const UsersPage = lazy(() => import('@/views/Users/UsersPage').then(m => ({ default: m.UsersPage })));
const InstructorsPage = lazy(() => import('@/views/Instructors/InstructorsPage').then(m => ({ default: m.InstructorsPage })));
const CoursesPage = lazy(() => import('@/views/Courses/CoursesPage').then(m => ({ default: m.CoursesPage })));
const AgentsPage = lazy(() => import('@/views/Agents/AgentsPage').then(m => ({ default: m.AgentsPage })));
const CategoriesPage = lazy(() => import('@/views/Categories/CategoriesPage').then(m => ({ default: m.CategoriesPage })));
const FinancePage = lazy(() => import('@/views/Finance/FinancePage').then(m => ({ default: m.FinancePage })));
const AuditLogsPage = lazy(() => import('@/views/AuditLogs/AuditLogsPage').then(m => ({ default: m.AuditLogsPage })));
const SettingsPage = lazy(() => import('@/views/Settings/SettingsPage').then(m => ({ default: m.SettingsPage })));

const PAGE_TITLES: Record<string, { title: string; description: string }> = {
  dashboard: { title: 'Dashboard', description: 'Overview of your platform performance' },
  users: { title: 'User Management', description: 'Manage platform users and permissions' },
  instructors: { title: 'Instructors', description: 'Review and manage instructor applications' },
  courses: { title: 'Courses', description: 'Manage course content and approvals' },
  agents: { title: 'Agents & POS', description: 'Manage agents and point of sale' },
  categories: { title: 'Categories', description: 'Organize course categories' },
  finance: { title: 'Finance', description: 'Financial overview and payouts' },
  'audit-logs': { title: 'Audit Log', description: 'Track system activity and changes' },
  settings: { title: 'Settings', description: 'Configure system settings' },
};

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-96">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

function PageContent() {
  const currentPage = useNavigationStore((s) => s.currentPage);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isMobile = useIsMobile();
  const sidebarCollapsed = useNavigationStore((s) => s.sidebarCollapsed);
  const sidebarWidth = isMobile ? 0 : sidebarCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH;

  useEffect(() => {
    if (!isAuthenticated) {
      useNavigationStore.getState().navigate('auth');
    }
  }, [isAuthenticated]);

  if (!isAuthenticated || currentPage === 'auth') {
    return <LoginPage />;
  }

  const pageInfo = PAGE_TITLES[currentPage] || { title: 'Page', description: '' };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'users':
        return <UsersPage />;
      case 'instructors':
        return <InstructorsPage />;
      case 'courses':
        return <CoursesPage />;
      case 'agents':
        return <AgentsPage />;
      case 'categories':
        return <CategoriesPage />;
      case 'finance':
        return <FinancePage />;
      case 'audit-logs':
        return <AuditLogsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <TopBar />

      <motion.div
        animate={{ marginLeft: sidebarWidth }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="min-h-screen flex flex-col"
      >
        <div style={{ marginTop: TOPBAR_HEIGHT }} />

        <main className="flex-1 p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <Suspense fallback={<PageLoader />}>
                {renderPage()}
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </main>
      </motion.div>
    </div>
  );
}

export default function Home() {
  return (
    <AppProviders>
      <PageContent />
    </AppProviders>
  );
}
