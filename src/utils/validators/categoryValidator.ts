import { validatorMiddleware } from "../../middleware/validatorMiddleware";
// check is used instead of param and body because it can be used in both cases
import { check } from "express-validator";
export const getCategoryValidator = [
  check("id")
    .notEmpty()
    .withMessage("Category id is required")
    .isMongoId()
    .withMessage("invalid category id format"),
  validatorMiddleware,
];

export const createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ min: 3, max: 32 })
    .withMessage("Category name must be between 3 to 32 characters"),
  validatorMiddleware,
];

export const updateCategoryValidator = [
  check("id")
    .notEmpty()
    .withMessage("Category id is required")
    .isMongoId()
    .withMessage("invalid category id format"),
  check("name")
    .optional()
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ min: 3, max: 32 })
    .withMessage("Category name must be between 3 to 32 characters"),
  validatorMiddleware,
];

export const deleteCategoryValidator = [
  check("id")
    .notEmpty()
    .withMessage("Category id is required")
    .isMongoId()
    .withMessage("invalid category id format"),
  validatorMiddleware,
];

export default {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
};
