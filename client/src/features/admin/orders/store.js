import { create } from "zustand";
import { extractAdminOrders, updateAdminOrderStatus } from "./api";

export const useAdminOrdersStore = create((set) => ({
  orders: [],
  loading: true,
  updatingOrderId: "",

  fetchOrders: async () => {
    try {
      set({ loading: true });

      const response = await extractAdminOrders();

      set({
        orders: response?.items ?? [],
        loading: false,
      });
    } catch {
      set({
        orders: [],
        loading: false,
      });
    }
  },

  changeStatus: async (orderId, orderStatus) => {
    try {
      set({ updatingOrderId: orderId });

      const response = await updateAdminOrderStatus(orderId, orderStatus);

      if (!response?._id) {
        set({ updatingOrderId: "" });
        return;
      }

      set((state) => ({
        orders: state.orders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                orderStatus: response.orderStatus,
                deliveredAt:
                  response.deliveredAt || order.deliveredAt || null,
                returnedAt:
                  response.returnedAt || order.returnedAt || null,
              }
            : order,
        ),
        updatingOrderId: "",
      }));
    } catch {
      set({ updatingOrderId: "" });
    }
  },
}));