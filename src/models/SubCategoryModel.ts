import mongoose from "mongoose";

// interface for the model
export interface SubCategory {
  name: string;
  slug?: string;
  mainCategory?: mongoose.Schema.Types.ObjectId;
}

//1- create schema with the subcategory interface
const subcategorySchema = new mongoose.Schema<SubCategory>(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "SubCategory name is required"],
      unique: true,
      minlength: [2, "SubCategory name must be at least 3 characters"], // custom error message
      maxlength: [32, "SubCategory name cannot be longer than 32 characters"], // custom error message
    },
    slug: {
      type: String,
      lowercase: true,
    },
    mainCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "SubCategory must belong to a MainCategory"],
    },
  },
  { timestamps: true }
);

// 2- create Model using the schema

export const SubCategoryModel = mongoose.model(
  "SubCategory",
  subcategorySchema
);
