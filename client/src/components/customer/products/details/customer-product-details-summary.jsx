import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  extractSalePrice,
  getSwatchColor,
} from "@/features/customer/products/product-list-shared";
import { formatPrice } from "@/lib/utils";
import {
  Heart,
  RotateCcw,
  Ruler,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
} from "lucide-react";
import { useState } from "react";

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
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const salePrice = extractSalePrice(product);
  const hasSale = product.salePercentage > 0;

  const scrollToReviews = () => {
    const el = document.getElementById("product-reviews-heading");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="space-y-6 lg:pl-2">
      {/* Category / Collection Tag */}
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center rounded-md bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
          {product.category?.name || "New Arrival"}
        </span>

        {product.stock <= 5 && product.stock > 0 && (
          <span className="inline-flex items-center rounded-md bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
            Only {product.stock} left in stock
          </span>
        )}

        {product.stock <= 0 && (
          <span className="inline-flex items-center rounded-md bg-destructive/10 px-2.5 py-1 text-xs font-semibold text-destructive">
            Out of stock
          </span>
        )}
      </div>

      {/* Product Title */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight">
          {product.title}
        </h1>
        {product.brand && (
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mt-1 font-medium">
            {product.brand}
          </p>
        )}
      </div>

      {/* Ratings Row */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 text-amber-400">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className="h-4 w-4 fill-amber-400" />
          ))}
        </div>
        <button
          type="button"
          onClick={scrollToReviews}
          className="text-xs font-medium text-foreground hover:underline"
        >
          4.8 (Customer Reviews)
        </button>
      </div>

      {/* Price Block */}
      <div className="flex items-center gap-3.5 pt-1">
        <span className="text-3xl font-bold tracking-tight text-foreground">
          {formatPrice(salePrice)}
        </span>

        {hasSale && (
          <>
            <span className="text-lg text-muted-foreground line-through font-normal">
              {formatPrice(product.price)}
            </span>
            <span className="rounded-lg bg-black text-white dark:bg-white dark:text-black px-2.5 py-1 text-xs font-bold tracking-wider uppercase">
              {product.salePercentage}% OFF
            </span>
          </>
        )}
      </div>

      {/* Short Description */}
      {product.description && (
        <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
          {product.description}
        </p>
      )}

      {/* Color Selection */}
      {product.colors && product.colors.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-1.5 text-sm">
            <span className="text-muted-foreground">Color:</span>
            <span className="font-semibold text-foreground capitalize">
              {selectedColor || product.colors[0]}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3" role="group" aria-label="Color options">
            {product.colors.map((color) => {
              const isActive = (selectedColor || product.colors[0]) === color;
              const swatchBg = getSwatchColor(color);

              return (
                <button
                  key={color}
                  type="button"
                  aria-label={`Select ${color}`}
                  aria-pressed={isActive}
                  onClick={() => setSelectedColor(color)}
                  className={`relative h-8 w-8 rounded-full border border-border/80 transition-all duration-200 flex items-center justify-center ${
                    isActive
                      ? "ring-2 ring-foreground ring-offset-2 ring-offset-background scale-110"
                      : "hover:scale-105"
                  }`}
                  style={{ backgroundColor: swatchBg }}
                >
                  {isActive && (
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        swatchBg === "#ffffff" ? "bg-black" : "bg-white"
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Size Selection with Size Guide */}
      {product.sizes && product.sizes.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground">Size:</span>
              <span className="font-semibold text-foreground uppercase">
                {selectedSize || product.sizes[0]}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsSizeGuideOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground underline underline-offset-4 hover:text-primary transition-colors"
            >
              <Ruler className="h-3.5 w-3.5" />
              Size Guide
            </button>
          </div>

          <div className="flex flex-wrap gap-2.5" role="group" aria-label="Size options">
            {product.sizes.map((size) => {
              const isActive = (selectedSize || product.sizes[0]) === size;

              return (
                <button
                  key={size}
                  type="button"
                  aria-label={`Size ${size}`}
                  aria-pressed={isActive}
                  onClick={() => setSelectedSize(size)}
                  className={`h-11 min-w-12 px-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-150 ${
                    isActive
                      ? "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-xs scale-102"
                      : "border border-border/90 bg-card text-foreground hover:border-foreground"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Action Buttons: Add to Cart + Wishlist */}
      <div className="flex items-center gap-3 pt-4">
        <Button
          type="button"
          disabled={product.stock < 1}
          onClick={() => void onAddToCart()}
          className="h-13 flex-1 rounded-xl bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 text-sm font-semibold tracking-wide flex items-center justify-center gap-2.5 shadow-sm transition-all"
        >
          <ShoppingBag className="h-4.5 w-4.5" />
          {product.stock < 1 ? "Out of Stock" : "Add to Cart"}
        </Button>

        <Button
          type="button"
          variant="outline"
          aria-label={isWishlistActive ? "Remove from Wishlist" : "Save to Wishlist"}
          onClick={() => void toggleWishlist()}
          className={`h-13 w-13 rounded-xl border border-border/90 p-0 flex items-center justify-center transition-colors ${
            isWishlistActive
              ? "bg-red-50 text-red-600 border-red-200 dark:bg-red-950/30 dark:border-red-900/50"
              : "hover:bg-muted/50 text-foreground"
          }`}
        >
          <Heart
            className={`h-5 w-5 ${
              isWishlistActive ? "fill-current text-red-600" : ""
            }`}
          />
        </Button>
      </div>

      {/* Value Pillars / Trust Badges Strip */}
      <div className="grid grid-cols-3 gap-3 pt-6 mt-6">
        <div className="flex items-center gap-2.5">
          <Truck className="h-4 w-4 text-muted-foreground shrink-0" />
          <div>
            <p className="text-xs font-semibold text-foreground leading-tight">Free Shipping</p>
            <p className="text-[10px] text-muted-foreground">On orders over ₹999</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <RotateCcw className="h-4 w-4 text-muted-foreground shrink-0" />
          <div>
            <p className="text-xs font-semibold text-foreground leading-tight">Easy Returns</p>
            <p className="text-[10px] text-muted-foreground">7-day return policy</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <ShieldCheck className="h-4 w-4 text-muted-foreground shrink-0" />
          <div>
            <p className="text-xs font-semibold text-foreground leading-tight">Secure Payment</p>
            <p className="text-[10px] text-muted-foreground">100% encrypted</p>
          </div>
        </div>
      </div>

      {/* Size Guide Modal */}
      <Dialog open={isSizeGuideOpen} onOpenChange={setIsSizeGuideOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-bold">
              <Ruler className="h-5 w-5" />
              Size Guide (Inches)
            </DialogTitle>
          </DialogHeader>

          <div className="mt-3 overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse border border-border">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="p-2.5 font-semibold">Size</th>
                  <th className="p-2.5 font-semibold">Chest</th>
                  <th className="p-2.5 font-semibold">Length</th>
                  <th className="p-2.5 font-semibold">Sleeve</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="p-2.5 font-medium">S</td>
                  <td className="p-2.5 text-muted-foreground">38" - 40"</td>
                  <td className="p-2.5 text-muted-foreground">27"</td>
                  <td className="p-2.5 text-muted-foreground">25"</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium">M</td>
                  <td className="p-2.5 text-muted-foreground">40" - 42"</td>
                  <td className="p-2.5 text-muted-foreground">28"</td>
                  <td className="p-2.5 text-muted-foreground">25.5"</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium">L</td>
                  <td className="p-2.5 text-muted-foreground">42" - 44"</td>
                  <td className="p-2.5 text-muted-foreground">29"</td>
                  <td className="p-2.5 text-muted-foreground">26"</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium">XL</td>
                  <td className="p-2.5 text-muted-foreground">44" - 46"</td>
                  <td className="p-2.5 text-muted-foreground">30"</td>
                  <td className="p-2.5 text-muted-foreground">26.5"</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium">XXL</td>
                  <td className="p-2.5 text-muted-foreground">46" - 48"</td>
                  <td className="p-2.5 text-muted-foreground">31"</td>
                  <td className="p-2.5 text-muted-foreground">27"</td>
                </tr>
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}

export default CustomerProductDetailsSummary;
