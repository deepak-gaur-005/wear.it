import { CommonLoader } from "@/components/common/loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  SelectTrigger,
  SelectValue,
  Select,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAdminOrdersStore } from "@/features/admin/orders/store";
import { formatPrice } from "@/lib/utils";
import { ChevronDown, ChevronUp, MapPin, Package, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";

const pageWrapClass = "min-h-screen bg-background";
const contentWrapClass = "mx-auto max-w-7xl px-4 py-8";
const cardClass = "border-border bg-card";
const wrapClass = "space-y-4";

const titleClass = "flex items-center gap-2 text-2xl font-semibold";

const emptyClass =
  "rounded-lg border border-border bg-background p-6 text-sm text-muted-foreground";
const tableWrapClass = "overflow-x-auto";
const subTextClass = "text-xs text-muted-foreground";
const selectTriggerClass = "h-9 w-[160px] rounded-none";
const successBadgeClass =
  "border-primary/30 bg-primary/10 text-primary hover:bg-primary/10";
const dangerBadgeClass =
  "border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/10";
const neutralBadgeClass =
  "border-border bg-secondary/60 text-foreground hover:bg-secondary/60";

const orderStatusOptions = ["placed", "shipped", "delivered", "cancelled"];

function formatDate(value) {
  return value ? new Date(value).toLocaleDateString("en-IN") : "-";
}

function AdminPaymentStatusBadge({ status }) {
  const className =
    status === "paid"
      ? successBadgeClass
      : status === "failed"
        ? dangerBadgeClass
        : neutralBadgeClass;

  return <Badge className={className}>{status}</Badge>;
}

function AdminOrderStatusBadge({ status }) {
  let className = neutralBadgeClass;
  if (status === "delivered") {
    className = "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
  } else if (status === "shipped") {
    className = "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400";
  } else if (status === "cancelled" || status === "returned") {
    className = dangerBadgeClass;
  }
  return <Badge className={className}>{status}</Badge>;
}

function canUpdateStatus(order) {
  if (order.paymentStatus !== "paid") return false;
  if (order.orderStatus === "delivered") return false;
  if (order.orderStatus === "returned") return false;
  if (order.orderStatus === "cancelled") return false;

  return true;
}

function getNextStatusValue(order) {
  if (
    order.orderStatus === "delivered" ||
    order.orderStatus === "returned" ||
    order.orderStatus === "cancelled"
  ) {
    return "";
  }

  return order.orderStatus;
}

function AdminOrders() {
  const { loading, orders, updatingOrderId, fetchOrders, changeStatus } =
    useAdminOrdersStore((state) => state);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const toggleExpand = (id) => {
    setExpandedOrderId((prev) => (prev === id ? null : id));
  };

  if (loading) return <CommonLoader />;

  return (
    <div className={pageWrapClass}>
      <div className={contentWrapClass}>
        <Card className={cardClass}>
          <CardHeader className={wrapClass}>
            <CardTitle className={titleClass}>Orders Management</CardTitle>
          </CardHeader>

          <CardContent>
            {!orders.length ? (
              <div className={emptyClass}>No Orders found</div>
            ) : (
              <div className={tableWrapClass}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10"></TableHead>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Update Status</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {orders.map((order) => {
                      const canUpdate = canUpdateStatus(order);
                      const isExpanded = expandedOrderId === order._id;

                      return (
                        <div key={order._id} className="contents">
                          <TableRow className="cursor-pointer hover:bg-muted/40" onClick={() => toggleExpand(order._id)}>
                            <TableCell>
                              <Button variant="ghost" size="icon" className="h-7 w-7 p-0">
                                {isExpanded ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </Button>
                            </TableCell>

                            <TableCell className="font-mono text-xs font-medium">
                              #{order.code || order._id.slice(-8).toUpperCase()}
                            </TableCell>

                            <TableCell>
                              <div className="font-medium text-sm leading-tight">
                                {order.customerName || "Customer"}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {order.customerEmail || "-"}
                              </div>
                            </TableCell>

                            <TableCell>{order.totalItems}</TableCell>

                            <TableCell className="font-medium">
                              {formatPrice(order.totalAmount)}
                            </TableCell>

                            <TableCell>
                              <AdminPaymentStatusBadge
                                status={order.paymentStatus}
                              />
                            </TableCell>

                            <TableCell>
                              <AdminOrderStatusBadge status={order.orderStatus} />
                            </TableCell>

                            <TableCell className="text-xs text-muted-foreground">
                              {formatDate(order.paidAt || order.createdAt)}
                            </TableCell>

                            <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                              {canUpdate ? (
                                <Select
                                  value={getNextStatusValue(order)}
                                  onValueChange={(value) =>
                                    changeStatus(order._id, value)
                                  }
                                  disabled={updatingOrderId === order._id}
                                >
                                  <SelectTrigger className={selectTriggerClass}>
                                    <SelectValue placeholder="Update Status" />
                                  </SelectTrigger>

                                  <SelectContent>
                                    {orderStatusOptions.map((status) => (
                                      <SelectItem
                                        key={status}
                                        value={status}
                                        disabled={
                                          status === "placed" ||
                                          status === order.orderStatus
                                        }
                                      >
                                        {status}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              ) : (
                                <span className={subTextClass}>
                                  {order.paymentStatus !== "paid"
                                    ? "Not paid"
                                    : order.orderStatus === "returned"
                                      ? "Returned"
                                      : order.orderStatus === "cancelled"
                                        ? "Cancelled"
                                        : "Completed"}
                                </span>
                              )}
                            </TableCell>
                          </TableRow>

                          {/* Expanded row with ordered items and shipping address */}
                          {isExpanded && (
                            <TableRow className="bg-muted/20 border-b border-border/80">
                              <TableCell colSpan={9} className="p-4">
                                <div className="space-y-3.5 max-w-4xl">
                                  {order.deliveryAddress ? (
                                    <div className="flex items-start gap-2 text-xs text-muted-foreground border-b border-border/40 pb-2.5">
                                      <MapPin className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                                      <div>
                                        <span className="font-medium text-foreground">
                                          Shipping to {order.deliveryName}:
                                        </span>{" "}
                                        {order.deliveryAddress}
                                      </div>
                                    </div>
                                  ) : null}

                                  <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                                      <Package className="h-3.5 w-3.5" />
                                      Ordered Items ({order.items?.length || 0})
                                    </p>
                                    {order.items && order.items.length > 0 ? (
                                      <div className="grid gap-2 sm:grid-cols-2">
                                        {order.items.map((item, idx) => (
                                          <div
                                            key={`${item.product}-${idx}`}
                                            className="flex items-center gap-3 p-2.5 rounded border border-border/60 bg-background"
                                          >
                                            {item.image ? (
                                              <img
                                                src={item.image}
                                                alt={item.title || "Item"}
                                                className="h-11 w-11 rounded object-cover border border-border/40 bg-muted shrink-0"
                                              />
                                            ) : (
                                              <div className="h-11 w-11 rounded bg-muted flex items-center justify-center shrink-0 text-muted-foreground">
                                                <ShoppingBag className="h-4 w-4" />
                                              </div>
                                            )}
                                            <div className="min-w-0 flex-1 text-xs">
                                              <p className="font-medium truncate text-foreground">
                                                {item.title || "Product"}
                                              </p>
                                              <div className="text-muted-foreground mt-0.5">
                                                {item.color && <span>Color: {item.color} · </span>}
                                                {item.size && <span>Size: {item.size} · </span>}
                                                <span>Qty: {item.quantity}</span>
                                              </div>
                                              <p className="font-semibold text-foreground mt-0.5">
                                                {formatPrice(item.unitPrice * item.quantity)}
                                              </p>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <p className="text-xs text-muted-foreground">
                                        Item details not recorded for this order.
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </div>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AdminOrders;