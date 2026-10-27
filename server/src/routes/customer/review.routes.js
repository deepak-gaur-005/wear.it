import { Router } from "express";
import mongoose from "mongoose";
import { getDbUserFromReq, requireAuth } from "../../middlewares/auth.middleware.js";
import { Order } from "../../models/order.model.js";
import { Product } from "../../models/product.model.js";
import { Review } from "../../models/review.model.js";
import { asyncHandler } from "../../utils/AsyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { requireFound } from "../../utils/helper.js";

export const customerReviewRouter = Router();

const MAX_PAGE_SIZE = 50;
const REVIEW_SORTS = {
    newest: { createdAt: -1, _id: -1 },
    highest: { rating: -1, createdAt: -1, _id: -1 },
    lowest: { rating: 1, createdAt: -1, _id: -1 },
};

function parsePagination(query) {
    const page = query.page === undefined ? 1 : Number(query.page);
    const limit = query.limit === undefined ? 10 : Number(query.limit);

    if (
        !Number.isSafeInteger(page) ||
        page < 1 ||
        !Number.isSafeInteger(limit) ||
        limit < 1 ||
        limit > MAX_PAGE_SIZE
    ) {
        throw new ApiError(400, "Invalid pagination values");
    }

    return { page, limit };
}

function requireObjectId(value, message) {
    if (!mongoose.isObjectIdOrHexString(value)) {
        throw new ApiError(400, message);
    }
}

function getReviewInput(body) {
    const { rating, text } = body || {};

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        throw new ApiError(400, "Rating must be an integer from 1 to 5");
    }

    if (typeof text !== "string") {
        throw new ApiError(400, "Review text is required");
    }

    const trimmedText = text.trim();
    if (!trimmedText || trimmedText.length > 2000) {
        throw new ApiError(
            400,
            "Review text must contain between 1 and 2000 characters"
        );
    }

    return { rating, text: trimmedText };
}

async function requireActiveProduct(productId) {
    requireObjectId(productId, "Invalid product id");
    const product = await Product.findOne({
        _id: productId,
        status: "active",
    })
        .select("_id")
        .lean();

    return requireFound(product, "Product not found", 404);
}

async function getVerifiedPurchaseUserIds(productId, userIds) {
    if (!userIds.length) return new Set();

    const qualifyingOrders = await Order.find({
        user: { $in: userIds },
        "items.product": productId,
        paymentStatus: "paid",
        orderStatus: "delivered",
        deliveredAt: { $ne: null },
    })
        .select("user")
        .lean();

    return new Set(qualifyingOrders.map((order) => String(order.user)));
}

async function getRatingSummary(productId) {
    const ratingCounts = await Review.aggregate([
        { $match: { product: productId, status: "published" } },
        { $group: { _id: "$rating", count: { $sum: 1 } } },
    ]);

    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let totalReviewCount = 0;
    let weightedRatingTotal = 0;

    for (const entry of ratingCounts) {
        distribution[entry._id] = entry.count;
        totalReviewCount += entry.count;
        weightedRatingTotal += entry._id * entry.count;
    }

    return {
        averageRating:
            totalReviewCount === 0
                ? 0
                : Number((weightedRatingTotal / totalReviewCount).toFixed(2)),
        totalReviewCount,
        ratingDistribution: distribution,
    };
}

customerReviewRouter.get(
    "/products/:productId/reviews",
    asyncHandler(async (req, res) => {
        const product = await requireActiveProduct(req.params.productId);
        const sort = req.query.sort === undefined ? "newest" : req.query.sort;

        if (typeof sort !== "string" || !REVIEW_SORTS[sort]) {
            throw new ApiError(400, "Sort must be newest, highest, or lowest");
        }

        const { page, limit } = parsePagination(req.query);
        const filter = { product: product._id, status: "published" };

        const [reviews, totalReviewCount, summary] = await Promise.all([
            Review.find(filter)
                .select("user rating text createdAt updatedAt")
                .sort(REVIEW_SORTS[sort])
                .skip((page - 1) * limit)
                .limit(limit)
                .populate("user", "name")
                .lean(),
            Review.countDocuments(filter),
            getRatingSummary(product._id),
        ]);

        const verifiedUserIds = await getVerifiedPurchaseUserIds(
            product._id,
            [...new Set(reviews.map((review) => review.user?._id).filter(Boolean))]
        );

        res.status(200).json(
            new ApiResponse(
                200,
                {
                    items: reviews.map((review) => ({
                        _id: String(review._id),
                        user: {
                            _id: review.user?._id
                                ? String(review.user._id)
                                : "",
                            name: review.user?.name || "Customer",
                        },
                        rating: review.rating,
                        text: review.text,
                        verifiedPurchase: review.user?._id
                            ? verifiedUserIds.has(String(review.user._id))
                            : false,
                        createdAt: review.createdAt,
                        updatedAt: review.updatedAt,
                    })),
                    summary,
                    pagination: {
                        page,
                        limit,
                        total: totalReviewCount,
                        totalPages: Math.ceil(totalReviewCount / limit),
                    },
                },
                "Reviews fetched successfully"
            )
        );
    })
);

customerReviewRouter.get(
    "/products/:productId/reviews/mine",
    requireAuth,
    asyncHandler(async (req, res) => {
        const product = await requireActiveProduct(req.params.productId);
        const dbUser = await getDbUserFromReq(req);
        const review = await Review.findOne({
            product: product._id,
            user: dbUser._id,
        })
            .select("rating text status createdAt updatedAt")
            .lean();

        res.status(200).json(
            new ApiResponse(200, review, "Your review fetched successfully")
        );
    })
);

customerReviewRouter.post(
    "/products/:productId/reviews",
    requireAuth,
    asyncHandler(async (req, res) => {
        const product = await requireActiveProduct(req.params.productId);
        const dbUser = await getDbUserFromReq(req);
        const input = getReviewInput(req.body);

        try {
            const review = await Review.create({
                product: product._id,
                user: dbUser._id,
                ...input,
            });

            res.status(201).json(
                new ApiResponse(201, review, "Review submitted successfully")
            );
        } catch (error) {
            if (error?.code === 11000) {
                throw new ApiError(
                    409,
                    "You have already reviewed this product"
                );
            }

            throw error;
        }
    })
);

customerReviewRouter.patch(
    "/reviews/:reviewId",
    requireAuth,
    asyncHandler(async (req, res) => {
        requireObjectId(req.params.reviewId, "Invalid review id");
        const dbUser = await getDbUserFromReq(req);
        const input = getReviewInput(req.body);

        const review = await Review.findOneAndUpdate(
            { _id: req.params.reviewId, user: dbUser._id },
            { $set: input },
            { new: true, runValidators: true }
        );

        const foundReview = requireFound(review, "Review not found", 404);
        res.status(200).json(
            new ApiResponse(200, foundReview, "Review updated successfully")
        );
    })
);

customerReviewRouter.delete(
    "/reviews/:reviewId",
    requireAuth,
    asyncHandler(async (req, res) => {
        requireObjectId(req.params.reviewId, "Invalid review id");
        const dbUser = await getDbUserFromReq(req);
        const review = await Review.findOneAndDelete({
            _id: req.params.reviewId,
            user: dbUser._id,
        });

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
