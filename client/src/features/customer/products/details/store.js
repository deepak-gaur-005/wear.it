import { create } from "zustand";
import { getCustomerProductDetails } from "../api";
import { getCoverImage } from "../product-list-shared";
import { toast } from "sonner";
import { useCustomerWishlistStore } from "../../wishlist/store";
import { useCustomerCartAndCheckoutStore } from "../../cart-and-ckeckout/store";

const defaultState = {
  loading: true,
  data: null,
  error: "",
  selectedImage: "",
  selectedColor: "",
  selectedSize: "",
};

export const useCustomerProductDetailsStore = create((set, get) => ({
  ...defaultState,

  loadProduct: async (productId) => {
    if (!productId) {
      set({
        loading: false,
        data: null,
        error: "Product not found.",
        selectedImage: "",
        selectedColor: "",
        selectedSize: "",
      });
      return;
    }

    set({
      loading: true,
      data: null,
      error: "",
      selectedImage: "",
      selectedColor: "",
      selectedSize: "",
    });

    try {
      const response = await getCustomerProductDetails(productId);
      const product = response?.product ?? null;

      set({
        loading: false,
        data: response ?? null,
        error: "",
        selectedImage: product ? getCoverImage(product) : "",
        selectedColor: product?.colors?.[0] || "",
        selectedSize: product?.sizes?.[0] || "",
      });
    } catch (error) {
      set({
        loading: false,
        data: null,
        error:
          error instanceof Error ? error.message : "Failed to load product.",
        selectedImage: "",
        selectedColor: "",
        selectedSize: "",
      });
    }
  },

  clear: () => set(defaultState),

  setSelectedImage: (value) => set({ selectedImage: value }),

  setSelectedColor: (value) => set({ selectedColor: value }),

  setSelectedSize: (value) => set({ selectedSize: value }),

  toggleWishlist: async (
    isLoaded,
    isBootstrapped,
    isSignedIn,
  ) => {
    const product = get().data?.product ?? null;

    if (!product) return;

    await useCustomerWishlistStore
      .getState()
      .toggleItem(product._id, isLoaded, isBootstrapped, isSignedIn);
  },

  addToCart: async (isLoaded, isBootstrapped, isSignedIn) => {
    const { data, selectedColor, selectedSize } = get();
    const product = data?.product ?? null;

    if (!product || product.stock < 1) return;

    if (!isLoaded || !isBootstrapped) {
      toast.error("Try again");
      return;
    }

    await useCustomerCartAndCheckoutStore.getState().addItem(
      {
        productId: product._id,
        quantity: 1,
        color: selectedColor || undefined,
        size: selectedSize || undefined,
        title: product.title,
        brand: product.brand,
        image: getCoverImage(product),
        finalPrice: product.salePercentage
          ? product.price -
            (product.price * product.salePercentage) / 100
          : product.price,
      },
      isSignedIn,
    );
  },
}));
