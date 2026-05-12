'use client';

import React from 'react';
import { useAuthStore } from '@/app/store';
import type { UserRole } from '@/shared/types';

interface RoleGuardProps {
  children: React.ReactNode;
  roles: UserRole[];
  fallback?: React.ReactNode;
}

export function RoleGuard({ children, roles, fallback }: RoleGuardProps) {
  const { user } = useAuthStore();

  if (!user) return null;

  if (user.role === 'super_admin') return <>{children}</>;

  if (!roles.includes(user.role)) {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
}
