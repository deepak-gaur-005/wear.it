import { Router } from "express";
import mongoose from "mongoose";
import { requireAdmin } from "../../middlewares/auth.middleware.js";
import { Review } from "../../models/review.model.js";
import { asyncHandler } from "../../utils/AsyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { requireFound } from "../../utils/helper.js";

export const adminReviewRouter = Router();

const MAX_PAGE_SIZE = 100;
const REVIEW_STATUSES = new Set(["published", "hidden"]);

adminReviewRouter.use(requireAdmin);

adminReviewRouter.get(
    "/reviews",
    asyncHandler(async (req, res) => {
        const page = req.query.page === undefined ? 1 : Number(req.query.page);
        const limit =
            req.query.limit === undefined ? 25 : Number(req.query.limit);

        if (
            !Number.isSafeInteger(page) ||
            page < 1 ||
            !Number.isSafeInteger(limit) ||
            limit < 1 ||
            limit > MAX_PAGE_SIZE
        ) {
            throw new ApiError(400, "Invalid pagination values");
        }

        const filter = {};
        if (req.query.status !== undefined) {
            if (
                typeof req.query.status !== "string" ||
                !REVIEW_STATUSES.has(req.query.status)
            ) {
                throw new ApiError(400, "Invalid review status");
            }
            filter.status = req.query.status;
        }

        const [items, total] = await Promise.all([
            Review.find(filter)
                .sort({ createdAt: -1, _id: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .populate("user", "name email")
                .populate("product", "title")
                .lean(),
            Review.countDocuments(filter),
        ]);

        res.status(200).json(
            new ApiResponse(
                200,
                {
                    items: items.map((review) => ({
                        ...review,
                        _id: String(review._id),
                        user: review.user
                            ? {
                                  _id: String(review.user._id),
                                  name: review.user.name || "",
                                  email: review.user.email || "",
                              }
                            : null,
                        product: review.product
                            ? {
                                  _id: String(review.product._id),
                                  title: review.product.title,
                              }
                            : null,
                    })),
                    pagination: {
                        page,
                        limit,
                        total,
                        totalPages: Math.ceil(total / limit),
                    },
                },
                "Reviews fetched successfully"
            )
        );
    })
);

adminReviewRouter.patch(
    "/reviews/:reviewId/moderation",
    asyncHandler(async (req, res) => {
        if (!mongoose.isObjectIdOrHexString(req.params.reviewId)) {
            throw new ApiError(400, "Invalid review id");
        }

        const status = req.body?.status;
        if (typeof status !== "string" || !REVIEW_STATUSES.has(status)) {
            throw new ApiError(400, "Status must be published or hidden");
        }

        const review = await Review.findByIdAndUpdate(
            req.params.reviewId,
            { $set: { status } },
            { new: true, runValidators: true }
        );

        const foundReview = requireFound(review, "Review not found", 404);
        res.status(200).json(
            new ApiResponse(
                200,
                foundReview,
                "Review moderation updated successfully"
            )
        );
    })
);

adminReviewRouter.delete(
    "/reviews/:reviewId",
    asyncHandler(async (req, res) => {
        if (!mongoose.isObjectIdOrHexString(req.params.reviewId)) {
            throw new ApiError(400, "Invalid review id");
        }

        const review = await Review.findByIdAndDelete(req.params.reviewId);
        const foundReview = requireFound(review, "Review not found", 404);

        res.status(200).json(
            new ApiResponse(
                200,
                { reviewId: String(foundReview._id) },
                "Review deleted successfully"
            )
        );
    })
);
