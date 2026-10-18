import { apiDelete, apiGet, apiPost } from "@/lib/api";

export function getCustomerWishlist() {
  return apiGet("/customer/wishlist");
}

export function addCustomerWishlist({ productId }) {
  return apiPost("/customer/wishlist/items", { productId });
}

export function removeCustomerWishlistItem(productId) {
  return apiDelete(`/customer/wishlist/items/${productId}`);
}