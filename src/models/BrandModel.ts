import mongoose from "mongoose";

// interface for the model
export interface Brand {
  name: string;
  slug?: string;
  image?: string;
}

//1- create schema with the Brand interface
const brandSchema = new mongoose.Schema<Brand>(
  {
    name: {
      type: String,
      required: [true, "Brand required"],
      unique: true,
      minlength: [2, "Too short Brand name"],
      maxlength: [32, "Too long Brand name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: { type: String },
  },
  { timestamps: true }
);

// 2- create Model
// while naming model its convention to start with capital letters
export const BrandModel = mongoose.model("Brand", brandSchema);
