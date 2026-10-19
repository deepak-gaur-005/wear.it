import { create } from "zustand";
import { getCustomerHomeDateOverview } from "./api";

const fallbackData = {
  banners: [],
  categories: [],
  recentProducts: [],
  coupons: [],
};

export const useCustomerHomeStore = create((set) => ({
  loading: true,
  data: fallbackData,

  loadHome: async () => {
    try {
      set({ loading: true });

      const response = await getCustomerHomeDateOverview();

      set({
        data: response ?? fallbackData,
        loading: false,
      });
    } catch {
      set({
        data: fallbackData,
        loading: false,
      });
    }
  },

  clear: () => {
    set({ data: fallbackData, loading: true });
  },
}));