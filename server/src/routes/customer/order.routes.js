import { Router } from "express";
import {
    getDbUserFromReq,
    requireAuth,
} from "../../middlewares/auth.middleware.js";
import { Order } from "../../models/order.model.js";
import { Product } from "../../models/product.model.js";
import { User } from "../../models/user.model.js";
import { asyncHandler } from "../../utils/AsyncHandler.js";
import { requireFound, requireText } from "../../utils/helper.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

export const customerOrderRouter = Router();

customerOrderRouter.use(requireAuth);

// Gets the logged-in customer's orders and returns a simplified list for the UI.
customerOrderRouter.get(
    "/orders",
    asyncHandler(async (req, res) => {
        const dbUser = await getDbUserFromReq(req);

        const orders = await Order.find({
            user: dbUser._id,
        })
            .select(
                "totalItems totalAmount paymentStatus orderStatus paidAt deliveredAt returnedAt createdAt"
            )
            .sort({ createdAt: -1 })
            .lean();

        const items = orders.map((orderItem) => ({
            _id: String(orderItem._id),
            code: String(orderItem._id)
                .slice(-8)
                .toUpperCase(),
            totalItems: orderItem.totalItems,
            totalAmount: orderItem.totalAmount,
            paymentStatus: orderItem.paymentStatus,
            orderStatus: orderItem.orderStatus,
            paidAt: orderItem.paidAt,
            deliveredAt: orderItem.deliveredAt,
            returnedAt: orderItem.returnedAt,
            createdAt: orderItem.createdAt,
        }));

        res.status(200).json(
            new ApiResponse(
                200,
                { items },
                "Orders fetched successfully"
            )
        );
    })
);

// Returns a delivered order within 7 days, restores its stock, and gives the customer points.
customerOrderRouter.patch(
    "/orders/:orderId/return",
    asyncHandler(async (req, res) => {
        const dbUser = await getDbUserFromReq(req);

        const orderId = String(
            req.params.orderId || ""
        ).trim();

        requireText(
            orderId,
            "Order Id is required"
        );

        const order = await Order.findOne({
            _id: orderId,
            user: dbUser._id,
        });

        const foundOrder = requireFound(
            order,
            "Order not found",
            404
        );

        if (
            foundOrder.orderStatus !== "delivered" ||
            !foundOrder.deliveredAt
        ) {
            throw new ApiError(
                400,
                "Only delivered orders can be returned"
            );
        }

        const sevenDaysReturnWindowTime =
            7 * 24 * 60 * 60 * 1000;

        const deliveredTime =
            new Date(
                foundOrder.deliveredAt
            ).getTime();

        if (
            Date.now() - deliveredTime >
            sevenDaysReturnWindowTime
        ) {
            throw new ApiError(
                400,
                "Return window expired"
            );
        }

        // Restore the quantity of every returned product back into stock.
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

        // Give the customer points equal to the order's total amount.
        await User.updateOne(
            {
                _id: dbUser._id,
            },
            {
                $inc: {
                    points: foundOrder.totalAmount,
                },
            }
        );

        // Mark the order as returned so it cannot be returned again.
        foundOrder.orderStatus = "returned";
        foundOrder.returnedAt = new Date();

        await foundOrder.save();

        res.status(200).json(
            new ApiResponse(
                200,
                {
                    _id: String(foundOrder._id),
                    orderStatus: foundOrder.orderStatus,
                    returnedAt: foundOrder.returnedAt,
                },
                "Order returned successfully"
            )
        );
    })
);