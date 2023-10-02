import express from "express";
import {
  getCoupons,
  createCoupon,
  getCoupon,
  updateCoupon,
  deleteCoupon,
} from "../services/couponServices";
import {
  getCouponValidator,
  createCouponValidator,
  updateCouponValidator,
  deleteCouponValidator,
} from "../utils/validators/couponValidator";
import { protect, restrictTo } from "../services/authServices";
const router = express.Router();
router.use("*", protect, restrictTo("admin", "manager"));
router.route("/").get(getCoupons).post(createCouponValidator, createCoupon);

router
  .route("/:id")
  .get(getCouponValidator, getCoupon)
  .put(updateCouponValidator, updateCoupon)
  .delete(protect, restrictTo("admin"), deleteCouponValidator, deleteCoupon);

export default router;
