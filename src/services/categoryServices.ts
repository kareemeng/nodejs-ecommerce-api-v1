import handler from "./handlers";
import { CategoryModel } from "../models/CategoryModel";
import { uploadSingleImage } from "../middleware/uploadImageMiddleware";

export const uploadCategoryImage = uploadSingleImage("image");

export const resizeCategoryImage = handler.resizeImage(
  500,
  500,
  "jpeg",
  "categories"
);
/**  Get List of All categories
 * @route GET /api/v1/categories
 * @access public
 */
export const getCategories = handler.getAll(CategoryModel, "categories");
/** Get specific category
 * @route GET /api/v1/categories/:id
 * @access public
 */
export const getCategory = handler.getOne(CategoryModel);
/** Create New Category
 * @route POST /api/v1/categories
 * @access private
 */
export const createCategory = handler.createOne(CategoryModel);
/** Update Specific Category
 * @route PUT /api/v1/categories/:id
 * @access private
 */
export const updateCategory = handler.updateOne(CategoryModel);
/** Delete Specific Category
 * @route DELETE /api/v1/categories/:id
 * @access privet
 */
export const deleteCategory = handler.deleteOne(CategoryModel);

export default {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
