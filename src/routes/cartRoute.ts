import express from "express";
import {
  addProductToCart,
  getLoggedUserCart,
  applyCouponToCart,
  updateQuantity,
  removeCartItem,
  clearCart,
} from "../services/cartServices";
//TODO: add validators
/*
import {
  getCouponValidator,
  createCouponValidator,
  updateCouponValidator,
  deleteCouponValidator,
} from "../utils/validators/couponValidator";
*/
import { protect, restrictTo } from "../services/authServices";
const router = express.Router();
router.use("*", protect, restrictTo("user"));
router
  .route("/")
  .post(addProductToCart)
  .get(getLoggedUserCart)
  .delete(clearCart);

router.route("/applyCoupon").put(applyCouponToCart);
router.route("/:id").put(updateQuantity).delete(removeCartItem);

export default router;
