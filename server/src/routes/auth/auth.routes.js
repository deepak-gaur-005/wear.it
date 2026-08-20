import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { asyncHandler } from "../../utils/AsyncHandler.js";
import { clerkClient, getAuth } from "@clerk/express";
import { ApiError } from "../../utils/ApiError.js";
import { User } from "../../models/user.model.js";

export const authRouter = Router();

authRouter.post(
    "/sync",
    requireAuth,

    asyncHandler(async (req, res) => {
        const { userId } = getAuth(req);

        if (!userId) {
            throw new ApiError(
                401,
                "User is not authenticated"
            );
        }

        const clerkUser = await clerkClient.users.getUser(userId);

        const emailInfo =
            clerkUser.emailAddresses.find(
                (item) =>
                    item.id === clerkUser.primaryEmailAddressId
            ) || clerkUser.emailAddresses[0];

        const email = emailInfo?.emailAddress;

        const fullName = [
            clerkUser.firstName,
            clerkUser.lastName,
        ]
            .filter(Boolean)
            .join(" ")
            .trim();

        const name = fullName || clerkUser.username;

        const raw = process.env.ADMIN_EMAILS || "";

        const adminEmails = new Set(
            raw
                .split(",")
                .map((item) => item.trim().toLowerCase())
                .filter(Boolean)
        );

        // if the current user is existing user or not 
        // update/do nothing
        // create the user and save in our db with

        const existingUser = await User.findOne({
            clerkUserId: userId,
        });

        const shouldBeAdmin = email
            ? adminEmails.has(email.toLowerCase())
            : false;

        const nextRole =
            existingUser?.role === "admin" 
                ? "admin"
                : shouldBeAdmin
                    ? "admin"
                    : existingUser?.role || "user";

        const dbUser = await User.findOneAndUpdate(
            {
                clerkUserId: userId,
            },
            {
                clerkUserId: userId,
                email,
                name,
                role: nextRole,
            },
            {
                new: true,
                upsert: true,
                setDefaultsOnInsert: true,
            }
        );

        res.status(200).json({
            statusCode: 200,
            data: {
                user: {
                    id: dbUser._id,
                    clerkUserId: dbUser.clerkUserId,
                    email: dbUser.email,
                    name: dbUser.name,
                    role: dbUser.role,
                },
            },
            message: "User synced successfully",
            success: true,
        });
    })
);

authRouter.get(
    "/me",
    requireAuth,

    asyncHandler(async (req, res) => {
        const { userId } = getAuth(req);

        if (!userId) {
            throw new ApiError(
                401,
                "User is not authenticated"
            );
        }

        const dbUser = await User.findOne({
            clerkUserId: userId,
        });

        if (!dbUser) {
            throw new ApiError(
                404,
                "User not found in database"
            );
        }

        res.status(200).json({
            statusCode: 200,
            data: {
                user: {
                    id: dbUser._id,
                    clerkUserId: dbUser.clerkUserId,
                    email: dbUser.email,
                    name: dbUser.name,
                    role: dbUser.role,
                },
            },
            message: "User fetched successfully",
            success: true,
        });
    })
);

