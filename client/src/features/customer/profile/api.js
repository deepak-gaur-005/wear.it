import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api";

export async function getCustomerAddresses() {
  return apiGet("/customer/addresses");
}

export async function createCustomerAddresses(body) {
  return apiPost("/customer/addresses", body);
}

export async function updateCustomerAddresses(addressId, body) {
  return apiPatch(`/customer/addresses/${addressId}`, body);
}

export async function deleteCustomerAddress(addressId) {
  return apiDelete(`/customer/addresses/${addressId}`);
}
