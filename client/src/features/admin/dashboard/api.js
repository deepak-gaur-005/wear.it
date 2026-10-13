import { apiGet } from "@/lib/api";

export function getAdminDashboardStats() {
  return apiGet("/admin/dashboard/lite");
}
