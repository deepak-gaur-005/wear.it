import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

const databaseErrorNames = new Set([
    "MongooseServerSelectionError",
    "MongoServerSelectionError",
    "MongoNetworkError",
    "MongoNetworkTimeoutError",
]);

const errorHandler = (err, req, res, next) => {
    if ( err instanceof ApiError) {
        return res
        .status(err.statusCode)
        .json(
            new ApiResponse( 
                err.statusCode,
                err.data,
                err.message
            )
        );
    }

    console.error("Error:", err);

    const databaseUnavailable =
        mongoose.connection.readyState !== 1 ||
        databaseErrorNames.has(err.name) ||
        /buffering timed out/i.test(err.message || "");

    if (databaseUnavailable) {
        return res.status(503).json(
            new ApiResponse(
                503,
                null,
                "Database unavailable. Check the MongoDB connection and Atlas Network Access allowlist."
            )
        );
    }

    return res.status(500).json(
        new ApiResponse(
            500,
            null,
            "Internal server error"
        )
    );
};

export { errorHandler }