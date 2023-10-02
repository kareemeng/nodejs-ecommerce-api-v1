import { CouponModel } from "../models/CouponModel";
import handler from "./handlers";

/**  Get List of All Coupons
 * @route GET /api/v1/Coupons
 * @access private
 */
export const getCoupons = handler.getAll(CouponModel, "Coupons");
/** Get specific Coupon
 * @route GET /api/v1/coupons/:id
 * @access private
 */
export const getCoupon = handler.getOne(CouponModel);
/** Create New Coupon
 * @route POST /api/v1/coupons
 * @access private
 */
export const createCoupon = handler.createOne(CouponModel);
/** Update Specific Coupons
 * @route PUT /api/v1/coupons/:id
 * @access private
 */
export const updateCoupon = handler.updateOne(CouponModel);
/** Delete Specific Coupon
 * @route DELETE /api/v1/coupons/:id
 * @access private
 */
export const deleteCoupon = handler.deleteOne(CouponModel);

export default {
  getCoupons,
  getCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon,
};
