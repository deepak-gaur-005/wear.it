import { apiGet, apiPatch } from "@/lib/api";

export async function getCustomerOrders() {
  return apiGet("/customer/orders");
}

export async function returnCustomerOrder(orderId) {
  return apiPatch(`/customer/orders/${orderId}/return`);
}