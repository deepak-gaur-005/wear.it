import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
            validate: Number.isInteger,
        },
        text: {
            type: String,
            required: true,
            trim: true,
            maxlength: 2000,
        },
        status: {
            type: String,
            enum: ["published", "hidden"],
            default: "published",
            required: true,
        },
    },
    { timestamps: true }
);

reviewSchema.index({ user: 1, product: 1 }, { unique: true });
reviewSchema.index({ product: 1, status: 1, createdAt: -1 });

export const Review =
    mongoose.models.Review || mongoose.model("Review", reviewSchema);
