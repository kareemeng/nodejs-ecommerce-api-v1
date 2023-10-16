import express from "express";
import {
  createCashOrder,
  getLoggedUserOrders,
  getOrders,
  getOrder,
  updateOrderToPaid,
  updateOrderToDelivered,
  getCheckoutSession,
} from "../services/orderServices";
//TODO: add validators
import { protect, restrictTo } from "../services/authServices";
import { Session } from "inspector";
const router = express.Router();

router.use(protect);

router.route("/:cartId").post(restrictTo("user"), createCashOrder);
router.get("/checkout-session/:cartId", restrictTo("user"), getCheckoutSession);

router
  .route("/")
  .get(restrictTo("admin", "manager", "user"), getLoggedUserOrders, getOrders);
router.route("/:id").get(restrictTo("admin", "manager", "user"), getOrder);

router.put("/:id/paid", restrictTo("admin", "manager"), updateOrderToPaid);
router.put(
  "/:id/delivered",
  restrictTo("admin", "manager"),
  updateOrderToDelivered
);

export default router;
