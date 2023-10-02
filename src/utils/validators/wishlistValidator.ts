// check is used instead of param and body because it can be used in both cases
import { check } from "express-validator";
import { ProductModel } from "../../models/productModel";
import { validatorMiddleware } from "../../middlewares/validatorMiddleware";
export const getWishlistValidator = [
  check("id")
    .notEmpty()
    .withMessage("Wishlist id is required")
    .isMongoId()
    .withMessage("invalid Wishlist id format"),
  validatorMiddleware,
];

export const createWishlistValidator = [
  check("productId")
    .notEmpty()
    .withMessage("Product id is required")
    .isMongoId()
    .withMessage("invalid Product id format")
    .custom(async (productId) => {
      const product = await ProductModel.findById(productId);
      if (!product) {
        throw new Error("Product not found");
      }
      return true;
    }),
  validatorMiddleware,
];

export const updateWishlistValidator = [
  check("id")
    .notEmpty()
    .withMessage("Wishlist id is required")
    .isMongoId()
    .withMessage("invalid Wishlist id format"),
  check("name")
    .optional()
    .notEmpty()
    .withMessage("Wishlist name is required")
    .isLength({ min: 2, max: 32 })
    .withMessage("Wishlist name must be between 2 to 32 characters"),
  validatorMiddleware,
];

export const deleteWishlistValidator = [
  check("productId")
    .notEmpty()
    .withMessage("Product id is required")
    .isMongoId()
    .withMessage("invalid Product id format"),
  validatorMiddleware,
];

export default {
  getWishlistValidator,
  createWishlistValidator,
  updateWishlistValidator,
  deleteWishlistValidator,
};
