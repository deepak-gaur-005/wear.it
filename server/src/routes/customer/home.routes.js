import { Router } from "express";
import { asyncHandler } from "../../utils/AsyncHandler.js";
import { Banner } from "../../models/banner.model.js";
import { Category } from "../../models/category.model.js";
import { Product } from "../../models/product.model.js";
import { Promo } from "../../models/promo.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

export const customerHomeRouter = Router();

customerHomeRouter.get(
    "/home",
    asyncHandler(async (_req, res) => {
        const now = new Date();

        // Fetch homepage data from all required collections in parallel.
        const [banners, categories, recentProducts, promos] =
            await Promise.all([
                Banner.find()
                    .sort({ createdAt: -1 })
                    .limit(6)
                    .lean(),

                Category.find()
                    .sort({ name: 1 })
                    .lean(),

                Product.find({ status: "active" })
                    .select(
                        "title brand price salePercentage images createdAt"
                    )
                    .sort({ createdAt: -1 })
                    .limit(4)
                    .lean(),

                Promo.find({
                    startsAt: { $lte: now },
                    endsAt: { $gte: now },
                    count: { $gt: 0 },
                })
                    .sort({ createdAt: -1 })
                    .limit(4)
                    .lean(),
            ]);

        res.status(200).json(
            new ApiResponse(
                200,
                {
                    banners: banners.map((bannerItem) => ({
                        _id: String(bannerItem._id),
                        imageUrl: bannerItem.imageUrl,
                        createdAt: bannerItem.createdAt.toISOString(),
                    })),

                    categories: categories.map(
                        (categoryItem) => ({
                            _id: String(categoryItem._id),
                            name: categoryItem.name,
                        })
                    ),

                    recentProducts: recentProducts.map(
                        (recentProductItem) => {
                            // Use the cover image first, then fall back to the first image.
                            const image =
                                recentProductItem.images.find(
                                    (item) => item.isCover
                                )?.url ||
                                recentProductItem.images[0]?.url ||
                                "";

                            // Calculate the selling price after applying the discount.
                            const finalPrice =
                                recentProductItem.salePercentage
                                    ? Math.round(
                                        recentProductItem.price - (recentProductItem.price * recentProductItem.salePercentage) / 100
                                    )
                                    : recentProductItem.price;

                            return {
                                _id: String(
                                    recentProductItem._id
                                ),
                                title:
                                    recentProductItem.title,
                                brand:
                                    recentProductItem.brand,
                                image,
                                price:
                                    recentProductItem.price,
                                finalPrice,
                                salePercentage:
                                    recentProductItem.salePercentage,
                                createdAt:
                                    recentProductItem.createdAt.toISOString(),
                            };
                        }
                    ),

                    coupons: promos.map((promoItem) => ({
                        _id: String(promoItem._id),
                        code: promoItem.code,
                        percentage:
                            promoItem.percentage,
                        count: promoItem.count,
                        minimumOrderValue:
                            promoItem.minimumOrderValue,
                        endsAt:
                            promoItem.endsAt.toISOString(),
                    })),
                },
                "Home data fetched successfully"
            )
        );
    })
);