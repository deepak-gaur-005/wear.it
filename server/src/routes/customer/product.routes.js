import { Router } from "express";
import { requireFound } from "../../utils/helper.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

import { Category } from "../../models/category.model.js";
import { Product } from "../../models/product.model.js";
import { asyncHandler } from "../../utils/AsyncHandler.js";


export const customerProductRouter = Router();

customerProductRouter.get(
    "/categories",
    asyncHandler(async (_req, res) => { // _ -> tells parameter available but we cant use it
        const categories = await Category.find({}).sort({ name: 1 });

        res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    categories,
                    "Categories fetched successfully"
                )
            );
    })
);

customerProductRouter.get(
    "/products/facets",
    asyncHandler(async (_req, res) => {
        const [colors, brands] = await Promise.all([
            Product.distinct("colors", { status: "active" }),
            Product.distinct("brand", { status: "active" }),
        ]);

        const filteredColors = colors.filter(Boolean).sort((a, b) => a.localeCompare(b));
        const filteredBrands = brands.filter(Boolean).sort((a, b) => a.localeCompare(b));

        res.status(200).json(
            new ApiResponse(
                200,
                {
                    colors: filteredColors,
                    brands: filteredBrands,
                },
                "Facets fetched successfully"
            )
        );
    })
);

customerProductRouter.get(
    "/products",
    asyncHandler(async (req, res) => {
        // Parse filter and search parameters from URL query
        const search = (req.query.search || req.query.q || "").trim();
        const category = (req.query.category || "").trim();
        const brand = (req.query.brand || "").trim();
        const color = (req.query.color || "").trim();
        const size = (req.query.size || "").trim();
        const minPrice = Number(req.query.minPrice);
        const maxPrice = Number(req.query.maxPrice);
        const sort = req.query.sort || "recent";

        const query = {
            status: "active", // only active products
        };

        // Text search across title, brand, and description
        if (search) {
            const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            const regex = new RegExp(escaped, "i");
            query.$or = [
                { title: regex },
                { brand: regex },
                { description: regex },
            ];
        }

        if (category) {
            query.category = category;
        }

        if (brand) {
            query.brand = brand;
        }

        if (color) {
            query.colors = color;
        }

        if (size) {
            query.sizes = size;
        }

        if (!Number.isNaN(minPrice) || !Number.isNaN(maxPrice)) {
            query.price = {};
            if (!Number.isNaN(minPrice) && minPrice >= 0) {
                query.price.$gte = minPrice;
            }
            if (!Number.isNaN(maxPrice) && maxPrice > 0) {
                query.price.$lte = maxPrice;
            }
        }

        let sortOption = { createdAt: -1 };

        if (sort === "price-low") {
            sortOption = { price: 1 };
        } else if (sort === "price-high") {
            sortOption = { price: -1 };
        } else if (sort === "sale") {
            sortOption = { salePercentage: -1 };
        }

        const products = await Product.find(query)
            .populate("category", "name")
            .sort(sortOption);

        res.status(200).json(
            new ApiResponse(
                200,
                products,
                "Products fetched successfully"
            )
        );
    })
);

customerProductRouter.get(
    "/products/:id",
    asyncHandler(async (req, res) => {
        const productId = req.params.id;

        const product = await Product.findOne({
            _id: productId,
            status: "active",
        }).populate("category", "name");

        const foundProduct = requireFound(
            product,
            "Product not found",
            404
        );

        const relatedProducts = await Product.find({
            _id: { $ne: foundProduct._id }, //$ne -> not equal
            category: foundProduct.category,
            status: "active",
        }) //same category ke active products lao lekin current product ko exclude kardo
            .populate("category", "name")
            .sort({ createdAt: -1})
            .limit(4);  //only 4 related products

        res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    {
                        product: foundProduct,
                        relatedProducts,
                    },
                    "Product fetched successfully"
                )
            );
        
    })
)