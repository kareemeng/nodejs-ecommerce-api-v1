import { BrandModel } from "../models/BrandModel";
import handler from "./handlers";
import { uploadSingleImage } from "../middleware/uploadImageMiddleware";

export const uploadBrandImage = uploadSingleImage("image");

export const resizeBrandImage = handler.resizeImage(500, 500, "jpeg", "brands");
/**  Get List of All Brands
 * @route GET /api/v1/brands
 * @access public
 */
export const getBrands = handler.getAll(BrandModel, "brands");
/** Get specific Brand
 * @route GET /api/v1/brands/:id
 * @access public
 */
export const getBrand = handler.getOne(BrandModel);
/** Create New Brand
 * @route POST /api/v1/brands
 * @access private
 */
export const createBrand = handler.createOne(BrandModel);
/** Update Specific brands
 * @route PUT /api/v1/brands/:id
 * @access private
 */
export const updateBrand = handler.updateOne(BrandModel);
/** Delete Specific Brand
 * @route DELETE /api/v1/brands/:id
 * @access privet
 */
export const deleteBrand = handler.deleteOne(BrandModel);

export default {
  getBrands,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand,
};
