import mongoose from "mongoose";

export interface CartItem {
  _id?: mongoose.Schema.Types.ObjectId;
  product: mongoose.Schema.Types.ObjectId;
  quantity: number;
  color: String;
  price: number;
}

export interface Cart {
  cartItems: CartItem[];
  totalCost: number;
  totalCostAfterDiscount: number;
  user: mongoose.Schema.Types.ObjectId;
}

const cartSchema = new mongoose.Schema<Cart>(
  {
    cartItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: [true, "Product is required"],
        },
        quantity: {
          type: Number,
          default: 1,
        },
        color: {
          type: String,
          required: [true, "Product color is required"],
        },
        price: {
          type: Number,
          required: [true, "Product price is required"],
        },
      },
    ],
    totalCost: {
      type: Number,
      default: 0,
    },
    totalCostAfterDiscount: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const CartModel = mongoose.model("Cart", cartSchema);
