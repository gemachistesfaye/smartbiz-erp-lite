import { create } from 'zustand';
import { STORAGE_KEYS } from '@/lib/constants';

interface UIState {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  setSidebarOpen: (open: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  sidebarCollapsed: localStorage.getItem(STORAGE_KEYS.SIDEBAR) === 'collapsed',

  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  setSidebarCollapsed: (collapsed) => {
    localStorage.setItem(STORAGE_KEYS.SIDEBAR, collapsed ? 'collapsed' : 'expanded');
    set({ sidebarCollapsed: collapsed });
  },

  toggleSidebar: () =>
    set((state) => {
      const newCollapsed = !state.sidebarCollapsed;
      localStorage.setItem(STORAGE_KEYS.SIDEBAR, newCollapsed ? 'collapsed' : 'expanded');
      return { sidebarCollapsed: newCollapsed };
    }),
}));
