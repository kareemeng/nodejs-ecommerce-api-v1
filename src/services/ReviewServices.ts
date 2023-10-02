import { Request, Response, NextFunction } from "express";
import handler from "./handlers";
import { ReviewModel } from "../models/ReviewModel";

/**
 * nested route to get review(s) of a specific product
 * @route GET /api/v1/products/:productId/reviews
 * @route GET /api/v1/products/:productId/reviews/:reviewId
 */
export const setFilter = (req: Request, res: Response, next: NextFunction) => {
  let filter = {};
  // no need because getOne will handle it by default
  // if (req.params.productId && req.params.reviewId)
  //   filter = { product: req.params.productId, _id: req.params.reviewId };
  if (req.params.productId) filter = { product: req.params.productId };
  req.body.filter = filter;
  next();
};
/**
 * nested route to create review of a specific product
 * @route POST /api/v1/products/:productId/reviews
 */
export const setProductIdAndUserIdToBody = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};
/**  Get List of All Reviews
 * @route GET /api/v1/reviews
 * @access public
 */
export const getReviews = handler.getAll(ReviewModel, "reviews");
/** Get specific Review
 * @route GET /api/v1/reviews/:id
 * @access public
 */
export const getReview = handler.getOne(ReviewModel);
/** Create New Review
 * @route POST /api/v1/reviews
 * @access private
 */
export const createReview = handler.createOne(ReviewModel);
/** Update Specific Review
 * @route PUT /api/v1/reviews/:id
 * @access private
 */
export const updateReview = handler.updateOne(ReviewModel);
/** Delete Specific Review
 * @route DELETE /api/v1/reviews/:id
 * @access privet
 */
export const deleteReview = handler.deleteOne(ReviewModel);

export default {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
};
