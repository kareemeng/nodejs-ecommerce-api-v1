import mongoose from "mongoose";

// interface for the model
export interface Category {
  name?: string;
  slug?: string;
  image?: string;
}

//1- create schema with the category interface
const categorySchema = new mongoose.Schema<Category>(
  {
    name: {
      type: String,
      required: [true, "Category required"],
      unique: [true, "Category must be unique"],
      minlength: [3, "Too short category name"],
      maxlength: [32, "Too long category name"],
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
export const CategoryModel = mongoose.model("Category", categorySchema);
