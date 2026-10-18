import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api";

function variantConfig(color, size) {
  const params = {};
  if (color) params.color = color;
  if (size) params.size = size;
  return { params };
}

export function getCustomerCart() {
  return apiGet("/customer/cart");
}

export function addCustomerCartItem({ productId, quantity, color, size }) {
  return apiPost("/customer/cart/items", {
    productId,
    quantity,
    color,
    size,
  });
}

export function syncCustomerCart(items) {
  return apiPost("/customer/cart/sync", { items });
}

export function increaseCustomerCartItem(productId, color, size) {
  return apiPatch(
    `/customer/cart/items/${encodeURIComponent(productId)}/increase`,
    {},
    variantConfig(color, size),
  );
}

export function removeCustomerCartItem(productId, color, size) {
  return apiDelete(
    `/customer/cart/items/${encodeURIComponent(productId)}`,
    variantConfig(color, size),
  );
}

export function getCustomerPoints() {
  return apiGet("/customer/checkout/points");
}
