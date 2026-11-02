import mongoose from "mongoose";
import { ApiError } from "./ApiError.js";

export function requireText(value, message, statusCode = 400) {
    if(!String(value || "").trim()) {
        throw new ApiError(statusCode, message);
    }
}

export function requireNumber(value, message, statusCode = 400) {
    if (Number.isNaN(value) || value === null || value === undefined) {
        throw new ApiError(statusCode, message);
    }
}

export function requireFound(value, message, statusCode = 400) {
    if (!value) {
        throw new ApiError(statusCode, message);
    }
    return value;
}

export function requireObjectId(id, message = "Invalid ID format", statusCode = 400) {
    if (!id || !mongoose.Types.ObjectId.isValid(String(id))) {
        throw new ApiError(statusCode, message);
    }
}

