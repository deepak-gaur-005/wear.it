import { ApiResponse } from "../utils/ApiResponse.js";

const notFound = (req, res) => {
    res.status(404).json(
        new ApiResponse(404, null, `Route not found${req.found}`)
    )
}

export { notFound }