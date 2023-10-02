import { SubCategoryModel } from "../models/SubCategoryModel";
import handler from "./handlers";
/**  Get List of All SubCategories or SubCategories of a specific MainCategory
 * @route GET /api/v1/subcategories
 * @nestedRoute GET /api/v1/categories/:mainCategory/subcategories
 * @access public
 */
export const getSubCategories = handler.getAll(
  SubCategoryModel,
  "SubCategories"
);

/** Get specific SubCategory
 * @route GET /api/v1/subcategories/:id
 * @access public
 */
export const getSubCategory = handler.getOne(SubCategoryModel); //populate mainCategory not needed here
/** Create New SubCategory
 * @route POST /api/v1/subcategories
 * @nestedRoute post /api/v1/categories/:mainCategory/subcategories
 * @access private
 */
export const createSubCategory = handler.createOne(SubCategoryModel);

/** Update Specific SubCategory
 * @route PUT /api/v1/subcategories/:id
 * @access private
 */
export const updateSubCategory = handler.updateOne(SubCategoryModel);

/** Delete Specific SubCategory
 * @route DELETE /api/v1/subcategories/:id
 * @access privet
 */
export const deleteSubCategory = handler.deleteOne(SubCategoryModel);

export default {
  getSubCategories,
  getSubCategory,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
};
