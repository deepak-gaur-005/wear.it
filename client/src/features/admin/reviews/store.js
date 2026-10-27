import { create } from "zustand";
import {
  deleteAdminReview,
  getAdminReviews,
  updateAdminReviewStatus,
} from "./api";

const PAGE_SIZE = 25;

export const useAdminReviewsStore = create((set, get) => ({
  items: [],
  pagination: { page: 1, limit: PAGE_SIZE, total: 0, totalPages: 0 },
  status: "",
  loading: false,
  error: "",
  updatingReviewId: "",
  deletingReviewId: "",

  setStatus: (status) => set({ status, error: "" }),
  setPage: (page) => set({ pagination: { ...get().pagination, page } }),

  fetchReviews: async () => {
    const { status, pagination } = get();
    set({ loading: true, error: "" });

    try {
      const response = await getAdminReviews({
        status,
        page: pagination.page,
        limit: PAGE_SIZE,
      });
      set({
        items: response.items,
        pagination: response.pagination,
        loading: false,
      });
    } catch (error) {
      set({
        items: [],
        loading: false,
        error:
          error instanceof Error
            ? error.message
            : "Could not load reviews.",
      });
    }
  },

  setReviewStatus: async (reviewId, nextStatus) => {
    set({ updatingReviewId: reviewId, error: "" });

    try {
      await updateAdminReviewStatus(reviewId, nextStatus);
      set((state) => ({
        items: state.items.map((review) =>
          review._id === reviewId
            ? { ...review, status: nextStatus }
            : review,
        ),
        updatingReviewId: "",
      }));
      await get().fetchReviews();
    } catch (error) {
      set({
        updatingReviewId: "",
        error:
          error instanceof Error
            ? error.message
            : "Could not update review moderation.",
      });
    }
  },

  removeReview: async (reviewId) => {
    set({ deletingReviewId: reviewId, error: "" });

    try {
      await deleteAdminReview(reviewId);
      set((state) => {
        const remainingItems = state.items.filter(
          (review) => review._id !== reviewId,
        );
        const page =
          remainingItems.length === 0 && state.pagination.page > 1
            ? state.pagination.page - 1
            : state.pagination.page;

        return {
          items: remainingItems,
          pagination: {
            ...state.pagination,
            page,
            total: Math.max(state.pagination.total - 1, 0),
          },
          deletingReviewId: "",
        };
      });
      await get().fetchReviews();
    } catch (error) {
      set({
        deletingReviewId: "",
        error:
          error instanceof Error
            ? error.message
            : "Could not delete review.",
      });
    }
  },
}));
