import Router from 'express';
import { getDbUserFromReq, requireAuth } from '../../middlewares/auth.middleware.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { ApiError } from "../../utils/ApiError.js";
import { Cart } from '../../models/cart.model.js';
import { Product } from '../../models/product.model.js';
import { requireFound, requireText } from '../../utils/helper.js';
import { Wishlist } from "../../models/wishlist.model.js";
import { asyncHandler } from '../../utils/AsyncHandler.js';

export const customerCartWishlistRouter = Router();

customerCartWishlistRouter.use(requireAuth)

//helper functions

// Converts product data into the small product format needed by cart/wishlist UI
function formatProduct(product) {   
    const image =
        product.images.find((item) => item.isCover)?.url ||
        product.images[0]?.url ||""; //url and fast image url

    const finalPrice = product.salePercentage
        ? Math.round( product.price - (product.price * product.salePercentage) / 100)
        : product.price;

    return {
        productId: String(product._id),
        title: product.title,
        brand: product.brand,
        image,
        finalPrice,
    };
}

async function getCartResponse(userId) {
    const cart = await Cart.findOne({user: userId})
    .populate(
        "items.product",
        "title brand price salePercentage images"
    );
    const cartItems = cart?.items || [];

    const items = cartItems.flatMap((cartItem) => {
        if (!cartItem.product) {
            return [];
        }
        return [
            {
                ...formatProduct(cartItem.product),
                quantity: cartItem.quantity,
                color: cartItem.color,
                size: cartItem.size,
            },
        ];
    });

    const totalQuantity = items.reduce(
        (sum, item) => sum + item.quantity,
        0
    );
    return {
        items,
        totalQuantity,
    };
}

async function getWishlistResponse(userId) {
    const wishlist = await Wishlist.findOne({ user: userId })
    .populate(
        "products",
        "title brand price salePercentage images"
    );

    const products = wishlist?.products || [];

    const items = products.flatMap((product) => {
        if (!product) {
            return [];
        }
        return [formatProduct(product)];
    });

    return {items};
}

function getSelectedVariant(
    product,
    colorValue,
    sizeValue
) {
    let color;
    let size;

    // If product has colors,
    // customer must select one.
    if (product.colors.length > 0) {
        if (!colorValue) {
            throw new ApiError(
                400,
                "Color is required"
            );
        }
        if (!product.colors.includes(colorValue)) {// this color is not actually present
            throw new ApiError(
                400,
                "Selected color is invalid"
            );
        }
        color = colorValue;
    }

    // If product has sizes,
    // customer must select one.
    if (product.sizes.length > 0) {
        if (!sizeValue) {
            throw new ApiError(
                400,
                "Size is required"
            );
        }
        if (!product.sizes.includes(sizeValue)) {
            throw new ApiError(
                400,
                "Selected size is invalid"
            );
        }
        size = sizeValue;
    }
    return {
        color,
        size,
    };
}

function isSameCartItem(
    item,
    productId,
    color,
    size
) {
    return (
        String(item.product) === productId &&
        (item.color || "") === (color || "") &&
        (item.size || "") === (size || "")
    );
}
customerCartWishlistRouter.get(
    '/cart',

    asyncHandler(async (req, res) => {

        const dbUser = await getDbUserFromReq(req);

        const data = await getCartResponse(String(dbUser._id)
    )
        res .status(200)
            .json(
                new ApiResponse(
                    200,
                    data,
                    "Cart fetched successfully"
                )
            );

    })
)

customerCartWishlistRouter.post(
    '/cart/items',

    asyncHandler(async (req, res) => {
        const dbUser = await getDbUserFromReq(req);

        const productId = String(req.body.productId || "").trim();
        const quantity = String(req.body.quantity || 1)
        const colorValue = String(req.body.color || "").trim();
        const sizeValue = String(req.body.size || "").trim();

        requireText(productId, "Product id is required");

        if ( Number.isNaN(quantity) || quantity < 1) {
            throw new ApiError(
                400,
                "Quantity must be at least 1"
            );
        }

        const product = await Product.findOne({
            _id: productId, 
            status: "active", });

        const foundProduct = requireFound(
            product,
            "Product not found",
            404
        );

        const { color, size } = getSelectedVariant(foundProduct, colorValue, sizeValue);

        if (quantity > foundProduct.stock) {
            throw new ApiError(
                400,
                "Quantity is more than the stock of this product"
            );
        }

        let cart = await Cart.findOne({user: dbUser._id,});

        if (!cart) {
            cart = await Cart.create({
                user: dbUser._id,
                items: [],
            });
        }

        const itemIndex = cart.items.findIndex((item) =>
                isSameCartItem(item,String(foundProduct._id),color,size)
            );

        // IMPORTANT:
        // findIndex() can return 0.
        // Therefore check >= 0, not > 0.
        if (itemIndex >= 0) {

            const nextQuantity = cart.items[itemIndex].quantity + quantity;

            if (nextQuantity > foundProduct.stock) {
                throw new ApiError(
                    400,
                    "Quantity is more than the stock of this product"
                );
            }
            cart.items[itemIndex].quantity = nextQuantity;

        } else {
            cart.items.push({
                product: foundProduct._id,
                quantity,
                color,
                size,
            });
        }

        await cart.save();
        const data = await getCartResponse(String(dbUser._id));

        res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    data,
                    "Product added to cart"
                )
            );
    })
);

customerCartWishlistRouter.patch(
    "/cart/items/:productId/increase",
    asyncHandler(async (req, res) => {

        const dbUser = await getDbUserFromReq(req);
        const productId = String(req.params.productId || "").trim();
        const colorValue = String(req.query.color || "").trim();
        const sizeValue = String(req.query.size || "").trim();

        requireText(
            productId,
            "Product id is required"
        );

        const cart = await Cart.findOne({ user: dbUser._id,});

        const foundCart = requireFound(
            cart,
            "Cart not found",
            404
        );

        const product = await Product.findOne({
            _id: productId,
            status: "active",
        });

        const foundProduct = requireFound(
            product,
            "Product not found",
            404
        );

        const { color, size } = getSelectedVariant(foundProduct, colorValue,sizeValue);

        const itemIndex =
            foundCart.items.findIndex((item) =>
                isSameCartItem(
                    item,
                    String(foundProduct._id),
                    color,
                    size
                )
            );

        if (itemIndex < 0) {
            throw new ApiError(
                400,
                "Cart item not found here"
            );
        }

        if (foundCart.items[itemIndex].quantity + 1 > foundProduct.stock) 
        {
            throw new ApiError(
                400,
                "Quantity is more than the stock of this product"
            );
        }

        foundCart.items[itemIndex].quantity += 1;
        await foundCart.save();

        const data = await getCartResponse(String(dbUser._id));

        res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    data,
                    "Cart quantity increased"
                )
            );
    })
);

customerCartWishlistRouter.delete(
    "/cart/items/:productId",
    asyncHandler(async (req, res) => {

        const dbUser = await getDbUserFromReq(req);
        const productId = String(req.params.productId || "").trim();
        const colorValue = String(req.query.color || "").trim();
        const sizeValue = String(req.query.size || "").trim();

        requireText(
            productId,
            "Product id is required"
        );

        const cart = await Cart.findOne({ user: dbUser._id,});

        if (!cart) {
            res
                .status(200)
                .json(
                    new ApiResponse(
                        200,
                        {
                            items: [],
                            totalQuantity: 0,
                        },
                        "Cart is empty"
                    )
                );
            return;
        }

        const product = await Product.findOne({
            _id: productId,
            status: "active",
        });

        const foundProduct = requireFound(
            product,
            "Product not found",
            404
        );

        const { color, size } = getSelectedVariant( foundProduct, colorValue, sizeValue );

        cart.items = cart.items.filter( (item) =>
                !isSameCartItem(
                    item,
                    productId,
                    color,
                    size
                )
        );

        await cart.save();

        const data = await getCartResponse( String(dbUser._id));

        res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    data,
                    "Product removed from cart"
                )
            );
    })
);

customerCartWishlistRouter.post(
    "/cart/sync",
    asyncHandler(async (req, res) => {

        const dbUser = await getDbUserFromReq(req);

        const incomingItems = Array.isArray(req.body.items)
                ? req.body.items
                : [];

        let cart = await Cart.findOne({user: dbUser._id });

        if (!cart) { cart = await Cart.create({
                user: dbUser._id,
                items: [],
            });
        }

        for (const rawItem of incomingItems) {

            const productId = String(rawItem.productId || "").trim();
            const quantity = Number(rawItem.quantity || 0 );
            const colorValue =String( rawItem.color || "").trim();
            const sizeValue = String( rawItem.size || "").trim();

            if (!productId || Number.isNaN(quantity) || quantity < 1) {
                continue;
            }

            const product = await Product.findOne({
                    _id: productId,
                    status: "active",
                });

            if ( !product || product.stock < 1 ) {
                continue;
            }

            try {
                const { color, size } = getSelectedVariant(product, colorValue, sizeValue );

                const itemIndex = cart.items.findIndex((item) =>
                        isSameCartItem(
                            item,
                            String(product._id),
                            color,
                            size
                        )
                    );

                if (itemIndex >= 0) {
                    const nextQuantity = cart.items[itemIndex].quantity + quantity;

                    cart.items[itemIndex].quantity =
                        Math.min(
                            nextQuantity,
                            product.stock
                        );
                } else {
                    cart.items.push({
                        product: product._id,
                        quantity: Math.min(quantity, product.stock),
                        color,
                        size,
                    });
                }

            } catch {
                continue;
            }
        }

        // save AFTER processing all incoming items
        await cart.save();

        const data = await getCartResponse(
            String(dbUser._id)
        );

        res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    data,
                    "Cart synchronized successfully"
                )
            );
    })
);

// GET /wishlist
customerCartWishlistRouter.get(
    "/wishlist",
    asyncHandler(async (req, res) => {

        const dbUser = await getDbUserFromReq(req);
        const data = await getWishlistResponse( String(dbUser._id));

        res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    data,
                    "Wishlist fetched successfully"
                )
            );
    })
);

// POST /wishlist/items
customerCartWishlistRouter.post(
    "/wishlist/items",
    asyncHandler(async (req, res) => {
        const dbUser = await getDbUserFromReq(req);
        const productId = String(req.body.productId || "").trim();

        requireText(
            productId,
            "Product id is required"
        );

        const product = await Product.findOne({
            _id: productId,
            status: "active",
        });

        const foundProduct = requireFound(
            product,
            "Product not found",
            404
        );

        let wishlist = await Wishlist.findOne({ user: dbUser._id,});

        if (!wishlist) {
            wishlist = await Wishlist.create({
                user: dbUser._id,
                products: [],
            });
        }

        const exists = wishlist.products.some( (item) =>
            String(item) === String(foundProduct._id)
        );

        if (!exists) {
            wishlist.products.push( foundProduct._id);
            await wishlist.save();
        }

        const data = await getWishlistResponse( String(dbUser._id));

        res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    data,
                    "Product added to wishlist"
                )
            );
    })
);

// DELETE /wishlist/items/:productId
customerCartWishlistRouter.delete(
    "/wishlist/items/:productId",
    asyncHandler(async (req, res) => {
        const dbUser = await getDbUserFromReq(req);

        const productId = String( req.params.productId || "" ).trim();

        requireText(
            productId,
            "Product id is required"
        );

        const wishlist = await Wishlist.findOne({ user: dbUser._id});

        if (!wishlist) {
            res
                .status(200)
                .json(
                    new ApiResponse(
                        200,
                        { items: [] },
                        "Wishlist is empty"
                    )
                );
            return;
        }

        wishlist.products = wishlist.products.filter((item) =>
                    String(item) !== productId
            );

        await wishlist.save();

        const data = await getWishlistResponse( String(dbUser._id));

        res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    data,
                    "Product removed from wishlist"
                )
            );
    })
);