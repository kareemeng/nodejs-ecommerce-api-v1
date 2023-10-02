import mongoose from "mongoose";
import path from "path";
import { ProductModel } from "./productModel";

export interface Review {
  title: string;
  rating: number;
  description: string;
  user: mongoose.Schema.Types.ObjectId;
  product: mongoose.Schema.Types.ObjectId;
}

const ReviewSchema = new mongoose.Schema<Review>(
  {
    title: { type: String },
    rating: {
      type: Number,
      min: [1, "Min Rating value is 1"],
      max: [5, "Max Rating value is 5"],
      required: [true, "Rating is required"],
    },
    description: { type: String },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product is required"],
    },
  },
  { timestamps: true }
);

ReviewSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name profilePicture" });
  next();
});

//static method to calculate average rating and number of reviews
ReviewSchema.statics.calcAverageRatingsAndQuantity = async function (
  productId: string
) {
  const results = await this.aggregate([
    //stage1: match reviews for the product
    {
      $match: { product: productId },
    },
    //stage2: calculate average rating and number of reviews
    {
      $group: {
        _id: "$product",
        avgRating: { $avg: "$rating" }, // get average rating of the product
        ratingQuantity: { $sum: 1 }, // get number of reviews (sum :1 counts the number of reviews)
      },
    },
  ]);
  //update product average rating and number of reviews
  if (results.length > 0) {
    await ProductModel.findByIdAndUpdate(productId, {
      averageRating: results[0].avgRating,
      ratingQuantity: results[0].ratingQuantity,
    });
  } else {
    await ProductModel.findByIdAndUpdate(productId, {
      averageRating: 0,
      ratingQuantity: 0,
    });
  }
  // console.log(results);
};

//update product average rating and number of reviews after saving, updating or deleting a review
ReviewSchema.post("save", async function () {
  //!the type of calcAverageRatingsAndQuantity is not defined in the mongoose type definition file so we have to ignore the error
  // @ts-ignore
  await this.constructor.calcAverageRatingsAndQuantity(this.product);
});
ReviewSchema.post("findOneAndDelete", async function (doc) {
  // console.log("%s has been removed", doc._id);
  //!the type of calcAverageRatingsAndQuantity is not defined in the mongoose type definition file so we have to ignore the error
  // @ts-ignore
  await ReviewModel.calcAverageRatingsAndQuantity(doc.product);
});

export const ReviewModel = mongoose.model("Review", ReviewSchema);
