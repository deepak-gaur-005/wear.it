import mongoose from "mongoose";

const productImageSchema = new mongoose.Schema(
    {
        url: {
            type: String,
            required: true,
            trim: true,
        },
        publicId: {
            type: String,
            required: true,
            trim: true,
        },
    },
    { _id: false}
);

const ProductSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        Category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },
        brand: {
            type: String,
            required: true,
            trim: true,
        },
        stock: {
            type: Number,
            required: true,
            min: 0,
        },
        images: {
            type: [productImageSchema],
            default: [],
        },
        colors: {
            type: [String],
            default: [],
        },
        sizes: {
            type: [String],
            default: [],
            enum: ["S","M","L","XL"],
        },
        price: {
            type: Number,
            required: true,
        },
        salePercentage: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        }, 
    },
    { timestamps: true }
)

export const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);