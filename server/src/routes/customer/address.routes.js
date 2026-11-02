import { Router } from "express";
import { getDbUserFromReq, requireAuth } from "../../middlewares/auth.middleware.js";
import { User } from "../../models/user.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/AsyncHandler.js";
import { requireFound, requireText } from "../../utils/helper.js";
import { ApiError } from "../../utils/ApiError.js";


function validateAddressPayload({ fullName, address, state, postalCode }) {
    requireText(fullName, "Full name is required");
    requireText(address, "Address is required");
    requireText(state, "State is required");
    requireText(postalCode, "Postal code is required");

    if (fullName.length < 2 || fullName.length > 100) {
        throw new ApiError(400, "Full name must be between 2 and 100 characters");
    }
    if (address.length < 5 || address.length > 300) {
        throw new ApiError(400, "Address must be between 5 and 300 characters");
    }
    if (state.length < 2 || state.length > 50) {
        throw new ApiError(400, "State must be between 2 and 50 characters");
    }
    const cleanPostal = postalCode.replace(/\s+/g, "");
    if (!/^[a-zA-Z0-9-]{3,10}$/.test(cleanPostal)) {
        throw new ApiError(400, "Postal code must be a valid format (3-10 characters)");
    }
}

function mapAddress(item) {  //convert address document into clean api response
    return {
        _id: String(item._id || ""),
        fullName: item.fullName,
        address: item.address,
        state: item.state,
        postalCode: item.postalCode,
        isDefault: item.isDefault,
    };
}

export const customerAddressRouter = Router();

customerAddressRouter.use("/addresses", requireAuth);

customerAddressRouter.get(
    "/addresses",

    asyncHandler(async (req,res) => {

        const dbUser = await getDbUserFromReq(req);

        const user = await User.findById(dbUser._id);

        const foundUser =
            requireFound(
                user,
                "User not found",
                404
            );

        const addresses = foundUser.addresses || [];

        const items = [...addresses]
                .sort((a, b) => Number(b.isDefault) - Number(a.isDefault)
                )
                .map(mapAddress);

        res.status(200)
            .json(
                new ApiResponse(
                    200,
                    { items },
                    "Addresses fetched successfully"
                )
            );
    })
)

customerAddressRouter.post(
    "/addresses",

    asyncHandler(async (req, res) => {
        const dbUser = await getDbUserFromReq(req);

        const fullName = String(req.body.fullName || "").trim();
        const address = String(req.body.address || "").trim();
        const state = String(req.body.state || "").trim();
        const postalCode = String(req.body.postalCode || "").trim();

        validateAddressPayload({ fullName, address, state, postalCode });

        const user =    await User.findById(dbUser._id);

        const foundUser =
            requireFound(
                user,
                "User not found",
                404
            );
        
        const addresses = foundUser.addresses || [];

        const shouldMarkAsDefault =
            req.body.isDefault === true ||
            addresses.length === 0;


        if (shouldMarkAsDefault) {
            addresses.forEach((item) => {
                item.isDefault = false;
            });
        }

        addresses.push({
            fullName,
            address,
            state,
            postalCode,
            isDefault: shouldMarkAsDefault,
        });

        await foundUser.save();


        const items =
            [...addresses]
                .sort(
                    (a, b) =>
                        Number(b.isDefault) -
                        Number(a.isDefault)
                )
                .map(mapAddress);


        res
            .status(201)
            .json(
                new ApiResponse(
                    201,
                    { items },
                    "Address added successfully"
                )
            );
    })
)

customerAddressRouter.patch(
    "/addresses/:addressId",

    asyncHandler(async (req, res) => {
        const dbUser = await getDbUserFromReq(req);
        const addressId = String(req.params.addressId || "").trim();


        requireText(addressId, "Address id is required");

        const fullName = String(req.body.fullName || "").trim();
        const address = String(req.body.address || "").trim();
        const state = String(req.body.state || "").trim();
        const postalCode = String(req.body.postalCode || "").trim();

        validateAddressPayload({ fullName, address, state, postalCode });

        const user =    await User.findById(dbUser._id);

        const foundUser =
            requireFound(
                user,
                "User not found",
                404
            );
        
        const addresses = foundUser.addresses || [];

        const addressToEdit = addresses.find(
            (currentAddress) => String(currentAddress._id) === addressId
        );

        if (!addressToEdit) {
            throw new ApiError(
                404,
                "Address not found"
            );
        }

        const shouldMarkAsDefault =
            req.body.isDefault === true ||
            addresses.length === 0;

        if (shouldMarkAsDefault) {
            addresses.forEach((item) => {
                item.isDefault = false;
            });
        }

        addressToEdit.fullName = fullName;
        addressToEdit.address = address;
        addressToEdit.state = state;
        addressToEdit.postalCode = postalCode;

        if (shouldMarkAsDefault) {
            addressToEdit.isDefault = true;
        }

        await foundUser.save();

        const items = [...foundUser.addresses ]
        .sort((a, b) => Number(b.isDefault) - Number(a.isDefault))
        .map(mapAddress);

        res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    { items },
                    "Address updated successfully"
                )
            );
    }),
);


customerAddressRouter.delete(
    "/addresses/:addressId",

    asyncHandler(async (req, res) => {

        const dbUser = await getDbUserFromReq(req);

        const addressId = String( req.params.addressId || "").trim();

        requireText(addressId, "Address id is required");

        const user = await User.findById(dbUser._id);

        const foundUser =
            requireFound(
                user,
                "User not found",
                404
            );

        const addresses = foundUser.addresses || [];


        const addressToBeDeletedIndex =
            addresses.findIndex(
                (currentAddress) => String(currentAddress._id) === addressId);


        if (addressToBeDeletedIndex < 0) {
            throw new ApiError(
                404,
                "Address not found"
            );
        }


        const wasDefault =
            addresses[addressToBeDeletedIndex].isDefault;


        addresses.splice(addressToBeDeletedIndex,1);


        if (
            wasDefault &&
            addresses.length > 0 &&
            !addresses.some(
                (address) => address.isDefault
            )
        ) {
            addresses[0].isDefault = true;
        }

        await foundUser.save();

        const items = [...foundUser.addresses]
                .sort((a, b) => Number(b.isDefault)- Number(a.isDefault))
                .map(mapAddress);


        res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    { items },
                    "Address deleted successfully"
                )
            );
    })
);