import { create } from "zustand";
import { getCustomerWishlist } from "./api";

export const useCustomerWishlistStore = create((set) => ({
  items: [],
  loading: false,
  setItems: (items) => set({ items }),
  loadWishlist: async () => {
    set({ loading: true });

    try {
      const response = await getCustomerWishlist();
      set({ items: response?.items ?? [] });
    } finally {
      set({ loading: false });
    }
  },
}));