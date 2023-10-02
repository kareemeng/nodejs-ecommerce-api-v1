import mongoose from "mongoose";

export interface Coupon {
  name: String;
  expire: Date;
  discount: number;
}

const couponSchema = new mongoose.Schema<Coupon>(
  {
    name: {
      type: String,
      required: [true, "coupon name required"],
      trim: true,
      unique: true,
    },
    expire: {
      type: Date,
      required: [true, "coupon expire data required"],
    },
    discount: {
      type: Number,
      required: [true, "coupon discount amount required"],
    },
  },

  { timestamps: true }
);

export const CouponModel = mongoose.model("Coupon", couponSchema);
