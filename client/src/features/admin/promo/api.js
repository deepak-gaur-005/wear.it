import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api";

export async function getAdminPromos() {
  return apiGet("/admin/promos");
}

export async function createAdminPromo(body) {
  return apiPost("/admin/promos", body);
}

export async function updateAdminPromo(promoId, body) {
  return apiPatch(`/admin/promos/${promoId}`, body);
}

export async function deleteAdminPromo(promoId) {
  return apiDelete(`/admin/promos/${promoId}`);
}
