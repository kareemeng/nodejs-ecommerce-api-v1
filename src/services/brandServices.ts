import { BrandModel } from "../models/BrandModel";
import asyncHandler from "express-async-handler";
import handler from "./handlers";

/**  Get List of All Brands
 * @route GET /api/v1/brands
 * @access public
 */
export const getBrands = asyncHandler(handler.getAll(BrandModel, "brands"));
/** Get specific Brand
 * @route GET /api/v1/brands/:id
 * @access public
 */
export const getBrand = asyncHandler(handler.getOne(BrandModel));
/** Create New Brand
 * @route POST /api/v1/brands
 * @access private
 */
export const createBrand = asyncHandler(handler.createOne(BrandModel));
/** Update Specific brands
 * @route PUT /api/v1/brands/:id
 * @access private
 */
export const updateBrand = asyncHandler(handler.updateOne(BrandModel));
/** Delete Specific Brand
 * @route DELETE /api/v1/brands/:id
 * @access privet
 */
export const deleteBrand = asyncHandler(handler.deleteOne(BrandModel));

export default {
  getBrands,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand,
};
