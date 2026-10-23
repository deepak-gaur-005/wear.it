import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCustomerOrdersStore } from "@/features/customer/orders/store";
import { formatPrice } from "@/lib/utils";
import { PackageCheck } from "lucide-react";

const dialogClass =
  "max-h-[92vh] overflow-y-auto border-border bg-background sm:max-w-2xl";
const listClass = "space-y-3";
const orderClass = "space-y-3 border border-border/60 bg-card/80 p-4";
const headerClass = "flex flex-wrap items-start justify-between gap-3";
const codeClass = "font-medium";
const metaClass = "text-sm text-muted-foreground";
const statusClass =
  "inline-flex rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary";
const emptyClass = "py-8 text-center text-sm text-muted-foreground";

function formatOrderDate(value) {
  if (!value) return "Date unavailable";

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Date unavailable"
    : date.toLocaleDateString();
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
                      Placed {formatOrderDate(order.createdAt)}
                    </p>
                  </div>
                  <span className={statusClass}>{order.orderStatus}</span>
                </div>

                <div className="flex flex-wrap justify-between gap-2">
                  <p className={metaClass}>
                    {order.totalItems} {order.totalItems === 1 ? "item" : "items"}
                    {" · "}
                    {order.paymentStatus}
                  </p>
                  <p className="font-semibold">{formatPrice(order.totalAmount)}</p>
                </div>

                {order.orderStatus === "delivered" && !order.returnedAt ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => void returnOrder(order._id)}
                  >
                    Return order
                  </Button>
                ) : null}

                {order.returnedAt ? (
                  <p className={metaClass}>
                    Returned {formatOrderDate(order.returnedAt)}
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
