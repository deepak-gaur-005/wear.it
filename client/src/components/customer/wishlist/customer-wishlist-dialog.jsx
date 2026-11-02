import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCustomerWishlistStore } from "@/features/customer/wishlist/store";
import { formatPrice } from "@/lib/utils";
import { Heart, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

const dialogClass = "sm:max-w-xl";

const contentClass = "space-y-4";

const listClass = "space-y-3";

const itemClass =
  "flex items-start gap-3 rounded-xl border border-border/60 bg-card/80 p-3";

const imageClass = "h-20 w-16 shrink-0 rounded-lg object-cover";

const noImageClass =
  "flex h-20 w-16 shrink-0 rounded-lg items-center justify-center bg-muted text-xs text-muted-foreground";

const bodyClass = "min-w-0 flex-1 space-y-1";

const brandClass =
  "text-xs uppercase tracking-[0.18em] text-muted-foreground";

const titleClass = "line-clamp-2 text-sm font-medium text-foreground";

const priceClass = "text-sm font-semibold text-foreground";

const actionsClass = "flex gap-2 pt-1";

const buttonClass = "h-8 rounded-lg px-3 text-xs";

const iconClass = "h-4 w-4";

const dialogTitleClass = "flex items-center gap-2";

const trashIcon = "mr-2 h-4 w-4";

function CustomerWishlistDialog() {
  const { isOpen, setOpen, items, removeItem } = useCustomerWishlistStore(
    (state) => state,
  );

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className={dialogClass}>
        <DialogHeader>
          <DialogTitle className={dialogTitleClass}>
            <Heart className={iconClass} />
            Wishlist
          </DialogTitle>
        </DialogHeader>

        <div className={contentClass}>
          {!items.length ? (
            <div className="py-12 text-center space-y-3">
              <Heart className="mx-auto h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm font-medium text-foreground">Your wishlist is empty</p>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                Save items you love by tapping the heart icon on any product page.
              </p>
            </div>
          ) : null}

          {items.length ? (
            <div className={listClass}>
              {items.map((item) => (
                <div key={item.productId} className={itemClass}>
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className={imageClass}
                    />
                  ) : (
                    <div className={noImageClass}>No Image</div>
                  )}

                  <div className={bodyClass}>
                    <p className={brandClass}>{item.brand}</p>

                    <Link
                      to={`/collection/${item.productId}`}
                      className={titleClass}
                      onClick={() => setOpen(false)}
                    >
                      {item.title}
                    </Link>

                    <p className={priceClass}>
                      {formatPrice(item.finalPrice)}
                    </p>

                    <div className={actionsClass}>
                      <Button
                        render={
                          <Link
                            onClick={() => setOpen(false)}
                            to={`/collection/${item.productId}`}
                          />
                        }
                        nativeButton={false}
                        variant="default"
                        className={buttonClass}
                      >
                        View
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        className={`${buttonClass} text-muted-foreground hover:text-destructive hover:bg-transparent`}
                        onClick={() => void removeItem(item.productId)}
                      >
                        <Trash2 className={trashIcon} />
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CustomerWishlistDialog;