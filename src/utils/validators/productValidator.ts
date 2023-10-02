import { validatorMiddleware } from "../../middleware/validatorMiddleware";
import { CategoryModel } from "../../models/CategoryModel";
import { SubCategoryModel } from "../../models/SubCategoryModel";
import { BrandModel } from "../../models/BrandModel";
// check is used instead of param and body because it can be used in both cases
import { check } from "express-validator";

export const getProductValidator = [
  check("id")
    .notEmpty()
    .withMessage("Product id is required")
    .isMongoId()
    .withMessage("invalid Product id format"),
  validatorMiddleware,
];

export const createProductValidator = [
  check("title")
    .notEmpty()
    .withMessage("Product title is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Product title must be between 2 to 32 characters"),
  check("description")
    .notEmpty()
    .withMessage("Product description is required"),
  check("description")
    .isLength({ min: 20, max: 2000 })
    .withMessage("Product description must be between 20 to 2000 characters"),
  check("quantity")
    .notEmpty()
    .withMessage("Product description is required")
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("price")
    .notEmpty()
    .withMessage("Product price is required")
    .isNumeric()
    .withMessage("Product price must be a number")
    .isFloat({ min: 1, max: 1_000_000 })
    .withMessage("Product price must be between 1 to 10 digits"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Product sold must be a number"),
  check("price_sale")
    .optional()
    .toFloat()
    .isNumeric()
    .withMessage("Product price_sale must be a number")
    .custom((value, { req }) => {
      if (value > req.body.price) {
        throw new Error("Product price_sale must be less than price");
      }
      return true;
    }),
  check("colors")
    .optional()
    .isArray()
    .withMessage("Product color must be an Array of string"),
  check("cover").notEmpty().withMessage("Product Cover Image is required"),
  check("images")
    .optional()
    .isArray()
    .withMessage("Product images must be an Array of string"),
  check("category")
    .notEmpty()
    .withMessage("Product category is required")
    .isMongoId()
    .withMessage("invalid Product category id format")
    .custom(async (mainCategory) => {
      //check if givin Category are valid
      const category = await CategoryModel.findById(mainCategory);
      if (!category)
        return Promise.reject(
          new Error(`There is no Category with this id${mainCategory}`)
        );
    }),
  check("brand")
    .optional()
    .isMongoId()
    .withMessage("invalid Product brand id format")
    .custom(async (Brand) => {
      //check if givin Brand are valid
      const brand = await BrandModel.findById(Brand);
      if (!brand)
        return Promise.reject(
          new Error(`There is no Category with this id${Brand}`)
        );
    }),
  check("subcategories")
    .optional()
    .isMongoId()
    .withMessage("invalid Product subcategory id format")
    .custom(async (subcategories) => {
      //check if all givin subcategories are valid
      const existingSubCategories = await SubCategoryModel.find({
        _id: { $exists: true, $in: subcategories },
      });
      if (existingSubCategories.length !== subcategories.length)
        return Promise.reject(
          new Error(`Invalid SubCategories ids ${subcategories}`)
        );
    })
    .custom(async (subcategories, { req }) => {
      //check if all givin subcategories are included in the category
      const subCategoriesInCategory = await SubCategoryModel.find({
        mainCategory: req.body.category,
      });
      const subCategoriesInCategoryIds = subCategoriesInCategory.map(
        (subCategory) => subCategory._id.toString()
      );

      const correct = subcategories.every((subCategory: string) =>
        subCategoriesInCategoryIds.includes(subCategory)
      );
      if (!correct) {
        return Promise.reject(
          new Error(
            `SubCategories ids are not in Category ${req.body.category}`
          )
        );
      }
    }),
  check("ratingAvg")
    .optional()
    .isNumeric()
    .withMessage("Product ratingAvg must be a number")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Product ratingAvg must be 1 digit"),
  check("ratingQuantity")
    .optional()
    .isNumeric()
    .withMessage("Product ratingQuantity must be a number"),
  validatorMiddleware,
];

export const updateProductValidator = [
  check("id")
    .notEmpty()
    .withMessage("Product id is required")
    .isMongoId()
    .withMessage("invalid Product id format"),
  check("category")
    .optional()
    .notEmpty()
    .withMessage("Product category is required")
    .isMongoId()
    .withMessage("invalid Product category id format")
    .custom(async (mainCategory) => {
      const category = await CategoryModel.findById(mainCategory);
      if (!category)
        return Promise.reject(
          new Error(`There is no Category with this id ${mainCategory}`)
        );
    }),
  validatorMiddleware,
];

export const deleteProductValidator = [
  check("id")
    .notEmpty()
    .withMessage("Product id is required")
    .isMongoId()
    .withMessage("invalid Product id format"),
  validatorMiddleware,
];

export default {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
};
