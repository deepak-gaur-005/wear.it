import { create } from "zustand";
import { getAdminDashboardLite } from "./api";

const fallbackStats = {
  totalProducts: 0,
  totalCategories: 0,
  totalSales: 0,
  totalOrders: 0,
  totalReturnedOrders: 0,
};

export const useAdminDashboardLiteStore = create((set) => ({
  stats: fallbackStats,
  loading: true,
  hasLoaded: false,

  fetchDashboard: async () => {
    try {
      set({ loading: true });

      const response = await getAdminDashboardLite();

      set({
        stats: response ?? fallbackStats,
        loading: false,
        hasLoaded: true,
      });
    } catch {
      set({
        stats: fallbackStats,
        loading: false,
        hasLoaded: true,
      });
    }
  },
}));