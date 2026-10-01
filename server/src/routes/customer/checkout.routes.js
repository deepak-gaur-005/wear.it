import { Router } from "express";
import crypto from "crypto";

import { Product } from "../../models/product.model.js";
import { User } from "../../models/user.model.js";
import { Cart } from "../../models/cart.model.js";
import { Promo } from "../../models/promo.model.js";
import { Order } from "../../models/order.model.js";

import {getDbUserFromReq, requireAuth} from "../../middlewares/auth.middleware.js";
import { asyncHandler } from "../../utils/AsyncHandler.js";
import {requireFound, requireText } from "../../utils/helper.js";

import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

import {razorpay, toSubUnits} from "../../utils/razorpay.js";


export const customerCheckoutRouter = Router();

customerCheckoutRouter.use(requireAuth);

// Creates a Razorpay order after validating the cart address products stock and optional promo code
customerCheckoutRouter.post(
    "/checkout/create-session",

    asyncHandler(async (req, res) => {
        const dbUser = await getDbUserFromReq(req);

        const addressId = String( req.body.addressId || "").trim();
        const promoCode =String(req.body.promoCode || "")
            .trim()
            .toUpperCase();

        requireText( addressId, "Address is required");

        // fetch user and cart together because both are required to create the checkout session
        const [user, cart] = await Promise.all([
            User.findById(dbUser._id)
                .select("name email addresses")
                .lean(),

            Cart.findOne({ user: dbUser._id,})
                .select("items")
                .lean(),
        ]);

        const foundUser = requireFound(
            user,
            "User not found",
            404
        );

        const foundCart = requireFound(
            cart,
            "Cart not found",
            404
        );

        if (!foundCart.items.length) {
            throw new ApiError(
                400,
                "Cart is empty"
            );
        }

        // Find the address selected by the customer from the addresses stored in their account.
        const selectedAddress = foundUser.addresses.find(
            (item) => String(item._id) === addressId
        );

        if (!selectedAddress) {
            throw new ApiError(
                404,
                "Address not found"
            );
        }

        // Fetch all products from the cart in one query instead of making a separate database query for every item.
        const products = await Product.find({
            _id: {$in: foundCart.items.map((item) => item.product) //$in is a query operator -> find doc where field's value is present in a given list of values
            }
        })
            .select("price salePercentage stock status")
            .lean();

        // Creates a quick product lookup using product ID so each cart item can be matched efficiently.
        const productMap = new Map(
            products.map((item) => [String(item._id),item])
        );

        let totalItems = 0;
        let subTotal = 0;

        // Validates every cart item and calculates the subtotal using the current database price.
        const items = foundCart.items.map( (cartItem) => {
            const product =productMap.get(String(cartItem.product));

            if (!product || product.status !== "active") {
                throw new ApiError(
                    400,
                    "One or more cart items are not available"
                );
            }

            if (product.stock < cartItem.quantity) {
                throw new ApiError(
                    400,
                    "Cart items are out of stock"
                );
            }

            const finalPrice =product.salePercentage
                ? Math.round(
                    product.price - ( product.price * product.salePercentage) / 100
                )
                : product.price;

            totalItems += cartItem.quantity;
            subTotal += finalPrice * cartItem.quantity;

            return {
                product: cartItem.product,
                quantity: cartItem.quantity,
            };
            }
        );

        let appliedPromoCode = "";
        let discountAmount = 0;

        // Validates the promo and calculates the discount using the server-side subtotal.
        if (promoCode) {
            const promo = await Promo.findOne({code: promoCode,})
                .select( "code percentage count minimumOrderValue startsAt endsAt")
                .lean();

            const foundPromo = requireFound(
                    promo,
                    "Promo not found",
                    404
                );

            const now = new Date();

            if (
                now < foundPromo.startsAt ||
                now > foundPromo.endsAt ||
                foundPromo.count < 1
            ) {
                throw new ApiError(
                    400,
                    "Promo code is not active"
                );
            }

            if (subTotal < foundPromo.minimumOrderValue) {
                throw new ApiError(
                    400,
                    `Minimum order value for this promo is ${foundPromo.minimumOrderValue}`
                );
            }

            appliedPromoCode = foundPromo.code;
            discountAmount = Math.round((subTotal * foundPromo.percentage ) / 100 );
        }

        // Final amount customer actually needs to pay.
        const totalAmount =Math.max(subTotal - discountAmount, 0);

        // razorpay expects the amount in paise, so convert rupees to the smallest currency unit
        const razorpayOrder = await razorpay.orders.create({
            amount: toSubUnits(totalAmount),
            currency: "INR",
            receipt:`Order_${Date.now()}`,
        });

        // Converts the selected address into the address string stored with the order
        const deliveryAddress = [
            selectedAddress.address,
            selectedAddress.state,
            selectedAddress.postalCode,
        ]
            .filter(Boolean)
            .join(", ");

        // Create our own database order before payment it starts as pending until Razorpay payment is verified
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
                paymentStatus: "pending",
                orderStatus: "placed",
                razorpayOrderId: razorpayOrder.id,
            });

        res
            .status(201)
            .json(
                new ApiResponse(
                    201,
                    {
                        razorpay: {
                            keyId: process.env .RAZORPAY_KEY_ID,
                            orderId: razorpayOrder.id,
                            amount: razorpayOrder.amount,
                            currency: razorpayOrder.currency,
                        },
                        order: {
                            _id: String(order._id),
                            totalItems,
                            discountAmount,
                            totalAmount,
                        },
                    },
                    "Checkout session created successfully"
                )
            );
    })
);

//  Verifies Razorpay's signature, reduces stock, consumes the promo, clears the cart, and marks the order paid.
customerCheckoutRouter.post(
    "/checkout/confirm",
    asyncHandler(async (req, res) => {

        const dbUser = await getDbUserFromReq(req);
        const orderId = String( req.body.orderId || "").trim();
        const razorpayPaymentId = String(req.body.razorpay_payment_id || "").trim();
        const razorpayOrderId = String( req.body.razorpay_order_id || "" ).trim();
        const razorpaySignature = String( req.body.razorpay_signature || "" ).trim();

        requireText(orderId,"Order id is needed");
        requireText(razorpayPaymentId, "razorpayPaymentId is needed");
        requireText( razorpayOrderId, "razorpayOrderId is needed");
        requireText( razorpaySignature, "razorpaySignature is needed");

        // Find the order and make sure it belongs to the currently authenticated customer.
        const order = await Order.findOne({_id: orderId,user: dbUser._id, });

        const foundOrder =
            requireFound(
                order,
                "Order not found",
                404
            );

        //Makes confirmation idempotent confirming an already-paid order does nothing again.
        if (foundOrder.paymentStatus === "paid") {
            res
                .status(200)
                .json(
                    new ApiResponse(
                        200,
                        {
                            _id:
                                String(
                                    foundOrder._id
                                )
                        },
                        "Order already confirmed"
                    )
                );
            return;
        }

        //Make sure the Razorpay order returned by the frontend belongs to our database order.
        if ( foundOrder.razorpayOrderId !== razorpayOrderId) {
            throw new ApiError(
                400,
                "Order id mismatch"
            );
        }

        //Generate the signature using our secret key and compare it with Razorpay's signature.
        const signature = crypto.createHmac( "sha256", process.env.RAZORPAY_KEY_SECRET || "") //createHnac creates a crypto graphic signature
                .update(`${razorpayOrderId}|${razorpayPaymentId}`)
                .digest("hex"); //Finishes HMAC calculation and returns the result as a hexadecimal string
        if (signature !== razorpaySignature) {
            throw new ApiError(
                400,
                "Invalid payment signature"
            );
        }

        //Reduce stock only after the payment has been cryptographically verified.
        for ( const item of foundOrder.items) {
            const updated = await Product.updateOne(
                    {
                        _id: item.product,
                        stock: {$gte:item.quantity}
                    },
                    {
                        $inc: {
                            stock: -item.quantity
                        },
                    }
                );

            if (!updated.matchedCount) {
                throw new ApiError(
                    400,
                    "One or more cart items are out of stock"
                );
            }
        }

        // Consume one promo usage after successful payment.
        if (foundOrder.promoCode) {

            await Promo.updateOne(
                {
                    code: foundOrder.promoCode,
                    count: { $gt: 0}
                },
                {
                    $inc: { count: -1}
                }
            );
        }

        // Empty the customer's cart after successful payment.
        await Cart.updateOne(
            {
                user: dbUser._id
            },
            {
                $set: { items: []}
            }
        );

        // finally mark our database order as paid.
        foundOrder.paymentStatus = "paid";
        foundOrder.paymentId = razorpayPaymentId;
        foundOrder.paidAt = new Date();

        await foundOrder.save();

        res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    {
                        _id:
                            String(
                                foundOrder._id
                            ),
                    },
                    "Payment confirmed successfully"
                )
            );
    })
);