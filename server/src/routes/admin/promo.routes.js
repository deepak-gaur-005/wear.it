import { Router } from "express";
import { requireAdmin } from "../../middlewares/auth.middleware.js";
import { ApiError } from "../../utils/ApiError.js";
import { requireFound, requireText } from "../../utils/helper.js";
import { asyncHandler } from "../../utils/AsyncHandler.js";
import { Promo } from "../../models/promo.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";


export const adminPromoRouter = Router();

adminPromoRouter.use(requireAdmin)

function parsePromoPayload(req) {

    const code = String(req.body.code || "").trim().toUpperCase();
    const percentage = Number(req.body.percentage);
    const count = Number(req.body.count);
    const minimumOrderValue = Number(req.body.minimumOrderValue);
    const startsAt = new Date(req.body.startsAt);
    const endsAt = new Date(req.body.endsAt);

    requireText(code, "Promo code is required");


    if (
        Number.isNaN(percentage) ||
        percentage < 1 ||
        percentage > 100
    ) {
        throw new ApiError(
            400,
            "Percentage must be between 1 and 100"
        );
    }

    if (!Number.isInteger(count) || count < 1)
    {
        throw new ApiError(
            400,
            "Promo count must be at least 1"
        );
    }

    if (Number.isNaN(minimumOrderValue) || minimumOrderValue < 0) {
        throw new ApiError(
            400,
            "Minimum order value must be 0 or more"
        );
    }

    if (Number.isNaN(startsAt.getTime())) {
        throw new ApiError(
            400,
            "Valid start time is required"
        );
    }

    if (Number.isNaN(endsAt.getTime())) {
        throw new ApiError(
            400,
            "Valid end time is required"
        );
    }

    if (endsAt <= startsAt) {
        throw new ApiError(
            400,
            "End time should be after start time"
        );
    }

    return {
        code,
        percentage,
        count,
        minimumOrderValue,
        startsAt,
        endsAt,
    };
}


function mapPromo(item) {

    return {
        _id: String(item._id || ""),
        code: item.code,
        percentage: item.percentage,
        count: item.count,
        minimumOrderValue: item.minimumOrderValue,
        startsAt: item.startsAt,
        endsAt: item.endsAt,
        createdAt: item.createdAt,
    };
}

async function getAllPromos() {
    const promos = await Promo.find({})
        .sort({ createdAt: -1 });

    return promos.map((item) =>
        mapPromo(item.toObject())
    );
}

adminPromoRouter.get('/promos',

    asyncHandler(async(_req,res) => {
        const items = await getAllPromos();

        res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    { item },
                    "Promos fetched successfully"
                )
            )
    })
)

adminPromoRouter.post('/promos',

    asyncHandler(async(req,res) => {

        const payload = parsePromoPayload(req);

        const existingPromo = await Promo.findOne({code: payload.code});

        if (existingPromo) {
            throw new ApiError(
                400,
                "Promo code already exists"
            );
        }

        await Promo.create(payload);

        const items = await getAllPromos();

        res
            .status(201)
            .json(
                new ApiResponse(
                    201,
                    { items },
                    "Promo created successfully"
                )
            );
    })
)

adminPromoRouter.patch('/promos/:promoId',

    asyncHandler(async (req, res) => {

        const promoId = String(req.params.promoId || "").trim();

        requireText(promoId,"Promo Id is required");

        const payload = parsePromoPayload(req);
        const promo = await Promo.findById(promoId);

        const foundPromo =
            requireFound(
                promo,
                "Promo not found",
                404
            );


        const existingPromo = await Promo.findOne({
            code: payload.code,
            _id: {$ne: foundPromo._id},
        });


        if (existingPromo) {
            throw new ApiError(
                400,
                "Promo code already exists"
            );
        }


        foundPromo.code = payload.code;
        foundPromo.percentage = payload.percentage;
        foundPromo.count = payload.count;
        foundPromo.minimumOrderValue = payload.minimumOrderValue;
        foundPromo.startsAt = payload.startsAt;
        foundPromo.endsAt = payload.endsAt;

        await foundPromo.save();

        const items = await getAllPromos();

        res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    { items },
                    "Promo updated successfully"
                )
            );
    })
)

adminPromoRouter.delete('/promos',

    asyncHandler(async (req, res) => {

        const promoId = String(req.params.promoId || "").trim();
        requireText(promoId,"Promo Id is required");
        const promo =await Promo.findById(promoId);

        requireFound(
            promo,
            "Promo not found",
            404
        );

        await Promo.findByIdAndDelete(promoId);
        const items = await getAllPromos();

        res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    { items },
                    "Promo deleted successfully"
                )
            );
    })
)