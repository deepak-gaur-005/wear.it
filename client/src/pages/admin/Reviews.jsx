import ReviewTable from "@/components/admin/reviews/review-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAdminReviewsStore } from "@/features/admin/reviews/store";
import { useEffect } from "react";

function AdminReviews() {
  const {
    items,
    pagination,
    status,
    loading,
    error,
    updatingReviewId,
    deletingReviewId,
    setStatus,
    setPage,
    fetchReviews,
    setReviewStatus,
    removeReview,
  } = useAdminReviewsStore((state) => state);

  useEffect(() => {
    void fetchReviews();
  }, [fetchReviews, status, pagination.page]);

  function handleDelete(review) {
    const productName = review.product?.title || "this product";
    if (!window.confirm(`Permanently delete this review for ${productName}?`)) {
      return;
    }
    void removeReview(review._id);
  }

  const canGoBack = pagination.page > 1;
  const canGoForward = pagination.page < pagination.totalPages;

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <Card className="border-border bg-card shadow-sm">
        <CardHeader className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="space-y-1">
            <CardTitle className="text-xl">Review moderation</CardTitle>
            <p className="text-sm text-muted-foreground">
              {pagination.total} total{" "}
              {pagination.total === 1 ? "review" : "reviews"}
            </p>
          </div>
          <Select
            value={status || "all"}
            onValueChange={(value) => {
              setStatus(value === "all" ? "" : value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-[180px]" aria-label="Filter reviews by status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All reviews</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="hidden">Hidden</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="space-y-4">
          {error ? (
            <div
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
              role="alert"
            >
              <span>{error}</span>
              <Button type="button" variant="outline" onClick={() => void fetchReviews()}>
                Retry
              </Button>
            </div>
          ) : null}

          <ReviewTable
            items={items}
            loading={loading}
            updatingReviewId={updatingReviewId}
            deletingReviewId={deletingReviewId}
            onStatusChange={(reviewId, nextStatus) =>
              void setReviewStatus(reviewId, nextStatus)
            }
            onDelete={handleDelete}
          />

          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <p className="text-sm text-muted-foreground">
              Page {pagination.page} of {Math.max(pagination.totalPages, 1)}
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={!canGoBack || loading}
                onClick={() => setPage(pagination.page - 1)}
              >
                Previous
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={!canGoForward || loading}
                onClick={() => setPage(pagination.page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminReviews;
