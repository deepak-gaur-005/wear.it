import {
  extractSalePrice,
  getCoverImage,
} from "@/features/customer/products/product-list-shared";
import { formatPrice } from "@/lib/utils";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

function CustomerProductRelatedCard({
  product,
  isWishlistActive,
  onToggleWishlist,
}) {
  const coverImage = getCoverImage(product);
  const alternateImage = product.images?.find(
    (image) => image.url && image.url !== coverImage,
  )?.url;
  const salePrice = extractSalePrice(product);

  return (
    <div className="group relative flex flex-col overflow-hidden transition-all duration-300">
      {/* Card Image Container with rounded-xl corners matching reference */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-border/60">
        <Link to={`/collection/${product._id}`} className="block h-full w-full">
          {coverImage ? (
            <>
              <img
                src={coverImage}
                alt={product.title}
                className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />
              {alternateImage ? (
                <img
                  src={alternateImage}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
              ) : null}
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-xs uppercase tracking-wider text-muted-foreground">
              No Image
            </div>
          )}
        </Link>

        {/* Heart Wishlist Icon in bottom-right matching reference screenshot */}
        <button
          type="button"
          aria-label={
            isWishlistActive
              ? `Remove ${product.title} from wishlist`
              : `Save ${product.title} to wishlist`
          }
          aria-pressed={isWishlistActive}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleWishlist();
          }}
          className={`absolute bottom-3 right-3 h-8 w-8 rounded-full border border-border/80 bg-white/90 dark:bg-neutral-800/90 flex items-center justify-center shadow-xs backdrop-blur transition-transform active:scale-90 hover:scale-105 ${
            isWishlistActive ? "text-red-500" : "text-neutral-700 dark:text-neutral-200"
          }`}
        >
          <Heart
            className={`h-4 w-4 ${isWishlistActive ? "fill-current" : ""}`}
          />
        </button>
      </div>

      {/* Title & Price Below Image matching reference */}
      <div className="pt-3 pb-1 space-y-1">
        <Link
          to={`/collection/${product._id}`}
          className="block text-sm font-semibold text-foreground line-clamp-1 hover:text-primary transition-colors"
        >
          {product.title}
        </Link>
        <p className="text-sm font-bold text-foreground">
          {formatPrice(salePrice)}
        </p>
      </div>
    </div>
  );
}

export default CustomerProductRelatedCard;
