import { getAuth } from "@clerk/express";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export function requireAuth(req, res, next) {
    const { userId } = getAuth(req);

    if (!userId) {
        return next(
            new ApiError(401, "User is not authenticated")
        );
    }

    next();
}

export async function getDbUserFromReq(req) {
    const { userId } = getAuth(req);

    if (!userId) {
        throw new ApiError(401, "User is not authenticated");
    }

    const dbUser = await User.findOne({
        clerkUserId: userId,
    });

    if (!dbUser) {
        throw new ApiError(404, "User not found in database");
    }

    return dbUser;
}

export const requireAdmin = asyncHandler(
    async (req, res, next) => {
        const currentDbUser = await getDbUserFromReq(req);

        if (currentDbUser.role !== "admin") {
            throw new ApiError(403, "Admin access only");
        }

        next();
    }
);