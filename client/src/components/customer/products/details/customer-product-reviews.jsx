import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useCustomerProductReviews } from "@/features/customer/products/reviews/use-customer-product-reviews";
import { BadgeCheck, Star, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const sectionClass = "mt-14 space-y-6";
const cardClass = "border-border/60 bg-card";
const fieldLabelClass = "mb-2 block text-sm font-medium text-foreground";
const errorClass = "text-sm text-destructive";
const mutedTextClass = "text-sm text-muted-foreground";
const starBaseClass = "h-5 w-5";
const activeStarClass = "fill-amber-400 text-amber-400";
const inactiveStarClass = "text-muted-foreground/40";

function ReviewStars({ rating, interactive = false, onChange, label }) {
  return (
    <div
      className="flex items-center gap-1"
      role={interactive ? "group" : "img"}
      aria-label={label || `${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((value) => {
        const isActive = value <= rating;
        const star = (
          <Star
            className={`${starBaseClass} ${
              isActive ? activeStarClass : inactiveStarClass
            }`}
            aria-hidden="true"
          />
        );

        return interactive ? (
          <button
            key={value}
            type="button"
            className="rounded-sm p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() => onChange(value)}
            aria-label={`${value} star${value === 1 ? "" : "s"}`}
            aria-pressed={rating === value}
          >
            {star}
          </button>
        ) : (
          <span key={value}>{star}</span>
        );
      })}
    </div>
  );
}

function formatReviewDate(value) {
  if (!value) return "";

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
}

function CustomerProductReviews({ productId, isSignedIn }) {
  const {
    sort,
    setSort,
    items,
    summary,
    pagination,
    myReview,
    loadingMyReview,
    loading,
    loadingMore,
    saving,
    deleting,
    error,
    loadMore,
    saveReview,
    removeReview,
  } = useCustomerProductReviews(productId, isSignedIn);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [formError, setFormError] = useState("");
  const [editing, setEditing] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");
    const trimmedText = text.trim();

    if (!trimmedText || trimmedText.length > 2000) {
      setFormError("Write between 1 and 2000 characters for your review.");
      return;
    }

    try {
      await saveReview({ rating, text: trimmedText });
      setEditing(false);
    } catch {
      // The hook exposes the server's error message.
    }
  }

  async function handleDelete() {
    if (!window.confirm("Delete your review for this product?")) return;

    try {
      await removeReview();
    } catch {
      // The hook exposes the server's error message.
    }
  }

  return (
    <section className={sectionClass} aria-labelledby="product-reviews-heading">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div className="space-y-1">
          <p className="text-sm uppercase tracking-[0.18em] text-primary">
            Customer feedback
          </p>
          <h2
            id="product-reviews-heading"
            className="text-2xl font-semibold tracking-tight text-foreground"
          >
            Ratings &amp; Reviews
          </h2>
        </div>
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          Sort by
          <select
            className="h-9 rounded-md border border-input bg-background px-3 text-foreground"
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            aria-label="Sort reviews"
          >
            <option value="newest">Newest</option>
            <option value="highest">Highest rating</option>
            <option value="lowest">Lowest rating</option>
          </select>
        </label>
      </div>

      <Card className={cardClass}>
        <CardContent className="grid gap-6 p-5 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] sm:p-6">
          <div className="space-y-4">
            <div className="flex items-end gap-2">
              <span className="text-5xl font-semibold tracking-tight text-foreground">
                {summary.averageRating.toFixed(1)}
              </span>
              <span className="pb-1 text-sm text-muted-foreground">
                / 5 · {summary.totalReviewCount}{" "}
                {summary.totalReviewCount === 1 ? "review" : "reviews"}
              </span>
            </div>
            <ReviewStars
              rating={Math.round(summary.averageRating)}
              label={`Average rating ${summary.averageRating.toFixed(1)} out of 5`}
            />
          </div>

          <div className="space-y-2" aria-label="Rating distribution">
            {[5, 4, 3, 2, 1].map((value) => {
              const count = summary.ratingDistribution[value] || 0;
              const percentage = summary.totalReviewCount
                ? (count / summary.totalReviewCount) * 100
                : 0;

              return (
                <div
                  key={value}
                  className="grid grid-cols-[2.5rem_minmax(0,1fr)_2rem] items-center gap-2 text-sm"
                >
                  <span className="text-muted-foreground">{value} star</span>
                  <div
                    className="h-2 overflow-hidden rounded-full bg-secondary"
                    role="progressbar"
                    aria-label={`${value} star reviews`}
                    aria-valuenow={count}
                    aria-valuemin={0}
                    aria-valuemax={summary.totalReviewCount}
                  >
                    <div
                      className="h-full rounded-full bg-amber-400"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-right text-muted-foreground">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {isSignedIn ? (
        <Card className={cardClass}>
          <CardContent className="space-y-4 p-5 sm:p-6">
            {loadingMyReview ? (
              <p className={mutedTextClass}>Loading your review...</p>
            ) : (
              <>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-foreground">
                {myReview && !editing ? "Your review" : myReview ? "Update your review" : "Write a review"}
              </h3>
              {myReview?.status === "hidden" ? (
                <Badge variant="secondary">Hidden by moderation</Badge>
              ) : null}
            </div>

            {error ? (
              <p className={errorClass} role="alert">
                {error}
              </p>
            ) : null}

            {myReview && !editing ? (
              <div className="space-y-4">
                <ReviewStars rating={myReview.rating} />
                <p className="whitespace-pre-line text-sm leading-7 text-muted-foreground">
                  {myReview.text}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setRating(myReview.rating);
                      setText(myReview.text);
                      setEditing(true);
                    }}
                  >
                    Edit review
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    disabled={deleting}
                    onClick={() => void handleDelete()}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {deleting ? "Deleting..." : "Delete review"}
                  </Button>
                </div>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <span className={fieldLabelClass}>Your rating</span>
                <ReviewStars
                  rating={rating}
                  interactive
                  onChange={setRating}
                  label={`Select a rating, currently ${rating} out of 5`}
                />
              </div>

              <div>
                <label htmlFor="product-review-text" className={fieldLabelClass}>
                  Your review
                </label>
                <Textarea
                  id="product-review-text"
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                  placeholder="What did you think about this product?"
                  maxLength={2000}
                  required
                  rows={4}
                />
                <p className={`${mutedTextClass} mt-1 text-right`}>
                  {text.length}/2000
                </p>
              </div>

              {formError ? (
                <p className={errorClass} role="alert">
                  {formError}
                </p>
              ) : null}
              <div className="flex flex-wrap gap-2">
                <Button type="submit" disabled={saving || deleting}>
                  {saving ? "Saving..." : myReview ? "Save changes" : "Submit review"}
                </Button>
                {myReview ? (
                  <Button
                    type="button"
                    variant="outline"
                    disabled={saving || deleting}
                    onClick={() => setEditing(false)}
                  >
                    Cancel
                  </Button>
                ) : null}
              </div>
              </form>
            )}
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className={cardClass}>
          <CardContent className="flex flex-col justify-between gap-3 p-5 sm:flex-row sm:items-center sm:p-6">
            <div>
              <h3 className="font-semibold text-foreground">
                Have you tried this product?
              </h3>
              <p className={mutedTextClass}>
                Sign in to share your rating and review.
              </p>
            </div>
            <Button
              render={<Link to="/sign-in" />}
              nativeButton={false}
              variant="outline"
            >
              Sign in to review
            </Button>
          </CardContent>
        </Card>
      )}

      {error && !isSignedIn ? (
        <p className={errorClass} role="alert">
          {error}
        </p>
      ) : null}

      <div className="space-y-4">
        {loading ? (
          <p className={mutedTextClass}>Loading reviews...</p>
        ) : items.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border px-5 py-10 text-center text-sm text-muted-foreground">
            No reviews yet. Be the first to review this product.
          </p>
        ) : (
          items.map((review) => (
            <Card key={review._id} className={cardClass}>
              <CardContent className="space-y-3 p-5 sm:p-6">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div className="space-y-2">
                    <ReviewStars rating={review.rating} />
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-foreground">
                        {review.user.name}
                      </span>
                      {review.verifiedPurchase ? (
                        <Badge
                          variant="secondary"
                          className="gap-1 border-primary/20 bg-primary/10 text-primary"
                        >
                          <BadgeCheck className="h-3.5 w-3.5" />
                          Verified purchase
                        </Badge>
                      ) : null}
                    </div>
                  </div>
                  <time
                    className={mutedTextClass}
                    dateTime={review.createdAt}
                  >
                    {formatReviewDate(review.createdAt)}
                  </time>
                </div>
                <p className="whitespace-pre-line break-words text-sm leading-7 text-muted-foreground">
                  {review.text}
                </p>
              </CardContent>
            </Card>
          ))
        )}

        {pagination.page < pagination.totalPages ? (
          <div className="flex justify-center">
            <Button
              type="button"
              variant="outline"
              disabled={loadingMore || loading}
              onClick={() => void loadMore(pagination.page + 1)}
            >
              {loadingMore ? "Loading..." : "Load more reviews"}
            </Button>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default CustomerProductReviews;
