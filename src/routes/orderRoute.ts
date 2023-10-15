import express from "express";
import {
  createCashOrder,
  getLoggedUserOrders,
  getOrders,
  getOrder,
} from "../services/orderServices";
//TODO: add validators
import { protect, restrictTo } from "../services/authServices";
const router = express.Router();

router.use(protect);
router.route("/:cartId").post(restrictTo("user"), createCashOrder);

router.use(restrictTo("admin", "manager", "user"));
router.route("/").get(getLoggedUserOrders, getOrders);
router.route("/:id").get(getOrder);
export default router;
