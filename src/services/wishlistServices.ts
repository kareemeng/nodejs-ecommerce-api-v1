import asyncHandler from "express-async-handler"; // for handling async errors
// import { Request, Response, NextFunction } from "express";
import { UserModel } from "../models/UserModel";
// import handler from "./handlers";

import apiError from "../utils/apiError";

/**  Add Product to User Wishlist
 * @route POST /api/v1/wishlist
 * @access protected/user
 */
export const addToWishlist = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findByIdAndUpdate(
    req.user?._id,
    {
      $addToSet: { wishlist: req.body.productId }, // add to set to avoid duplicates
    },
    { new: true }
  );
  if (!user) {
    return next(new apiError("User not found", 404));
  }
  res.status(200).json({
    status: "success",
    message: "Product added to wishlist successfully",
    data: user.wishlist,
  });
});
/**  remove Product From User Wishlist
 * @route DELETE /api/v1/wishlist
 * @access protected/user
 */
export const RemoveFromWishlist = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findByIdAndUpdate(
    req.user?._id,
    {
      $pull: { wishlist: req.body.productId }, // pull to remove from array if exists
    },
    { new: true }
  );
  if (!user) {
    return next(new apiError("User not found", 404));
  }
  res.status(200).json({
    status: "success",
    message: "Product removed From wishlist successfully",
    data: user.wishlist,
  });
});

/**  Get logged User Wishlist
 * @route GET /api/v1/wishlist
 * @access protected/user
 */
export const getWishlist = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findById(req.user?._id).populate("wishlist");
  if (!user) {
    return next(new apiError("User not found", 404));
  }
  res.status(200).json({
    status: "success",
    results: user.wishlist?.length,
    // message: "User wishlist fetched successfully",
    data: user.wishlist,
  });
});
