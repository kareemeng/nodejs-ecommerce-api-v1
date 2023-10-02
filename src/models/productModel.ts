import mongoose from "mongoose";

// interface for the model
export interface Product {
  title: string;
  slug?: string;
  description: string;
  quantity: number;
  sold: number;
  price: number;
  price_sale?: number;
  cover: string;
  colors?: string[];
  images?: string[];
  ratingAvg?: number;
  ratingQuantity?: number;
  category: mongoose.Schema.Types.ObjectId;
  brand?: mongoose.Schema.Types.ObjectId;
  subcategories?: mongoose.Schema.Types.ObjectId[];
}

//1- create schema with the Product interface
const productSchema = new mongoose.Schema<Product>(
  {
    title: {
      type: String,
      required: [true, "Product title required"],
      trim: true,
      minlength: [2, "Too short Product title"],
      maxlength: [100, "Too long Product title"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Product description required"],
      trim: true,
      minlength: [20, "Too short Product description"],
    },
    quantity: {
      type: Number,
      required: [true, "Product quantity required"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Product price required"],
      trim: true,
      max: [1_000_000, "Too much Product price"],
    },
    price_sale: {
      type: Number,
      trim: true,
    },
    colors: {
      type: [String],
    },
    images: {
      type: [String],
    },
    cover: {
      type: String,
    },
    ratingAvg: {
      type: Number,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating must can not be more than 5"],
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Product category required"],
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
    },

    subcategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subcategory",
      },
    ],
    /*subcategories: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Subcategory",
    },*/
  },
  { timestamps: true }
);

// mongoose query middleware

//^find means all the query that start with find
productSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "name -_id",
  });
  next();
});

// 2- create Model
export const ProductModel = mongoose.model("Product", productSchema);
