import { create } from "zustand";
import { toast } from "sonner";
import {
  addCustomerCartItem,
  getCustomerCart,
  getCustomerPoints,
  increaseCustomerCartItem,
  removeCustomerCartItem,
  syncCustomerCart,
} from "./api";

const emptyCart = { items: [], totalQuantity: 0 };

function withTotalQuantity(items) {
  return {
    items,
    totalQuantity: items.reduce((total, item) => total + item.quantity, 0),
  };
}

function matchesVariant(item, productId, color, size) {
  return (
    item.productId === productId &&
    (item.color || "") === (color || "") &&
    (item.size || "") === (size || "")
  );
}

const useCustomerCartAndCheckoutStore = create((set, get) => ({
  isOpen: false,
  cart: emptyCart,
  points: 0,
  loading: false,

  setOpen: (isOpen) => set({ isOpen }),

  loadCart: async (isSignedIn) => {
    if (!isSignedIn) {
      set({ cart: emptyCart });
      return;
    }

    if (get().loading) return;
    set({ loading: true });

    try {
      const guestItems = get().cart.items.filter((item) => item.isGuest);
      const response = guestItems.length
        ? await syncCustomerCart(
            guestItems.map(({ productId, quantity, color, size }) => ({
              productId,
              quantity,
              color,
              size,
            })),
          )
        : await getCustomerCart();

      set({ cart: response });
    } catch (error) {
      toast.error(error.message || "Failed to load cart");
    } finally {
      set({ loading: false });
    }
  },

  loadPoints: async (isSignedIn) => {
    if (!isSignedIn) {
      set({ points: 0 });
      return;
    }

    try {
      const response = await getCustomerPoints();
      set({ points: response.points });
    } catch (error) {
      toast.error(error.message || "Failed to load reward points");
    }
  },

  addItem: async (item, isSignedIn) => {
    if (isSignedIn) {
      try {
        const response = await addCustomerCartItem(item);
        set({ cart: response });
      } catch (error) {
        toast.error(error.message || "Failed to add item to cart");
      }
      return;
    }

    const items = [...get().cart.items];
    const itemIndex = items.findIndex((current) =>
      matchesVariant(current, item.productId, item.color, item.size),
    );

    if (itemIndex >= 0) {
      items[itemIndex] = {
        ...items[itemIndex],
        quantity: items[itemIndex].quantity + item.quantity,
      };
    } else {
      items.push({ ...item, isGuest: true });
    }

    set({ cart: withTotalQuantity(items) });
    toast.success("Added to cart");
  },

  increaseItem: async (productId, color, size) => {
    const item = get().cart.items.find((current) =>
      matchesVariant(current, productId, color, size),
    );
    if (!item) return;

    if (item.isGuest) {
      const items = get().cart.items.map((current) =>
        matchesVariant(current, productId, color, size)
          ? { ...current, quantity: current.quantity + 1 }
          : current,
      );
      set({ cart: withTotalQuantity(items) });
      return;
    }

    try {
      const response = await increaseCustomerCartItem(productId, color, size);
      set({ cart: response });
    } catch (error) {
      toast.error(error.message || "Failed to update cart quantity");
    }
  },

  removeItem: async (productId, color, size) => {
    const item = get().cart.items.find((current) =>
      matchesVariant(current, productId, color, size),
    );
    if (!item) return;

    if (item.isGuest) {
      const items = get().cart.items.filter(
        (current) => !matchesVariant(current, productId, color, size),
      );
      set({ cart: withTotalQuantity(items) });
      return;
    }

    try {
      const response = await removeCustomerCartItem(productId, color, size);
      set({ cart: response });
    } catch (error) {
      toast.error(error.message || "Failed to remove item from cart");
    }
  },
}));

export default useCustomerCartAndCheckoutStore;
