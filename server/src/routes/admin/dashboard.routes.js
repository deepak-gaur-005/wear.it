import { Router } from "express";
import { requireAdmin } from "../../middlewares/auth.middleware.js";
import { asyncHandler } from "../../utils/AsyncHandler.js";
import { Product } from "../../models/product.model.js";
import { Category } from "../../models/category.model.js";
import { Order } from "../../models/order.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

export const adminDashboardRouter = Router();

adminDashboardRouter.use(requireAdmin);

// Fetches basic statistics for the admin dashboard.
adminDashboardRouter.get(
    "/dashboard/lite",
    asyncHandler(async (_req, res) => {
        const [
            totalProducts,
            totalCategories,
            totalOrders,
            totalReturnedOrders,
            salesRows,
        ] = await Promise.all([
            Product.countDocuments(),
            Category.countDocuments(),
            Order.countDocuments(),
            Order.countDocuments({
                orderStatus: "returned",
            }),
            Order.aggregate([
                { $match: { paymentStatus: "paid" } },
                {
                    $group: {
                        _id: null,
                        totalSales: {
                            $sum: "$totalAmount",
                        },
                    },
                },
            ]),
        ]);

        res.status(200).json(
            new ApiResponse(
                200,
                {
                    totalProducts,
                    totalCategories,
                    totalSales:
                        salesRows[0]?.totalSales || 0,
                    totalOrders,
                    totalReturnedOrders,
                },
                "Dashboard data fetched successfully"
            )
        );
    })
);