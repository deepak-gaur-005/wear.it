import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { asyncHandler } from "../../utils/AsyncHandler.js";
import { requireText } from "../../utils/helper.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";   
import { Promo } from "../../models/promo.model.js";


export const customerPromoRouter = Router();

customerPromoRouter.use(requireAuth); // Customer must be logged in

customerPromoRouter.post(
    "/promos/apply",

    asyncHandler(async (req, res) => {

        const code = String(req.body.code || "")
                .trim()
                .toUpperCase();

        const orderValue = Number(req.body.orderValue || 0);

        requireText(code,"Promo code is required");

        if ( Number.isNaN(orderValue) || orderValue < 0) {
            throw new ApiError(
                400,
                "Valid order value is required!"
            );
        }

        const promo = await Promo.findOne({code});

        if (!promo) {
            throw new ApiError(
                404,
                "Promo not found"
            );
        }

        const now = new Date();

        if (now < promo.startsAt) {
            throw new ApiError(
                400,
                "Promo code is not activated"
            );
        }

        if (now > promo.endsAt) {
            throw new ApiError(
                400,
                "Promo code is expired"
            );
        }

        if (promo.count < 1) {
            throw new ApiError(
                400,
                "Promo code limit is already exceeded"
            );
        }

        if (orderValue < promo.minimumOrderValue) {
            throw new ApiError(
                400,
                `Minimum order value for this promo is ${promo.minimumOrderValue}`
            );
        }

        res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    {
                        code: promo.code,
                        percentage: promo.percentage,
                        count: promo.count,
                        minimumOrderValue:
                            promo.minimumOrderValue,
                    },
                    "Promo applied successfully"
                )
            );
    })
);