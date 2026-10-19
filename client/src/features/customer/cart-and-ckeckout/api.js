import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api";
import { getCustomerAddresses } from "../profile/api";

function buildCartItemUrl(item, action) {
  const searchParams = new URLSearchParams();

  if (item.color) searchParams.set("color", item.color);
  if (item.size) searchParams.set("size", item.size);

  const query = searchParams.toString();
  const actionPath = action ? `/${action}` : "";
  const path = `/customer/cart/items/${item.productId}${actionPath}`;

  return query ? `${path}?${query}` : path;
}

export async function getCustomerCart() {
  return apiGet("/customer/cart");
}

export async function addCustomerCartItem(body) {
  return apiPost("/customer/cart/items", body);
}

export async function increaseCustomerCartItem(item) {
  return apiPatch(buildCartItemUrl(item, "increase"));
}

export async function decreaseCustomerCartItem(item) {
  return apiPatch(buildCartItemUrl(item, "decrease"));
}

export async function removeCustomerCartItem(item) {
  return apiDelete(buildCartItemUrl(item));
}

export async function syncCustomerCart(body) {
  return apiPost("/customer/cart/sync", body);
}

// Checkout APIs

export async function getCheckoutPoints() {
  return apiGet("/customer/checkout/points");
}

export async function getCheckoutData() {
  const [cart, addresses, checkoutPoints] = await Promise.all([
    getCustomerCart(),
    getCustomerAddresses(),
    getCheckoutPoints(),
  ]);

  const safeCart = cart ?? { items: [], totalQuantity: 0 };
  const safeAddresses = addresses ?? { items: [] };

  const subtotal = safeCart.items.reduce(
    (sum, item) => sum + item.finalPrice * item.quantity,
    0,
  );

  return {
    cart: safeCart,
    addresses: safeAddresses,
    subtotal,
    points: checkoutPoints.points ?? 0,
  };
}

export async function applyCustomerPromo(body) {
  return apiPost("/customer/promos/apply", body);
}

export async function createCheckoutSession(body) {
  return apiPost("/customer/checkout/create-session", body);
}

export async function payWithPointsCheckout(body) {
  return apiPost("/customer/checkout/pay-with-points", body);
}

export async function confirmCheckout(body) {
  return apiPost("/customer/checkout/confirm", body);
}