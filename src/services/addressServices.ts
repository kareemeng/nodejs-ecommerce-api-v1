import asyncHandler from "express-async-handler"; // for handling async errors
// import { Request, Response, NextFunction } from "express";
import { UserModel } from "../models/UserModel";
// import handler from "./handlers";
import apiError from "../utils/apiError";

/**  Add Address to User addresses
 * @route POST /api/v1/addresses
 * @access protected/user
 */
export const addToAddresses = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findByIdAndUpdate(
    req.user?._id,
    {
      $addToSet: { addresses: req.body }, // add to set to avoid duplicates
    },
    { new: true }
  );
  if (!user) {
    return next(new apiError("User not found", 404));
  }
  res.status(200).json({
    status: "success",
    message: "Address added to User Addresses successfully",
    data: user.addresses,
  });
});
/**  remove address From User Addresses
 * @route DELETE /api/v1/addresses/:addressId
 * @access protected/user
 */
export const RemoveFromAddresses = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findByIdAndUpdate(
    req.user?._id,
    {
      $pull: { addresses: { _id: req.params.addressId } }, // pull to remove from array if exists
    },
    { new: true }
  );
  if (!user) {
    return next(new apiError("User not found", 404));
  }
  res.status(200).json({
    status: "success",
    message: "Address removed From User Addresses successfully",
    data: user.addresses,
  });
});

/**  Get logged User addresses
 * @route GET /api/v1/wishlist
 * @access protected/user
 */
export const getAddresses = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findById(req.user?._id).populate("addresses");
  if (!user) {
    return next(new apiError("User not found", 404));
  }
  res.status(200).json({
    status: "success",
    results: user.addresses?.length,
    data: user.addresses,
  });
});
