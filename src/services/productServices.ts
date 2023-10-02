import { ProductModel } from "../models/productModel";
import asyncHandler from "express-async-handler";
import handler from "./handlers";

/**  Get List of All Products
 * @route GET /api/v1/products
 * @access public
 */
export const getProducts = asyncHandler(
  //populate("category", "name -_id") handel by model query middleware
  handler.getAll(ProductModel, "Product")
);
/** Get specific Product
 * @route GET /api/v1/products/:id
 * @access public
 */
export const getProduct = asyncHandler(handler.getOne(ProductModel));
/** Create New Product
 * @route POST /api/v1/products
 * @access private
 */
export const createProduct = asyncHandler(handler.createOne(ProductModel));
/** Update Specific Product
 * @route PUT /api/v1/products/:id
 * @access private
 */
export const updateProduct = asyncHandler(handler.updateOne(ProductModel));
/** Delete Specific Product
 * @route DELETE /api/v1/products/:id
 * @access privet
 */
export const deleteProduct = asyncHandler(handler.deleteOne(ProductModel));

export default {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
