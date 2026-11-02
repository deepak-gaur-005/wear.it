import { Button } from "@/components/ui/button";
import { useCustomerCartAndCheckoutStore } from "@/features/customer/cart-and-ckeckout/store";
import { formatPrice } from "@/lib/utils";
import { useAuth } from "@clerk/react";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

const wrapClass = "flex h-full min-h-0 flex-col";
const headClass = "border-b border-border bg-primary/5 px-5 py-4";
const headingTextClass =
  "flex items-center gap-2 text-left text-sm font-semibold text-foreground";
const headingIconClass = "h-4 w-4 text-primary";

const scrollClass = "min-h-0 flex-1 overflow-y-auto";
const listClass = "space-y-4 p-5";

const itemClass =
  "group flex gap-4 rounded-xl border border-border/60 bg-card p-3 shadow-sm transition-colors hover:border-primary/40 hover:bg-secondary/30";
const imageClass = "h-24 w-20 shrink-0 rounded-lg border border-border/50 object-cover";

const textWrapClass = "min-w-0 flex-1 space-y-1.5";
const brandClass =
  "text-[11px] font-medium uppercase tracking-[0.22em] text-primary";
const titleClass =
  "block line-clamp-2 text-sm font-semibold text-foreground transition-colors group-hover:text-primary";
const metaClass = "text-xs text-muted-foreground";
const priceClass = "text-sm font-semibold text-foreground";

const footerRowClass = "flex flex-wrap items-center justify-between gap-3 pt-2";
const qtyWrapClass =
  "flex items-center overflow-hidden rounded-lg border border-border bg-background";
const qtyButtonClass = "h-9 w-9 rounded-none px-0";
const qtyIconClass = "h-3.5 w-3.5";
const qtyValueClass =
  "flex h-9 min-w-10 items-center justify-center border-x border-border px-2 text-sm font-medium";

const removeButtonClass = "h-9 px-2 text-xs text-muted-foreground hover:text-destructive hover:bg-transparent";
const removeIconClass = "mr-1.5 h-3.5 w-3.5";

const emptyWrapClass =
  "flex min-h-[320px] flex-col items-center justify-center rounded-md border border-dashed border-border bg-muted/20 px-6 py-12 text-center";

const emptyTitleClass = "text-base font-medium text-foreground mb-1";

function CustomerCartItems() {
  const { isSignedIn } = useAuth();

  const { cart, setOpen, increase, decrease, remove } =
    useCustomerCartAndCheckoutStore((state) => state);

  return (
    <div className={wrapClass}>
      <div className={headClass}>
        <p className={headingTextClass}>
          <ShoppingCart className={headingIconClass} />
          Your Cart
        </p>
      </div>

      <div className={scrollClass}>
        <div className={listClass}>
          {!cart.items.length ? (
            <div className={emptyWrapClass}>
              <p className={emptyTitleClass}>Your cart is currently empty</p>
              <p className="text-xs text-muted-foreground mb-4">
                Discover our latest season garments and essentials.
              </p>
              <Link to="/collections" onClick={() => setOpen(false)}>
                <Button size="sm" variant="outline" className="rounded-lg text-xs uppercase tracking-wider">
                  Explore Collections
                </Button>
              </Link>
            </div>
          ) : (
            cart.items.map((item, index) => (
              <div
                key={`${item.productId}-${index + 1}`}
                className={itemClass}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className={imageClass}
                />

                <div className={textWrapClass}>
                  <p className={brandClass}>{item.brand}</p>

                  <Link
                    to={`/collection/${item.productId}`}
                    className={titleClass}
                    onClick={() => setOpen(false)}
                  >
                    {item.title}
                  </Link>

                  <p className={metaClass}>
                    {[item.color, item.size].filter(Boolean).join(" . ") ||
                      "Standard"}
                  </p>

                  <p className={priceClass}>
                    {formatPrice(item.finalPrice)}
                  </p>

                  <div className={footerRowClass}>
                    <div className={qtyWrapClass}>
                      <Button
                        type="button"
                        variant="ghost"
                        className={qtyButtonClass}
                        onClick={() =>
                          void decrease(item, Boolean(isSignedIn))
                        }
                        aria-label={`Decrease quantity of ${item.title}`}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className={qtyIconClass} />
                      </Button>

                      <span className={qtyValueClass}>{item.quantity}</span>

                      <Button
                        type="button"
                        variant="ghost"
                        className={qtyButtonClass}
                        onClick={() =>
                          void increase(item, Boolean(isSignedIn))
                        }
                        aria-label={`Increase quantity of ${item.title}`}
                      >
                        <Plus className={qtyIconClass} />
                      </Button>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      className={removeButtonClass}
                      onClick={() => void remove(item, Boolean(isSignedIn))}
                    >
                      <Trash2 className={removeIconClass} />
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default CustomerCartItems;