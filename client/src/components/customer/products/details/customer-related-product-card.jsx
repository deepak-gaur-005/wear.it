import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  extractSalePrice,
  getCoverImage,
} from "@/features/customer/products/product-list-shared";
import { formatPrice } from "@/lib/utils";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

const cardClass =
  "group relative overflow-hidden border-border/60 bg-card transition duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg";

const linkClass = "block";

const imageWrapClass = "relative aspect-[4/5] overflow-hidden bg-muted";

const imageClass =
  "h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]";

const alternateImageClass =
  "absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100";

const noImageClass =
  "flex h-full items-center justify-center text-sm text-muted-foreground";

const saleBadgeClass =
  "absolute left-3 top-3 border-primary/30 bg-background/90 text-primary";

const wishlistButtonClass =
  "absolute right-3 top-3 z-10 h-10 w-10 rounded-full border border-border/70 bg-background/90 p-0 text-foreground shadow-sm backdrop-blur transition hover:bg-background";

const contentClass = "space-y-2 p-4";

const brandClass =
  "text-xs uppercase tracking-[0.18em] text-muted-foreground";

const titleClass =
  "line-clamp-2 min-h-12 text-base font-semibold leading-6 text-foreground";

const priceRowClass = "flex flex-wrap items-center gap-x-2 gap-y-1";

const salePriceClass = "font-semibold text-foreground";

const originalPriceClass = "text-sm text-muted-foreground line-through";

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
  const hasSale = product.salePercentage > 0;

  return (
    <Card className={cardClass}>
      <Link to={`/collection/${product._id}`} className={linkClass}>
        <div className={imageWrapClass}>
          {coverImage ? (
            <>
              <img src={coverImage} alt={product.title} className={imageClass} />
              {alternateImage ? (
                <img
                  src={alternateImage}
                  alt=""
                  aria-hidden="true"
                  className={alternateImageClass}
                />
              ) : null}
            </>
          ) : (
            <div className={noImageClass}>No Image</div>
          )}

          {hasSale ? (
            <Badge className={saleBadgeClass}>
              {product.salePercentage}% OFF
            </Badge>
          ) : null}
        </div>

        <CardContent className={contentClass}>
          <p className={brandClass}>{product.brand}</p>
          <h3 className={titleClass}>{product.title}</h3>

          <div className={priceRowClass}>
            <span className={salePriceClass}>
              {formatPrice(salePrice)}
            </span>

            {hasSale ? (
              <span className={originalPriceClass}>
                {formatPrice(product.price)}
              </span>
            ) : null}
          </div>
        </CardContent>
      </Link>

      <Button
        type="button"
        variant="ghost"
        aria-label={
          isWishlistActive
            ? `Remove ${product.title} from wishlist`
            : `Save ${product.title} to wishlist`
        }
        aria-pressed={isWishlistActive}
        className={wishlistButtonClass}
        onClick={() => void onToggleWishlist()}
      >
        <Heart
          className={`h-4 w-4 ${
            isWishlistActive ? "fill-current text-primary" : ""
          }`}
        />
      </Button>
    </Card>
  );
}

export default CustomerProductRelatedCard;
