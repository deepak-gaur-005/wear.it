import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api";

function buildReviewQuery({ sort = "newest", page = 1, limit = 10 } = {}) {
  const params = new URLSearchParams({
    sort,
    page: String(page),
    limit: String(limit),
  });

  return params.toString();
}

export async function getCustomerProductReviews(productId, options) {
  return apiGet(
    `/customer/products/${productId}/reviews?${buildReviewQuery(options)}`,
  );
}

export async function getMyCustomerProductReview(productId) {
  return apiGet(`/customer/products/${productId}/reviews/mine`);
}

export async function createCustomerProductReview(productId, body) {
  return apiPost(`/customer/products/${productId}/reviews`, body);
}

export async function updateCustomerProductReview(reviewId, body) {
  return apiPatch(`/customer/reviews/${reviewId}`, body);
}

export async function deleteCustomerProductReview(reviewId) {
  return apiDelete(`/customer/reviews/${reviewId}`);
}
