import express from "express";
import {
  addToWishlist,
  RemoveFromWishlist,
  getWishlist,
} from "../services/wishlistServices";
import {
  getWishlistValidator,
  createWishlistValidator,
  updateWishlistValidator,
  deleteWishlistValidator,
} from "../utils/validators/wishlistValidator";
import { protect, restrictTo } from "../services/authServices";
const router = express.Router();

router.use(protect, restrictTo("user"));
router.route("/").get(getWishlist).post(createWishlistValidator, addToWishlist);

router
  .route("/:productId")
  //   .get(getWishlistValidator, getWishlist)
  .delete(deleteWishlistValidator, RemoveFromWishlist);

export default router;
