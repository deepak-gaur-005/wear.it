import { apiDelete, apiGet, apiPatch } from "@/lib/api";

export async function getAdminReviews({ status = "", page = 1, limit = 25 } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (status) params.set("status", status);

  return apiGet(`/admin/reviews?${params.toString()}`);
}

export async function updateAdminReviewStatus(reviewId, status) {
  return apiPatch(`/admin/reviews/${reviewId}/moderation`, { status });
}

export async function deleteAdminReview(reviewId) {
  return apiDelete(`/admin/reviews/${reviewId}`);
}
