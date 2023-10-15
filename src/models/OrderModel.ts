import mongoose from "mongoose";

import { Address } from "./UserModel";

export interface CartItem {
  _id?: mongoose.Schema.Types.ObjectId;
  product: mongoose.Schema.Types.ObjectId;
  quantity: number;
  color: String;
  price: number;
}

export interface Order {
  user: mongoose.Schema.Types.ObjectId;
  cartItems: CartItem[];
  tax: number;
  shipping: number;
  shippingAddress?: Address;
  totalCost: number;
  paymentMethod: string;
  isPaid: boolean;
  paidAt: Date;
  isDelivered: boolean;
  deliveredAt: Date;
}

const orderSchema = new mongoose.Schema<Order>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "order must belong to a user"],
    },
    cartItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: [true, "Product is required"],
        },
        quantity: {
          type: Number,
        },
        color: {
          type: String,
        },
        price: {
          type: Number,
        },
      },
    ],
    tax: {
      type: Number,
      default: 0.0,
    },
    shipping: {
      type: Number,
      default: 0.0,
    },
    shippingAddress: {
      alias: String,
      details: String,
      phone: String,
      city: String,
      postalCode: String,
    },
    totalCost: {
      type: Number,
      default: 0.0,
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "credit card", "paypal", "stripe"],
      default: "cash",
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

orderSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name profilePicture email phone",
  }).populate({
    path: "cartItems.product",
    select: "title cover",
  });
  next();
});

export const OrderModel = mongoose.model("Order", orderSchema);
