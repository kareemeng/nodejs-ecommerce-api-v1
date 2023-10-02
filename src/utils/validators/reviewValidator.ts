import { check } from "express-validator";
import { validatorMiddleware } from "../../middlewares/validatorMiddleware";
import { ReviewModel } from "../../models/ReviewModel";
import { ProductModel } from "../../models/productModel";
// check is used instead of param and body because it can be used in both cases
export const getReviewValidator = [
  check("id")
    .notEmpty()
    .withMessage("Review id is required")
    .isMongoId()
    .withMessage("invalid Review id format"),
  validatorMiddleware,
];

export const createReviewValidator = [
  check("rating")
    .notEmpty()
    .withMessage("Review rating is required")
    .isNumeric()
    .withMessage("Review rating must be a number")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Review rating must be between 1 to 5"),
  check("user")
    .custom((user, { req }) => {
      //check if the user owns the review
      //* convert the id object to string to compare
      if (req.user._id.toString() !== user.toString()) {
        throw new Error(
          "You are not authorized to create this review (wrong user)"
        );
      }
      return true;
    })
    .notEmpty()
    .withMessage("Review user is required")
    .isMongoId()
    .withMessage("invalid Review user format"),
  check("product")
    .notEmpty()
    .withMessage("Review product is required")
    .isMongoId()
    .withMessage("invalid Review product format")
    .custom(async (product, { req }) => {
      const productExists = await ProductModel.findById(product);
      if (!productExists) {
        throw new Error(`Product not found with id ${product}`);
      }
      //check if the user owns the review
      const review = await ReviewModel.findOne({
        product,
        user: req.body.user,
      });
      if (review) {
        throw new Error("You have already reviewed this product");
      }
      return true;
    }),
  validatorMiddleware,
];

export const updateReviewValidator = [
  check("id")
    .notEmpty()
    .withMessage("Review id is required")
    .isMongoId()
    .withMessage("invalid Review id format")
    .custom(async (review_id, { req }) => {
      //check if the user owns the review
      const review = await ReviewModel.findById(review_id);
      if (!review) {
        throw new Error(`Review not found with id ${review_id}`);
      }
      const user = review.user as any; // as any to avoid error in the next line as we populate the user
      //* convert the id object to string to compare
      if (req.user._id.toString() !== user._id.toString()) {
        throw new Error(
          "You are not authorized to update this review (wrong user or roll)"
        );
      }
      return true;
    }),
  check("rating")
    .optional()
    .notEmpty()
    .withMessage("Review rating is required")
    .isNumeric()
    .withMessage("Review rating must be a number")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Review rating must be between 1 to 5"),
  validatorMiddleware,
];

export const deleteReviewValidator = [
  check("id")
    .notEmpty()
    .withMessage("Review id is required")
    .isMongoId()
    .withMessage("invalid Review id format")
    .custom(async (review_id, { req }) => {
      const review = await ReviewModel.findById(review_id);
      if (!review) {
        throw new Error(`Review not found with id ${review_id}`);
      }
      const user = review.user as any; //!as any to avoid error in the next line as we populate the user
      //* convert the id object to string to compare
      if (
        req.user.role !== "admin" &&
        req.user.role !== "manager" &&
        req.user._id.toString() !== user._id.toString()
      ) {
        throw new Error(
          "You are not authorized to Delete this review (wrong user or roll)"
        );
      }
      return true;
    }),
  validatorMiddleware,
];

export default {
  getReviewValidator,
  createReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
};
