import { Router } from "express";
import multer from "multer";
import { Banner } from "../../models/banner.model.js";
import { getDbUserFromReq, requireAdmin } from "../../middlewares/auth.middleware.js";
import { asyncHandler } from "../../utils/AsyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import {
    deleteFromCloudinary,
    uploadManyBuffersToCloudinary,
} from "../../utils/cloudinary.js";
import mongoose from "mongoose";

function mapBanner(item) {
    return {
        _id: String(item._id),
        imageUrl: item.imageUrl,
        imagePublicId: item.imagePublicId,
        createdAt: item.createdAt.toISOString(),
    };
}

const BANNER_FOLDER = "ecommerce-wearit-video/banners";

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 10,
    },
});

export const adminSettingsRouter = Router();

adminSettingsRouter.use(requireAdmin);

// Fetches all banners for the admin panel.
adminSettingsRouter.get(
    "/settings/banners",
    asyncHandler(async (req, res) => {
        const items = await Banner.find()
            .sort({ createdAt: -1 });

        res.status(200).json(
            new ApiResponse(
                200,
                {
                    items: items.map(mapBanner),
                },
                "Banners fetched successfully"
            )
        );
    })
);

// Uploads banner images to Cloudinary and saves them in MongoDB.
adminSettingsRouter.post(
    "/settings/banners",
    upload.array("images", 10),
    asyncHandler(async (req, res) => {
        const dbUser = await getDbUserFromReq(req);
        const files = req.files || [];

        if (!files.length) {
            throw new ApiError(
                400,
                "At least one image is required"
            );
        }

        const uploadedImages =
            await uploadManyBuffersToCloudinary(
                files.map((file) => file.buffer),
                BANNER_FOLDER
            );

        const createdBanners =
            await Banner.insertMany(
                uploadedImages.map((item) => ({
                    imageUrl: item.url,
                    imagePublicId: item.publicId,
                    createdBy: dbUser._id,
                }))
            );

        res.status(201).json(
            new ApiResponse(
                201,
                {
                    items: createdBanners.map(mapBanner),
                },
                "Banners uploaded successfully"
            )
        );
    })
);

adminSettingsRouter.delete(
    "/settings/banners/:bannerId",
    asyncHandler(async (req, res) => {
        const bannerId = String(req.params.bannerId || "").trim();

        if (!mongoose.Types.ObjectId.isValid(bannerId)) {
            throw new ApiError(
                400,
                "Banner id is invalid"
            );
        }

        const banner = await Banner.findById(bannerId);

        if (!banner) {
            throw new ApiError(
                404,
                "Banner not found"
            );
        }

        const cloudinaryResult = await deleteFromCloudinary(
            banner.imagePublicId
        );

        if (
            cloudinaryResult.result !== "ok" &&
            cloudinaryResult.result !== "not found"
        ) {
            throw new ApiError(
                502,
                "Failed to delete banner image from Cloudinary"
            );
        }

        const deleteResult = await Banner.deleteOne({ _id: banner._id });

        if (deleteResult.deletedCount !== 1) {
            throw new ApiError(
                404,
                "Banner not found"
            );
        }

        res.status(200).json(
            new ApiResponse(
                200,
                { bannerId: String(banner._id) },
                "Banner deleted successfully"
            )
        );
    })
);