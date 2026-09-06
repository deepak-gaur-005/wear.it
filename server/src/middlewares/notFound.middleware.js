import { ApiResponse } from "../utils/ApiResponse.js";

const notFound = (req, res, next) => {
    res.status(404).json(
        new ApiResponse(404, null, `Route not found: ${req.originalUrl}`)
    )
}

export { notFound }