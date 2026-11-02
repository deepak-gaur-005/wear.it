import {
  extractSalePrice,
  getCoverImage,
  getSwatchColor,
} from "@/features/customer/products/product-list-shared";
import { formatPrice } from "@/lib/utils";
import { Link } from "react-router-dom";

function CustomerProductCard({ product }) {
  const coverImage = getCoverImage(product);
  const salePrice = extractSalePrice(product);
  const hasSale = product.salePercentage > 0;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-card transition-all duration-300 hover:border-foreground/30 hover:shadow-md">
      <Link to={`/collection/${product._id}`} className="block overflow-hidden rounded-t-2xl">
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-t-2xl bg-muted/40">
          {coverImage ? (
            <img
              src={coverImage}
              alt={product.title}
              className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs uppercase tracking-wider text-muted-foreground">
              No Image
            </div>
          )}

          {hasSale && (
            <span className="absolute left-2.5 top-2.5 rounded-full bg-foreground text-background text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 shadow-xs">
              {product.salePercentage}% OFF
            </span>
          )}

          {product.stock <= 3 && product.stock > 0 && (
            <span className="absolute right-2.5 top-2.5 rounded-full bg-amber-500/90 text-white text-[10px] font-medium tracking-wide px-2.5 py-0.5 shadow-xs">
              Only {product.stock} left
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col justify-between p-3.5 sm:p-4 space-y-2">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            <span>{product.brand || "wear.it"}</span>
            {product.category?.name && <span>{product.category.name}</span>}
          </div>

          <Link
            to={`/collection/${product._id}`}
            className="block line-clamp-1 text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            {product.title}
          </Link>
        </div>

        <div className="flex items-baseline justify-between pt-1">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold text-foreground">
              {formatPrice(salePrice)}
            </span>
            {hasSale && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Color preview swatches */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1">
              {product.colors.slice(0, 3).map((color) => (
                <span
                  key={color}
                  className="h-2.5 w-2.5 rounded-full border border-border/80"
                  style={{ backgroundColor: getSwatchColor(color) }}
                  title={color}
                />
              ))}
              {product.colors.length > 3 && (
                <span className="text-[10px] text-muted-foreground ml-0.5">
                  +{product.colors.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default CustomerProductCard;
