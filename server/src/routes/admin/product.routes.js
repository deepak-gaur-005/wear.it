import { Router } from 'express';
import { Category } from '../../models/category.model.js';
import { Product } from '../../models/product.model.js';
import { requireAdmin, requireAuth } from "../../middlewares/auth.middleware.js";
import { asyncHandler } from "../../utils/AsyncHandler.js";
import { requireFound, requireNumber, requireText } from '../../utils/helper.js';
import { uploadManyyBuffersToCloudinary } from '../../utils/cloudinary.js';
import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import multer from "multer";

export const adminProductRouter = Router();

const ok = (data, message = "Success") => new ApiResponse(200, data, message);

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fieldSize: 5 * 1024 * 1024,
        files: 10,
    }
});

adminProductRouter.use(requireAdmin);

// Categories

adminProductRouter.get(
    "/categories",
    asyncHandler(async (_req, res) => {
        const categories = await Category.find({}).sort({ name: 1 });
        res.json(ok(categories));
    })
);

adminProductRouter.post(
    "/categories",
    asyncHandler(async (req, res) => {
        const name = String(req.body.name || "").trim();

        requireText(name, "category name is needed");

        const category = await Category.create({ name });
        res.status(201).json(ok(category));
    })
);

adminProductRouter.put(
    "/categories/:id",
    asyncHandler(async (req, res) => {
        const name = String(req.body.name || "").trim();
        const categoryId = req.params.id;

        requireText(name, "category name is needed");

        const existingCategory = await Category.findById(categoryId);
        const category = requireFound(existingCategory, "Category not found");

        category.name = name;
        await category.save();

        res.json(ok(category));
    })
)

// Products

adminProductRouter.get(
    "/products",
    asyncHandler(async (req, res) => {
        const search = String(req.query.search || "").trim();
        const query = {};

        if (search) {
            query.title = { $regex: search, $options: "i" };
        }

        const products = await Product.find(query)
            .populate("category", "name")
            .sort({ createdAt: -1 });

        res.json(ok(products));
    })
);

adminProductRouter.get(
    "/products/:id",
    asyncHandler(async (req, res) => {
        const productId = req.params.id;

        const product = await Product.findById(productId).populate(
            "category",
            "name"
        );

        requireFound(product, "Product not found", 404);

        res.json(ok(product));
    })
);

adminProductRouter.put(
  "/products/:id",
  upload.array("images", 10),
  asyncHandler(async (req, res) => {
    const productId = req.params.id;
    const title = String(req.body.title || "").trim();
    const description = String(req.body.description || "").trim();
    const category = String(req.body.category || "").trim();
    const brand = String(req.body.brand || "").trim();
    const price = Number(req.body.price);
    const salePercentage = Number(req.body.salePercentage || 0);
    const stock = Number(req.body.stock);
    const status = String(req.body.status || "active").trim();
    const colors = req.body.colors || [];
    const sizes = req.body.sizes || [];
    const coverImagePublicId = String(req.body.coverImagePublicId || "").trim();

    requireText(title, "Title is required");
    requireText(description, "Description is required");
    requireText(category, "Category is required");
    requireText(brand, "Brand is required");

    requireNumber(price, "Price is required");
    requireNumber(salePercentage, "Sale Percentage is required");
    requireNumber(stock, "Stock is required");

    const existingCategoryDoc = await Category.findById(category);
    const existingCategory = requireFound(existingCategoryDoc, "Category not found");

    const productDoc = await Product.findById(productId);
    const product = requireFound(productDoc, "Product not found");

    const files = req.files || [];
    const uploadNewImages = await uploadManyyBuffersToCloudinary(
        files.map((file) => file.buffer)
    );

    const newlyAddedImages = uploadNewImages.map((image) => ({
        url: image.url,
        publicId: image.publicId,
        isCover: image.isCover,
    }));

    const existingImages = (product.images || []).map((img) => ({
        url: img.url,
        publicId: img.publicId,
        isCover: img.isCover,
    }));

    const mergedImages = [...existingImages, ...newlyAddedImages];

    if (!mergedImages.length) {
        throw new ApiError(400, "At least one image is needed");
    }

    const finalImages = mergedImages.map((image, index) => ({
        url: image.url,
        publicId: image.publicId,
        isCover: coverImagePublicId
            ? image.publicId === coverImagePublicId
            : index === 0,
    }));

    product.title = title;
    product.description = description;
    product.category = existingCategory._id;
    product.brand = brand;
    product.colors = colors;
    product.sizes = sizes;
    product.price = price;
    product.salePercentage = salePercentage;
    product.stock = stock;
    product.status = status;
    product.set("images", finalImages);

    await product.save();

    const updatedProduct = await Product.findById(product._id).populate(
        "category",
        "name"
    );

    res.json(ok(updatedProduct));
  })
);