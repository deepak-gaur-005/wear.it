import { create } from "zustand";
import { getCustomerOrders, returnCustomerOrder } from "./api";
import { toast } from "sonner";

export const useCustomerOrdersStore = create((set, get) => ({
  isOpen: false,
  loading: false,
  items: [],

  loadOrders: async () => {
    try {
      set({ loading: true });

      const response = await getCustomerOrders();

      set({ items: response?.items ?? [] });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load your orders",
      );
    } finally {
      set({ loading: false });
    }
  },

  openOrders: async () => {
    set({ isOpen: true });
    await get().loadOrders();
  },

  closeOrders: () => set({ isOpen: false }),

  clear: () => {
    set({
      isOpen: false,
      loading: false,
      items: [],
    });
  },

  returnOrder: async (orderId) => {
    try {
      const response = await returnCustomerOrder(orderId);

      set((state) => ({
        items: state.items.map((item) =>
          item._id === orderId
            ? {
                ...item,
                orderStatus: response?.orderStatus ?? item.orderStatus,
                returnedAt: response?.returnedAt ?? item.returnedAt ?? null,
              }
            : item,
        ),
      }));
      toast.success("Order returned successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to return order",
      );
    }
  },
}));