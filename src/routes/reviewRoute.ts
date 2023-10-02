import express from "express";
import {
  setFilter,
  setProductIdAndUserIdToBody,
  getReviews,
  createReview,
  getReview,
  updateReview,
  deleteReview,
} from "../services/ReviewServices";
import {
  getReviewValidator,
  createReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
} from "../utils/validators/reviewValidator";
import { protect, restrictTo } from "../services/authServices";
//mergeParams: true is required for nested routes to access the parent params
//ex we need to access the productId in the reviewRoute from the productRoute
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(setFilter, getReviews)
  .post(
    protect,
    restrictTo("user"),
    setProductIdAndUserIdToBody,
    createReviewValidator,
    createReview
  );

router
  .route("/:id")
  .get(getReviewValidator, getReview)
  .put(protect, restrictTo("user"), updateReviewValidator, updateReview)
  .delete(
    protect,
    restrictTo("admin", "user", "manager"),
    deleteReviewValidator,
    deleteReview
  );

export default router;
