import { Router } from "express";
import { Product } from "../../models/product.model.js";
import { getDbUserFromReq, requireAuth } from "../../middlewares/auth.middleware.js";
import { asyncHandler } from "../../utils/AsyncHandler.js";
import { User } from "../../models/user.model.js";
import { requireFound, requireText } from "../../utils/helper.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { Cart } from "../../models/cart.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { Promo } from "../../models/promo.model.js";
import { Order } from "../../models/order.model.js";

export const customerCheckoutWithPointsRouter = Router();

customerCheckoutWithPointsRouter.use(requireAuth);

// Gets the current user's available reward points.
customerCheckoutWithPointsRouter.get(
    "/checkout/points",
    asyncHandler(async (req, res) => {
        const dbUser = await getDbUserFromReq(req);

        const user = await User.findById(dbUser._id)
            .select("points")
            .lean();

        const foundUser = requireFound(user, "User not found", 404);

        res.status(200).json(
            new ApiResponse(
                200,
                { points: foundUser.points || 0 },
                "Points fetched successfully"
            )
        );
    })
);

// Creates an order by deducting the required amount from the user's points.
customerCheckoutWithPointsRouter.post(
    "/checkout/pay-with-points",
    asyncHandler(async (req, res) => {
        const dbUser = await getDbUserFromReq(req);
        const addressId = String(req.body.addressId || "").trim();
        const promoCode = String(req.body.promoCode || "").trim().toUpperCase();

        requireText(addressId, "Address is required");

        // Fetch the user's checkout information and cart at the same time.
        const [user, cart] = await Promise.all([
            User.findById(dbUser._id)
                .select("name email addresses")
                .lean(),
            Cart.findOne({ user: dbUser._id })
                .select("items")
                .lean(),
        ]);

        const foundUser = requireFound(user, "User not found", 404);
        const foundCart = requireFound(cart, "Cart not found", 404);

        if (!foundCart.items.length) {
            throw new ApiError(400, "Cart is empty");
        }

        // Find the address selected by the customer.
        const selectedAddress = foundUser.addresses.find(
            (item) => String(item._id) === addressId
        );

        if (!selectedAddress) {
            throw new ApiError(404, "Address not found");
        }

        // Fetch all cart products in one database query.
        const products = await Product.find({
            _id: {
                $in: foundCart.items.map((item) => item.product),
            },
        })
            .select("price salePercentage stock status")
            .lean();

        const productMap = new Map(
            products.map((item) => [String(item._id), item])
        );

        let totalItems = 0;
        let subTotal = 0;

        // Validate cart items and calculate the subtotal.
        const items = foundCart.items.map((cartItem) => {
            const product = productMap.get(String(cartItem.product));

            if (!product || product.status !== "active") {
                throw new ApiError(
                    400,
                    "One or more cart items are not available"
                );
            }

            if (product.stock < cartItem.quantity) {
                throw new ApiError(400, "Cart items are out of stock");
            }

            const finalPrice = product.salePercentage
                ? Math.round(
                    product.price -
                    (product.price * product.salePercentage) / 100
                )
                : product.price;

            totalItems += cartItem.quantity;
            subTotal += finalPrice * cartItem.quantity;

            return {
                product: cartItem.product,
                quantity: cartItem.quantity,
            };
        });

        let appliedPromoCode = "";
        let discountAmount = 0;

        // Validate the promo and calculate its discount.
        if (promoCode) {
            const promo = await Promo.findOne({ code: promoCode })
                .select("code percentage count minimumOrderValue startsAt endsAt")
                .lean();

            const foundPromo = requireFound(promo, "Promo not found", 404);
            const now = new Date();

            if (
                now < foundPromo.startsAt ||
                now > foundPromo.endsAt ||
                foundPromo.count < 1
            ) {
                throw new ApiError(400, "Promo code is not active");
            }

            if (subTotal < foundPromo.minimumOrderValue) {
                throw new ApiError(
                    400,
                    "Minimum order value for this promo is not reached"
                );
            }

            appliedPromoCode = foundPromo.code;
            discountAmount = Math.round(
                (subTotal * foundPromo.percentage) / 100
            );
        }

        const totalAmount = Math.max(subTotal - discountAmount, 0);

        if (totalAmount > (foundUser.points || 0)) {
            throw new ApiError(400, "Not enough points for this order");
        }

        // Deduct points only if the user still has enough points.
        const deductedUserPoints = await User.updateOne(
            {
                _id: dbUser._id,
                points: { $gte: totalAmount },
            },
            {
                $inc: { points: -totalAmount },
            }
        );

        if (!deductedUserPoints.matchedCount) {
            throw new ApiError(400, "Not enough points for this order");
        }

        try {
            // Reduce stock for every purchased product.
            for (const item of items) {
                const updated = await Product.updateOne(
                    {
                        _id: item.product,
                        stock: { $gte: item.quantity },
                    },
                    {
                        $inc: { stock: -item.quantity },
                    }
                );

                if (!updated.matchedCount) {
                    throw new ApiError(
                        400,
                        "One or more cart items are out of stock"
                    );
                }
            }

            // Consume one use of the promo code.
            if (appliedPromoCode) {
                await Promo.updateOne(
                    {
                        code: appliedPromoCode,
                        count: { $gt: 0 },
                    },
                    {
                        $inc: { count: -1 },
                    }
                );
            }

            // Empty the cart after the purchase.
            await Cart.updateOne(
                { user: dbUser._id },
                { $set: { items: [] } }
            );

            const pointsPaymentId = `points_${Date.now()}`;

            const deliveryAddress = [
                selectedAddress.address,
                selectedAddress.state,
                selectedAddress.postalCode,
            ]
                .filter(Boolean)
                .join(", ");

            // Create the order as paid because points were already deducted.
            const order = await Order.create({
                user: dbUser._id,
                customerName: foundUser.name || selectedAddress.fullName,
                customerEmail: foundUser.email || "",
                items,
                totalItems,
                deliveryName: selectedAddress.fullName,
                deliveryAddress,
                promoCode: appliedPromoCode,
                discountAmount,
                totalAmount,
                paymentStatus: "paid",
                orderStatus: "placed",
                razorpayOrderId: pointsPaymentId,
                paymentId: pointsPaymentId,
                paidAt: new Date(),
            });

            const updatedUser = await User.findById(dbUser._id)
                .select("points")
                .lean();

            res.status(201).json(
                new ApiResponse(
                    201,
                    {
                        _id: String(order._id),
                        totalPoints: updatedUser?.points || 0,
                    },
                    "Order placed successfully using points"
                )
            );
        } catch (error) {
            // Refund points if something fails after the deduction.
            await User.updateOne(
                { _id: dbUser._id },
                { $inc: { points: totalAmount } }
            );

            throw error;
        }
    })
);