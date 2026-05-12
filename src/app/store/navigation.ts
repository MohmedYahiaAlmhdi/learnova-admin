import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { NavigationPage } from '@/shared/types';
import { SIDEBAR_COLLAPSED_WIDTH, SIDEBAR_WIDTH } from '@/shared/constants';

interface NavigationState {
  currentPage: NavigationPage;
  previousPage: NavigationPage | null;
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  sidebarWidth: number;
  commandPaletteOpen: boolean;
}

interface NavigationActions {
  navigate: (page: NavigationPage) => void;
  goBack: () => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebarCollapse: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
}

export const useNavigationStore = create<NavigationState & NavigationActions>()(
  persist(
    (set) => ({
      currentPage: 'auth',
      previousPage: null,
      sidebarOpen: false,
      sidebarCollapsed: false,
      sidebarWidth: SIDEBAR_WIDTH,
      commandPaletteOpen: false,

      navigate: (page) =>
        set((state) => ({
          previousPage: state.currentPage,
          currentPage: page,
          sidebarOpen: false,
        })),

      goBack: () =>
        set((state) => {
          if (state.previousPage) {
            return { currentPage: state.previousPage, previousPage: null };
          }
          return state;
        }),

      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      toggleSidebarCollapse: () =>
        set((state) => ({
          sidebarCollapsed: !state.sidebarCollapsed,
          sidebarWidth: !state.sidebarCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH,
        })),

      setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
    }),
    {
      name: 'learnova-navigation',
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        sidebarWidth: state.sidebarWidth,
      }),
    }
  )
);
