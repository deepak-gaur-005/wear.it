import { ApiError } from "./ApiError.js";

export function requireText(value, message, statusCode = 400) {
    if(!String(value || "").trim()) {
        throw new ApiError(statusCode, message);
    }
}

export function requireNumber(value, message, statusCode = 400) {
    if (Number.isNaN(value)) {
        throw new ApiError(statusCode, message);
    }
}

export function requireFound(value, message, statusCode = 400) {
    if (!value) {
        throw new ApiError(statusCode, message);
    }
    return value;
}

