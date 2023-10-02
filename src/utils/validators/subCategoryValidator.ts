import { validatorMiddleware } from "../../middleware/validatorMiddleware";
// check is used instead of param and body because it can be used in both cases
import { check } from "express-validator";
export const getSubCategoryValidator = [
  check("id").notEmpty().withMessage("SubCategory id is required"),
  check("id").isMongoId().withMessage("invalid SubCategory id format"),
  validatorMiddleware,
];

export const createSubCategoryValidator = [
  check("mainCategory")
    .notEmpty()
    .withMessage("must belong to a main category"),
  check("mainCategory").isMongoId().withMessage("invalid category id format"),
  check("name").notEmpty().withMessage("SubCategory name is required"),
  check("name")
    .isLength({ min: 2, max: 32 })
    .withMessage("SubCategory name must be between 3 to 32 characters"),
  validatorMiddleware,
];

export const updateSubCategoryValidator = [
  check("id").notEmpty().withMessage("SubCategory id is required"),
  check("id").isMongoId().withMessage("invalid SubCategory id format"),
  check("name").notEmpty().withMessage("SubCategory name is required"),
  check("name")
    .isLength({ min: 2, max: 32 })
    .withMessage("SubCategory name must be between 2 to 32 characters"),
  validatorMiddleware,
];

export const deleteSubCategoryValidator = [
  check("id").notEmpty().withMessage("SubCategory id is required"),
  check("id").isMongoId().withMessage("invalid SubCategory id format"),
  validatorMiddleware,
];

export default {
  getSubCategoryValidator,
  createSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
};
