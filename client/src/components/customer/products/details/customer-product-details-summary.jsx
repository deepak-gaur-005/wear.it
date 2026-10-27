import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { extractSalePrice } from "@/features/customer/products/product-list-shared";
import { formatPrice } from "@/lib/utils";
import { Heart, ShoppingBag } from "lucide-react";
import CustomerProductOptionsGroup from "./customer-product-options-group";

const summaryWrapClass = "space-y-7 lg:pt-2";

const badgesWrapClass = "flex flex-wrap items-center gap-2";

const categoryBadgeClass =
  "border-border bg-secondary text-secondary-foreground hover:bg-secondary";

const stockBadgeClass =
  "border-primary/30 bg-primary/15 text-primary hover:bg-primary/15";

const priceBlockClass = "space-y-4";

const priceRowClass = "flex flex-wrap items-center gap-3";

const salePriceClass = "text-4xl font-semibold tracking-tight text-foreground";

const originalPriceClass = "text-lg text-muted-foreground line-through";

const savingsClass = "text-sm font-medium text-primary";

const descriptionClass =
  "whitespace-pre-line text-sm leading-7 text-muted-foreground sm:text-base";

const optionsClass = "space-y-6";

const actionButtonsClass = "flex flex-col gap-3 sm:flex-row";

const primaryButtonClass = "min-h-12 rounded-none sm:flex-1";

const secondaryButtonClass = "min-h-12 rounded-none sm:flex-1";

const iconClass = "mr-2 h-4 w-4";

function CustomerProductDetailsSummary({
  product,
  selectedColor,
  selectedSize,
  setSelectedColor,
  setSelectedSize,
  toggleWishlist,
  isWishlistActive,
  onAddToCart,
}) {
  const salePrice = extractSalePrice(product);
  const hasSale = product.salePercentage > 0;

  return (
    <section className={summaryWrapClass}>
      <div className={badgesWrapClass}>
        {product?.category?.name ? (
          <Badge className={categoryBadgeClass}>
            {product.category.name}
          </Badge>
        ) : null}

        {product?.stock > 0 ? (
          <Badge className={stockBadgeClass}>
            {product.stock <= 5 ? `Only ${product.stock} left` : "In stock"}
          </Badge>
        ) : (
          <Badge variant="destructive">Out of stock</Badge>
        )}

        {hasSale ? (
          <Badge className={stockBadgeClass}>
            {product.salePercentage}% OFF
          </Badge>
        ) : null}
      </div>

      <div className={priceBlockClass}>
        <div className={priceRowClass}>
          <span className={salePriceClass}>{formatPrice(salePrice)}</span>

          {hasSale ? (
            <span className={originalPriceClass}>
              {formatPrice(product.price)}
            </span>
          ) : null}
          {hasSale ? (
            <span className={savingsClass}>
              Save {formatPrice(product.price - salePrice)}
            </span>
          ) : null}
        </div>

        {product.description ? (
          <p className={descriptionClass}>{product.description}</p>
        ) : null}
      </div>

      {product.colors?.length || product.sizes?.length ? (
        <div className={optionsClass}>
          {product.colors?.length ? (
            <CustomerProductOptionsGroup
              label="Color"
              values={product.colors}
              selectedValue={selectedColor}
              onSelect={setSelectedColor}
              variant="color"
            />
          ) : null}

          {product.sizes?.length ? (
            <CustomerProductOptionsGroup
              label="Size"
              values={product.sizes}
              selectedValue={selectedSize}
              onSelect={setSelectedSize}
              variant="size"
            />
          ) : null}
        </div>
      ) : null}

      <Separator />

      <div className={actionButtonsClass}>
        <Button
          type="button"
          className={primaryButtonClass}
          disabled={product.stock < 1}
          onClick={() => void onAddToCart()}
        >
          <ShoppingBag className={iconClass} />
          Add to Cart
        </Button>

        <Button
          type="button"
          variant="outline"
          className={secondaryButtonClass}
          onClick={() => void toggleWishlist()}
        >
          <Heart
            className={`${iconClass} ${
              isWishlistActive ? "fill-current" : ""
            }`}
          />
          {isWishlistActive ? "Remove from Wishlist" : "Save to Wishlist"}
        </Button>
      </div>
    </section>
  );
}

export default CustomerProductDetailsSummary;
