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
    "/products",
    asyncHandler(async (req, res) => {
        //filters lena url se filter nikl rhe hey
        const category = (req.query.category || "").trim();
        const brand = (req.query.brand || "").trim();
        const color = (req.query.color || "").trim();
        const size = (req.query.size || "").trim();
        const sort = req.query.sort || "recent";

        const query = {
            status: "active", // only active product needed
        }
        // adding filters
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

        let sortOption = { createdAt: -1 };

        if (sort === "price-low") {
            sortOption = { price: 1 };
        }

        if (sort === "price-high") {
            sortOption = { price: -1 };
        }

        const products = await Product.find(query)
            .populate("category", "name") //product ke category ObjectId ke saath category ka name bhi MongoDB se lao
            .sort(sortOption); //sorting apply krta hey

        res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    products,
                    "Products fetched successfully"
                )
            );

    })
)

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