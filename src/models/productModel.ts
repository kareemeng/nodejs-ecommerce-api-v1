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
  averageRating?: number;
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
    averageRating: {
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
  {
    timestamps: true,
    //! IMPORTANT toJSON and toObject are used to show virtuals in the response the virtuals are not stored in the database
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// mongoose query middleware
const setImageUrl = function (doc: Product) {
  if (doc.cover) {
    const imageURL = `${process.env.API_URL}/products/${doc.cover}`;
    doc.cover = imageURL; // replace image name with full url
  }
  if (doc.images) {
    const imagesURL = doc.images.map((image) => {
      const imageURL = `${process.env.API_URL}/products/${image}`;
      return imageURL;
    });
    doc.images = imagesURL; // replace image name with full url
  }
};
/*
 * virtual populate reviews for product model (one to many) (product -> reviews) (one product has many reviews)
 * to do virtual populate we need to add a virtual field to the schema
 * virtual field is a field that is not stored in the database but we can use it to populate other fields
 * the needed fields are: ref, foreignField, localField
 * (the model name) (the field in the other model) (the field in the current model)
 */
productSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "product",
  localField: "_id",
});

//^find means all the query that start with find
//as find, findOne, findById, findByIdAndUpdate, findByIdAndDelete
productSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "name -_id",
  });
  next();
});

productSchema.post<Product>("init", (doc) => {
  setImageUrl(doc);
});
productSchema.post<Product>("save", (doc) => {
  setImageUrl(doc);
});

// 2- create Model
export const ProductModel = mongoose.model("Product", productSchema);
