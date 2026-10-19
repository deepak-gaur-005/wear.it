import { CommonLoader } from "@/components/common/loader";
import { Badge } from "@/components/ui/badge";
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
import { useEffect } from "react";

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

const orderStatusOptions = ["placed", "shipped", "delivered"];

function formatDate(value) {
  return value ? new Date(value).toLocaleDateString() : "-";
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

function canUpdateStatus(order) {
  if (order.paymentStatus !== "paid") return false;
  if (order.orderStatus === "delivered") return false;
  if (order.orderStatus === "returned") return false;

  return true;
}

function getNextStatusValue(order) {
  if (order.orderStatus === "delivered" || order.orderStatus === "returned") {
    return "";
  }

  return order.orderStatus;
}

function AdminOrders() {
  const { loading, orders, updatingOrderId, fetchOrders, changeStatus } =
    useAdminOrdersStore((state) => state);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (loading) return <CommonLoader />;

  return (
    <div className={pageWrapClass}>
      <div className={contentWrapClass}>
        <Card className={cardClass}>
          <CardHeader className={wrapClass}>
            <CardTitle className={titleClass}>Orders</CardTitle>
          </CardHeader>

          <CardContent>
            {!orders.length ? (
              <div className={emptyClass}>No Orders found</div>
            ) : (
              <div className={tableWrapClass}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Paid at</TableHead>
                      <TableHead className="text-right">Update</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {orders.map((order) => {
                      const canUpdate = canUpdateStatus(order);

                      return (
                        <TableRow key={order._id}>
                          <TableCell className="font-medium">
                            {order._id}
                          </TableCell>

                          <TableCell>{order.customerName}</TableCell>
                          <TableCell>{order.totalItems}</TableCell>

                          <TableCell>
                            {formatPrice(order.totalAmount)}
                          </TableCell>

                          <TableCell>
                            <AdminPaymentStatusBadge
                              status={order.paymentStatus}
                            />
                          </TableCell>

                          <TableCell>
                            {formatDate(order.paidAt || order.createdAt)}
                          </TableCell>

                          <TableCell className="text-right">
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
                                  ? "Payment not paid"
                                  : order.orderStatus === "returned"
                                    ? "Returned"
                                    : "Completed"}
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
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