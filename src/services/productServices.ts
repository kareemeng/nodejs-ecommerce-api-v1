import handler from "./handlers";
import { ProductModel } from "../models/productModel";
import { uploadMixedImage } from "../middlewares/uploadImageMiddleware";

export const uploadProductImage = uploadMixedImage([
  { name: "cover", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

export const resizeProductImage = handler.resizeProductImages();

/**  Get List of All Products
 * @route GET /api/v1/products
 * @access public
 */
export const getProducts = handler.getAll(ProductModel, "Product");
/** Get specific Product
 * @route GET /api/v1/products/:id
 * @access public
 */
export const getProduct = handler.getOne(ProductModel);
/** Create New Product
 * @route POST /api/v1/products
 * @access private
 */
export const createProduct = handler.createOne(ProductModel);
/** Update Specific Product
 * @route PUT /api/v1/products/:id
 * @access private
 */
export const updateProduct = handler.updateOne(ProductModel);
/** Delete Specific Product
 * @route DELETE /api/v1/products/:id
 * @access privet
 */
export const deleteProduct = handler.deleteOne(ProductModel);

export default {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  resizeProductImage,
};
