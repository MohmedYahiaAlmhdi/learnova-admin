import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, AuthTokens, UserRole } from '@/shared/types';
import { ROLE_PERMISSIONS } from '@/shared/constants';
import { mockUsers } from '@/shared/mocks';

interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  hasRole: (role: UserRole) => boolean;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, _password: string) => {
        set({ isLoading: true, error: null });
        try {
          // Mock login - simulate API call
          await new Promise((resolve) => setTimeout(resolve, 800));

          const user = mockUsers.find(
            (u) => u.email.toLowerCase() === email.toLowerCase()
          );

          if (!user || (email !== 'admin@learnova.com' && email !== 'john.doe@example.com')) {
            throw new Error('Invalid credentials');
          }

          const adminUser: User = {
            ...user,
            role: 'super_admin',
            name: email === 'admin@learnova.com' ? 'Super Admin' : user.name,
            status: 'active',
          };

          const tokens: AuthTokens = {
            accessToken: 'mock_access_token_' + Date.now(),
            refreshToken: 'mock_refresh_token_' + Date.now(),
            expiresIn: 3600,
          };

          if (typeof window !== 'undefined') {
            localStorage.setItem('learnova_access_token', tokens.accessToken);
            localStorage.setItem('learnova_refresh_token', tokens.refreshToken);
          }

          set({
            user: adminUser,
            tokens,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Login failed',
            isLoading: false,
          });
          throw error;
        }
      },

      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('learnova_access_token');
          localStorage.removeItem('learnova_refresh_token');
        }
        set({
          user: null,
          tokens: null,
          isAuthenticated: false,
          error: null,
        });
      },

      setUser: (user) => set({ user }),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      clearError: () => set({ error: null }),

      hasRole: (role) => {
        const { user } = get();
        if (!user) return false;
        if (user.role === 'super_admin') return true;
        return user.role === role;
      },

      hasPermission: (permission) => {
        const { user } = get();
        if (!user) return false;
        if (user.role === 'super_admin') return true;
        const permissions = ROLE_PERMISSIONS[user.role] || [];
        return permissions.includes('*') || permissions.includes(permission);
      },

      hasAnyPermission: (permissions) => {
        return permissions.some((p) => get().hasPermission(p));
      },
    }),
    {
      name: 'learnova-auth',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
