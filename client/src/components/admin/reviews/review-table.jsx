import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Star, Trash2 } from "lucide-react";

const mutedClass = "text-xs text-muted-foreground";

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString();
}

function ReviewTable({
  items,
  loading,
  updatingReviewId,
  deletingReviewId,
  onStatusChange,
  onDelete,
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Review</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6} className="h-28 text-center text-muted-foreground">
                Loading reviews...
              </TableCell>
            </TableRow>
          ) : items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-28 text-center text-muted-foreground">
                No reviews found.
              </TableCell>
            </TableRow>
          ) : (
            items.map((review) => (
              <TableRow key={review._id}>
                <TableCell className="min-w-36 font-medium">
                  {review.product?.title || "Product unavailable"}
                </TableCell>
                <TableCell className="min-w-36">
                  <div>{review.user?.name || "Customer unavailable"}</div>
                  {review.user?.email ? (
                    <div className={mutedClass}>{review.user.email}</div>
                  ) : null}
                </TableCell>
                <TableCell className="min-w-64 max-w-md whitespace-normal">
                  <div className="mb-1 flex items-center gap-1 text-amber-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="font-medium text-foreground">
                      {review.rating}/5
                    </span>
                  </div>
                  <p className="line-clamp-4 text-sm leading-6 text-muted-foreground">
                    {review.text}
                  </p>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {formatDate(review.createdAt)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={review.status === "published" ? "secondary" : "outline"}
                    className={
                      review.status === "published"
                        ? "border-primary/30 bg-primary/10 text-primary"
                        : ""
                    }
                  >
                    {review.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Select
                      value={review.status}
                      onValueChange={(value) =>
                        onStatusChange(review._id, value)
                      }
                      disabled={updatingReviewId === review._id}
                    >
                      <SelectTrigger
                        className="h-8 w-[125px]"
                        aria-label={`Moderate review for ${review.product?.title || "product"}`}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="published">Publish</SelectItem>
                        <SelectItem value="hidden">Hide</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      aria-label="Delete review"
                      disabled={deletingReviewId === review._id}
                      onClick={() => onDelete(review)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default ReviewTable;
