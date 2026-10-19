import { apiGet, apiPatch } from "@/lib/api";

export async function extractAdminOrders() {
  return apiGet("/admin/orders");
}

export async function updateAdminOrderStatus(orderId, orderStatus) {
  return apiPatch(`/admin/orders/${orderId}/status`, { orderStatus });
}