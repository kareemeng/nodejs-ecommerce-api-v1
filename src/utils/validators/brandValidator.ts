import { validatorMiddleware } from "../../middleware/validatorMiddleware";
// check is used instead of param and body because it can be used in both cases
import { check } from "express-validator";
export const getBrandValidator = [
  check("id")
    .notEmpty()
    .withMessage("Brand id is required")
    .isMongoId()
    .withMessage("invalid Brand id format"),
  validatorMiddleware,
];

export const createBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("Brand name is required")
    .isLength({ min: 2, max: 32 })
    .withMessage("Brand name must be between 2 to 32 characters"),
  validatorMiddleware,
];

export const updateBrandValidator = [
  check("id")
    .notEmpty()
    .withMessage("Brand id is required")
    .isMongoId()
    .withMessage("invalid Brand id format"),
  check("name")
    .optional()
    .notEmpty()
    .withMessage("Brand name is required")
    .isLength({ min: 2, max: 32 })
    .withMessage("Brand name must be between 2 to 32 characters"),
  validatorMiddleware,
];

export const deleteBrandValidator = [
  check("id")
    .notEmpty()
    .withMessage("Brand id is required")
    .isMongoId()
    .withMessage("invalid Brand id format"),
  validatorMiddleware,
];

export default {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
};
