import { create } from "zustand";
import { toast } from "sonner";
import {
  addCustomerWishlist,
  getCustomerWishlist,
  removeCustomerWishlistItem,
} from "./api";

export const useCustomerWishlistStore = create((set, get) => ({
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

  toggleItem: async (productId, isLoaded, isBootstrapped, isSignedIn) => {
    if (!productId) return;

    if (!isLoaded || !isBootstrapped || !isSignedIn) {
      toast.error("Sign in to save");
      return;
    }

    const isActive = get().items.some((item) => item.productId === productId);

    try {
      const response = isActive
        ? await removeCustomerWishlistItem(productId)
        : await addCustomerWishlist({ productId });

      set({ items: response?.items ?? [] });
      toast.success(isActive ? "Removed" : "Saved");
    } catch {
      toast.error("Failed to toggle wishlist items");
    }
  },

  clear: () => set({ isOpen: false, items: [], loading: false }),
}));