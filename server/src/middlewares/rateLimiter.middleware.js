import { ApiError } from "../utils/ApiError.js";

/**
 * Creates an in-memory sliding window rate limiter middleware.
 * Zero external dependencies required.
 *
 * @param {object} options
 * @param {number} options.windowMs Window duration in milliseconds (default: 60s)
 * @param {number} options.max Maximum requests per window (default: 30)
 * @param {string} options.message Error message returned on 429
 */
export function createRateLimiter({
    windowMs = 60 * 1000,
    max = 30,
    message = "Too many requests. Please slow down and try again shortly.",
} = {}) {
    const hits = new Map();

    // Routine cleanup every windowMs to prevent memory growth
    const timer = setInterval(() => {
        const now = Date.now();
        for (const [key, record] of hits.entries()) {
            if (now > record.resetTime) {
                hits.delete(key);
            }
        }
    }, windowMs);

    if (timer.unref) {
        timer.unref();
    }

    return (req, res, next) => {
        const ip =
            req.ip ||
            req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
            req.socket?.remoteAddress ||
            "client";

        const routeKey = `${ip}:${req.baseUrl || ""}${req.path || ""}`;
        const now = Date.now();

        let record = hits.get(routeKey);

        if (!record || now > record.resetTime) {
            record = { count: 1, resetTime: now + windowMs };
            hits.set(routeKey, record);
        } else {
            record.count += 1;
        }

        const remaining = Math.max(0, max - record.count);
        const resetSeconds = Math.ceil((record.resetTime - now) / 1000);

        res.setHeader("X-RateLimit-Limit", max);
        res.setHeader("X-RateLimit-Remaining", remaining);
        res.setHeader("X-RateLimit-Reset", resetSeconds);

        if (record.count > max) {
            res.setHeader("Retry-After", resetSeconds);
            throw new ApiError(429, message);
        }

        next();
    };
}
