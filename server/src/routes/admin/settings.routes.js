import { Router } from "express";
import multer from "multer";
import { Banner } from "../../models/banner.model.js";
import { getDbUserFromReq, requireAdmin } from "../../middlewares/auth.middleware.js";
import { asyncHandler } from "../../utils/AsyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { uploadManyBuffersToCloudinary } from "../../utils/cloudinary.js";

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