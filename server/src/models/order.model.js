import mongoose, { Schema } from "mongoose";

const OrderItemsSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,

      required: true,
      min: 1,
    },
    // Snapshot fields captured at checkout so order history stays
    // accurate even if the product is later edited or deleted.
    // All fields are optional/defaulted so existing orders without them remain valid.
    title:     { type: String, default: "", trim: true },
    image:     { type: String, default: "", trim: true },
    unitPrice: { type: Number, default: 0 },
    color:     { type: String, default: "", trim: true },
    size:      { type: String, default: "", trim: true },
  },
  { _id: false },
);

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    customerName: {
      type: String,
      default: "",
      trim: true,
    },
    customerEmail: {
      type: String,
      default: "",
      trim: true,
    },
    items: {
      type: [OrderItemsSchema],
      default: [],
    },
    totalItems: {
      type: Number,
      required: true,
      min: 1,
    },
    deliveryName: {
      type: String,
      required: true,
      trim: true,
    },
    deliveryAddress: {
      type: String,
      required: true,
      trim: true,
    },
    promoCode: {
      type: String,
      default: "",
      uppercase: true,
      trim: true,
    },
    discountAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMethod: {
      type: String,
      enum: ["razorpay", "points"],
      default: "razorpay",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: ["placed", "shipped", "delivered", "returned", "cancelled"],
      default: "placed",
    },
    razorpayOrderId: {
      type: String,
      required: true,
      trim: true,
    },
    paymentId: {
      type: String,
      default: "",
      trim: true,
    },
    paidAt: {
      type: Date,
      default: null,
    },
    deliveredAt: {
      type: Date,
      default: null,
    },
    returnedAt: {
      type: Date,
      default: null,
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

OrderSchema.index({ user: 1, createdAt: -1 });
OrderSchema.index({
  user: 1,
  "items.product": 1,
  paymentStatus: 1,
  orderStatus: 1,
  deliveredAt: 1,
});
OrderSchema.index({ orderStatus: 1, createdAt: -1 });
OrderSchema.index({ paymentStatus: 1, createdAt: -1 });

export const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);