// check is used instead of param and body because it can be used in both cases
import { check } from "express-validator";
import { validatorMiddleware } from "../../middlewares/validatorMiddleware";
import { Coupon, CouponModel } from "../../models/CouponModel";
export const getCouponValidator = [
  check("id")
    .notEmpty()
    .withMessage("Coupon id is required")
    .isMongoId()
    .withMessage("invalid Coupon id format"),
  validatorMiddleware,
];

export const createCouponValidator = [
  check("name")
    .notEmpty()
    .withMessage("coupon name is required")
    .custom(async (Coupon) => {
      //check if givin Coupon are valid
      const coupon = await CouponModel.find({ name: Coupon });
      if (coupon.length > 0) {
        return Promise.reject("Coupon already exists");
      }
    }),
  validatorMiddleware,
];

export const updateCouponValidator = [
  check("id")
    .notEmpty()
    .withMessage("Coupon id is required")
    .isMongoId()
    .withMessage("invalid Coupon id format")
    .custom(async (couponId) => {
      //check if givin Coupon are valid
      const coupon = await CouponModel.findById(couponId);
      if (!coupon)
        return Promise.reject(
          new Error(`There is no Category with this id${couponId}`)
        );
    }),
  check("name")
    .optional()
    .notEmpty()
    .withMessage("Coupon name is required")
    .custom(async (Coupon) => {
      //check if givin Coupon are valid
      const coupon = await CouponModel.find({ email: Coupon });
      if (coupon.length > 0) {
        return Promise.reject("Coupon already exists");
      }
    }),
  validatorMiddleware,
];

export const deleteCouponValidator = [
  check("id")
    .notEmpty()
    .withMessage("Coupon id is required")
    .isMongoId()
    .withMessage("invalid Coupon id format"),
  validatorMiddleware,
];

export default {
  getCouponValidator,
  createCouponValidator,
  updateCouponValidator,
  deleteCouponValidator,
};
