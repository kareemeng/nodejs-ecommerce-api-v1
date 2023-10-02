import { CategoryModel } from "../models/CategoryModel";
import asyncHandler from "express-async-handler";
import handler from "./handlers";

/**  Get List of All categories
 * @route GET /api/v1/categories
 * @access public
 */
export const getCategories = asyncHandler(
  handler.getAll(CategoryModel, "categories")
);
/** Get specific category
 * @route GET /api/v1/categories/:id
 * @access public
 */
export const getCategory = asyncHandler(handler.getOne(CategoryModel));
/** Create New Category
 * @route POST /api/v1/categories
 * @access private
 */
export const createCategory = asyncHandler(handler.createOne(CategoryModel));
/** Update Specific Category
 * @route PUT /api/v1/categories/:id
 * @access private
 */
export const updateCategory = asyncHandler(handler.updateOne(CategoryModel));
/** Delete Specific Category
 * @route DELETE /api/v1/categories/:id
 * @access privet
 */
export const deleteCategory = asyncHandler(handler.deleteOne(CategoryModel));

export default {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
