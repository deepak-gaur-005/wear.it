import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
    {
        fullname: {
            type: string,
            required: true,
            trim: true,
        },
        address: {
            type: string,
            required: true,
            trim: true,
        },
        state: {
            type: string,
            required: true,
            trim: true,
        },
        postalCode: {
            type: string,
            required: true,
            trim: true,
        },
        isDefault: {
            type: boolean,
            default: false,
        },
    },
    {
        timestamps: false,
    }
)

const userSchema = new mongoose>Schema(
    {
        clerkUserId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        name: {
            type: String,
            required: false,
        },
        email: {
            type: String,
            required: false,
        },
        role: {
            type: string,
            enum: ["user", "admin"],
            default: "user",
        },
        addresses: {
            type: [addressSchema],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

export const User = mongoose.models.User || mongoose.model("User", userSchema);