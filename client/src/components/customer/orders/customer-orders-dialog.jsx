import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCustomerOrdersStore } from "@/features/customer/orders/store";
import { formatPrice } from "@/lib/utils";
import { MapPin, PackageCheck, ShoppingBag } from "lucide-react";

const dialogClass =
  "max-h-[92vh] overflow-y-auto border-border bg-background sm:max-w-2xl";
const listClass = "space-y-4";
const orderClass = "space-y-3.5 border border-border/70 bg-card/90 p-4 rounded-md shadow-xs";
const headerClass = "flex flex-wrap items-start justify-between gap-3 border-b border-border/40 pb-3";
const codeClass = "font-medium tracking-tight";
const metaClass = "text-xs text-muted-foreground";
const statusClass = (status) => {
  switch (status) {
    case "delivered":
      return "inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400";
    case "shipped":
      return "inline-flex rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-600 dark:text-blue-400";
    case "returned":
      return "inline-flex rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400";
    case "cancelled":
      return "inline-flex rounded-full border border-destructive/30 bg-destructive/10 px-2.5 py-0.5 text-xs font-medium text-destructive";
    default:
      return "inline-flex rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary";
  }
};
const emptyClass = "py-8 text-center text-sm text-muted-foreground";

function formatOrderDate(value) {
  if (!value) return "Date unavailable";

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Date unavailable"
    : date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
}

function CustomerOrdersDialog() {
  const { isOpen, closeOrders, loading, items, returnOrder } =
    useCustomerOrdersStore((state) => state);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) closeOrders();
      }}
    >
      <DialogContent className={dialogClass}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PackageCheck className="h-5 w-5" />
            My Orders
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <p className={emptyClass}>Loading orders...</p>
        ) : items.length ? (
          <div className={listClass}>
            {items.map((order) => (
              <article key={order._id} className={orderClass}>
                <div className={headerClass}>
                  <div>
                    <p className={codeClass}>Order #{order.code}</p>
                    <p className={metaClass}>
                      Placed on {formatOrderDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={statusClass(order.orderStatus)}>
                      {order.orderStatus}
                    </span>
                  </div>
                </div>

                {/* Items snapshot list */}
                {order.items && order.items.length > 0 ? (
                  <div className="space-y-2.5 border-b border-border/40 pb-3">
                    {order.items.map((item, idx) => (
                      <div
                        key={`${item.product}-${idx}`}
                        className="flex items-center gap-3 text-sm"
                      >
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.title || "Ordered item"}
                            className="h-12 w-12 rounded object-cover border border-border/50 shrink-0 bg-muted"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded bg-muted flex items-center justify-center shrink-0 text-muted-foreground">
                            <ShoppingBag className="h-5 w-5" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate leading-tight">
                            {item.title || "Product"}
                          </p>
                          <div className="flex flex-wrap items-center gap-1.5 mt-0.5 text-xs text-muted-foreground">
                            {item.color && (
                              <span className="inline-flex items-center gap-1">
                                Color: {item.color}
                              </span>
                            )}
                            {item.color && item.size && <span>·</span>}
                            {item.size && <span>Size: {item.size}</span>}
                            <span>·</span>
                            <span>Qty: {item.quantity}</span>
                          </div>
                        </div>
                        <p className="font-medium text-sm shrink-0">
                          {formatPrice(item.unitPrice * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : null}

                {/* Delivery and payment summary */}
                <div className="space-y-1 text-xs text-muted-foreground">
                  {order.deliveryAddress ? (
                    <p className="flex items-start gap-1.5 leading-snug">
                      <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5 text-muted-foreground/70" />
                      <span>
                        Delivering to <strong className="text-foreground/90 font-medium">{order.deliveryName}</strong> — {order.deliveryAddress}
                      </span>
                    </p>
                  ) : null}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <p className={metaClass}>
                    {order.totalItems} {order.totalItems === 1 ? "item" : "items"}
                    {" · "}
                    <span className="capitalize">{order.paymentStatus}</span>
                  </p>
                  <p className="font-semibold text-base">{formatPrice(order.totalAmount)}</p>
                </div>

                {order.orderStatus === "delivered" && !order.returnedAt ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => void returnOrder(order._id)}
                  >
                    Return order
                  </Button>
                ) : null}

                {order.returnedAt ? (
                  <p className={metaClass}>
                    Returned on {formatOrderDate(order.returnedAt)}
                  </p>
                ) : null}

                {order.cancelledAt ? (
                  <p className={metaClass}>
                    Cancelled on {formatOrderDate(order.cancelledAt)}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        ) : (
          <p className={emptyClass}>You haven’t placed any orders yet.</p>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default CustomerOrdersDialog;
