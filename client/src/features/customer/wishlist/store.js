import { create } from "zustand";
import { toast } from "sonner";
import { getCustomerWishlist, removeCustomerWishlistItem } from "./api";

export const useCustomerWishlistStore = create((set) => ({
  isOpen: false,
  items: [],
  loading: false,

  setOpen: (isOpen) => set({ isOpen }),

  setItems: (items) => set({ items }),

  loadWishlist: async () => {
    set({ loading: true });

    try {
      const response = await getCustomerWishlist();
      set({ items: response?.items ?? [] });
    } catch (error) {
      toast.error(error.message || "Failed to load wishlist");
    } finally {
      set({ loading: false });
    }
  },

  removeItem: async (productId) => {
    try {
      const response = await removeCustomerWishlistItem(productId);
      set({ items: response?.items ?? [] });
    } catch (error) {
      toast.error(error.message || "Failed to remove item from wishlist");
    }
  },

  clear: () => set({ isOpen: false, items: [], loading: false }),
}));