import { useCallback, useEffect, useState } from "react";
import {
  createCustomerProductReview,
  deleteCustomerProductReview,
  getCustomerProductReviews,
  getMyCustomerProductReview,
  updateCustomerProductReview,
} from "./api";

const PAGE_SIZE = 10;

export function useCustomerProductReviews(productId, isSignedIn) {
  const [sort, setSort] = useState("newest");
  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState({
    averageRating: 0,
    totalReviewCount: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 0,
  });
  const [myReview, setMyReview] = useState(null);
  const [myReviewLoaded, setMyReviewLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const loadReviews = useCallback(
    async ({ page = 1, append = false } = {}) => {
      try {
        const response = await getCustomerProductReviews(productId, {
          sort,
          page,
          limit: PAGE_SIZE,
        });
        setItems((current) =>
          append ? [...current, ...response.items] : response.items,
        );
        setSummary(response.summary);
        setPagination(response.pagination);
        setError("");
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Could not load product reviews.",
        );
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [productId, sort],
  );

  async function loadMore(page) {
    setLoadingMore(true);
    await loadReviews({ page, append: true });
  }

  useEffect(() => {
    let active = true;

    getCustomerProductReviews(productId, {
      sort,
      page: 1,
      limit: PAGE_SIZE,
    })
      .then((response) => {
        if (!active) return;
        setItems(response.items);
        setSummary(response.summary);
        setPagination(response.pagination);
        setError("");
      })
      .catch((loadError) => {
        if (!active) return;
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Could not load product reviews.",
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    if (isSignedIn) {
      getMyCustomerProductReview(productId)
        .then((review) => {
          if (active) setMyReview(review);
        })
        .catch((loadError) => {
          if (active) {
            setError(
              loadError instanceof Error
                ? loadError.message
                : "Could not load your review.",
            );
          }
        })
        .finally(() => {
          if (active) setMyReviewLoaded(true);
        });
    }

    return () => {
      active = false;
    };
  }, [isSignedIn, productId, sort]);

  function changeSort(value) {
    if (value !== sort) {
      setLoading(true);
      setSort(value);
    }
  }

  async function saveReview(values) {
    setSaving(true);
    setError("");

    try {
      const review = myReview
        ? await updateCustomerProductReview(myReview._id, values)
        : await createCustomerProductReview(productId, values);
      setMyReview(review);
      await loadReviews();
    } catch (saveError) {
      const message =
        saveError instanceof Error
          ? saveError.message
          : "Could not save your review.";
      setError(message);
      throw saveError;
    } finally {
      setSaving(false);
    }
  }

  async function removeReview() {
    if (!myReview) return;

    setDeleting(true);
    setError("");

    try {
      await deleteCustomerProductReview(myReview._id);
      setMyReview(null);
      await loadReviews();
    } catch (deleteError) {
      const message =
        deleteError instanceof Error
          ? deleteError.message
          : "Could not delete your review.";
      setError(message);
      throw deleteError;
    } finally {
      setDeleting(false);
    }
  }

  return {
    sort,
    setSort: changeSort,
    items,
    summary,
    pagination,
    myReview,
    loadingMyReview: isSignedIn && !myReviewLoaded,
    loading,
    loadingMore,
    saving,
    deleting,
    error,
    loadReviews,
    loadMore,
    saveReview,
    removeReview,
  };
}
