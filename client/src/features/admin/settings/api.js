import { apiGet, apiPost } from "@/lib/api";

export async function getAdminBanners() {
  return apiGet("/admin/settings/banners");
}

export async function uploadAdminBanners(formData) {
  return apiPost("/admin/settings/banners", formData);
}
