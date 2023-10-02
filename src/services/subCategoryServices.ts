import { SubCategoryModel } from "../models/SubCategoryModel";
import asyncHandler from "express-async-handler";
import handler from "./handlers";
/**  Get List of All SubCategories or SubCategories of a specific MainCategory
 * @route GET /api/v1/subcategories
 * @nestedRoute GET /api/v1/categories/:mainCategory/subcategories
 * @access public
 */
export const getSubCategories = asyncHandler(
  handler.getAll(SubCategoryModel, "SubCategories")
);
/** Get specific SubCategory
 * @route GET /api/v1/subcategories/:id
 * @access public
 */
export const getSubCategory = asyncHandler(handler.getOne(SubCategoryModel)); //populate mainCategory not needed here
/** Create New SubCategory
 * @route POST /api/v1/subcategories
 * @nestedRoute post /api/v1/categories/:mainCategory/subcategories
 * @access private
 */
export const createSubCategory = asyncHandler(
  handler.createOne(SubCategoryModel)
);
/** Update Specific SubCategory
 * @route PUT /api/v1/subcategories/:id
 * @access private
 */
export const updateSubCategory = asyncHandler(
  handler.updateOne(SubCategoryModel)
);
/** Delete Specific SubCategory
 * @route DELETE /api/v1/subcategories/:id
 * @access privet
 */
export const deleteSubCategory = asyncHandler(
  handler.deleteOne(SubCategoryModel)
);

export default {
  getSubCategories,
  getSubCategory,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
};
