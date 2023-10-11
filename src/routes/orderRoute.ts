import express from "express";
import { createCashOrder } from "../services/orderServices";
//TODO: add validators
import { protect, restrictTo } from "../services/authServices";
const router = express.Router();
router.use(protect, restrictTo("user"));
router.route("/:cartId").post(createCashOrder);
export default router;
