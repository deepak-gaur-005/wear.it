import { apiGet, apiPost } from "@/lib/api.js";

export function syncUser() {
  return apiPost("/auth/sync");
}

export function getMe() {
  return apiGet("/auth/me");
}