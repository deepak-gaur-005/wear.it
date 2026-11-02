import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

const databaseErrorNames = new Set([
    "MongooseServerSelectionError",
    "MongoServerSelectionError",
    "MongoNetworkError",
    "MongoNetworkTimeoutError",
]);

const errorHandler = (err, req, res, _next) => {
    // Custom structured API errors
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json(
            new ApiResponse(
                err.statusCode,
                err.data,
                err.message,
                err.errors || []
            )
        );
    }

    // Multer file upload errors
    if (err.name === "MulterError") {
        let message = "File upload error";
        if (err.code === "LIMIT_FILE_SIZE") {
            message = "Uploaded file exceeds the 5MB size limit";
        } else if (err.code === "LIMIT_FILE_COUNT") {
            message = "Too many files uploaded (maximum is 10)";
        } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
            message = "Unexpected field in file upload";
        }

        return res.status(400).json(
            new ApiResponse(400, null, message)
        );
    }

    // Mongoose Invalid ObjectId CastError
    if (err.name === "CastError") {
        return res.status(400).json(
            new ApiResponse(
                400,
                null,
                `Invalid identifier format for: ${err.path || "resource"}`
            )
        );
    }

    // Mongoose Schema Validation error
    if (err.name === "ValidationError") {
        const errors = Object.values(err.errors || {}).map((e) => ({
            field: e.path,
            message: e.message,
        }));
        const message = errors[0]?.message || "Validation failed";

        return res.status(400).json(
            new ApiResponse(400, null, message, errors)
        );
    }

    console.error("Unhandled Error:", err);

    const databaseUnavailable =
        mongoose.connection.readyState !== 1 ||
        databaseErrorNames.has(err.name) ||
        /buffering timed out/i.test(err.message || "");

    if (databaseUnavailable) {
        return res.status(503).json(
            new ApiResponse(
                503,
                null,
                "Database unavailable. Check the MongoDB connection."
            )
        );
    }

    // Production safe 500 error response without leaking stack traces or credentials
    return res.status(500).json(
        new ApiResponse(
            500,
            null,
            "Internal server error"
        )
    );
};

export { errorHandler }