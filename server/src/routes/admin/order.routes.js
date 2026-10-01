import { Router } from "express";
import { Order } from "../../models/order.model.js";
import { requireAdmin } from "../../middlewares/auth.middleware.js";
import { asyncHandler } from "../../utils/AsyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { requireFound, requireText } from "../../utils/helper.js";
import { ApiError } from "../../utils/ApiError.js";
import { Product } from "../../models/product.model.js";

const ALLOWED_ORDER_STATUSES = [
    "placed",
    "shipped",
    "delivered",
    "returned",
];

export const adminOrderRouter = Router();

adminOrderRouter.use(requireAdmin);

// Fetches all orders for the admin panel.
adminOrderRouter.get(
    "/orders",
    asyncHandler(async (req, res) => {
        const orders = await Order.find()
            .select(
                "customerName customerEmail totalItems totalAmount paymentStatus orderStatus paidAt deliveredAt returnedAt createdAt"
            )
            .sort({ createdAt: -1 })
            .lean();

        res.status(200).json(
            new ApiResponse(
                200,
                {
                    items: orders.map((orderItem) => ({
                        _id: String(orderItem._id),
                        code: String(orderItem._id)
                            .slice(-8)
                            .toUpperCase(),
                        customerName: orderItem.customerName,
                        customerEmail: orderItem.customerEmail,
                        totalItems: orderItem.totalItems,
                        totalAmount: orderItem.totalAmount,
                        paymentStatus: orderItem.paymentStatus,
                        orderStatus: orderItem.orderStatus,
                        paidAt: orderItem.paidAt,
                        deliveredAt: orderItem.deliveredAt,
                        returnedAt: orderItem.returnedAt,
                        createdAt: orderItem.createdAt,
                    })),
                },
                "Orders fetched successfully"
            )
        );
    })
);

// Updates an order status and handles delivery or return actions.
adminOrderRouter.patch(
    "/orders/:orderId/status",
    asyncHandler(async (req, res) => {
        const orderId = String(
            req.params.orderId || ""
        ).trim();

        const orderStatus = String(
            req.body.orderStatus || ""
        ).trim();

        requireText(
            orderId,
            "Order Id is required"
        );

        requireText(
            orderStatus,
            "orderStatus is required"
        );

        if (!ALLOWED_ORDER_STATUSES.includes(orderStatus)) {
            throw new ApiError(
                400,
                "Invalid order status"
            );
        }

        const order = await Order.findById(orderId);

        const foundOrder = requireFound(
            order,
            "Order not found",
            404
        );

        // Return the products to stock when an order is returned.
        if (
            orderStatus === "returned" &&
            foundOrder.orderStatus !== "returned"
        ) {
            for (const item of foundOrder.items) {
                await Product.updateOne(
                    {
                        _id: item.product,
                    },
                    {
                        $inc: {
                            stock: item.quantity,
                        },
                    }
                );
            }

            foundOrder.returnedAt = new Date();
        }

        // Store the time when the order was delivered.
        if (
            orderStatus === "delivered" &&
            !foundOrder.deliveredAt
        ) {
            foundOrder.deliveredAt = new Date();
        }

        foundOrder.orderStatus = orderStatus;

        await foundOrder.save();

        res.status(200).json(
            new ApiResponse(
                200,
                {
                    _id: String(foundOrder._id),
                    orderStatus: foundOrder.orderStatus,
                    deliveredAt: foundOrder.deliveredAt,
                    returnedAt: foundOrder.returnedAt,
                },
                "Order status updated successfully"
            )
        );
    })
);