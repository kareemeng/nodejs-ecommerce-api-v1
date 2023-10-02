import express from "express";
import {
  getBrands,
  createBrand,
  getBrand,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
  resizeBrandImage,
} from "../services/brandServices";
import {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} from "../utils/validators/brandValidator";
import { protect, restrictTo } from "../services/authServices";
const router = express.Router();

router
  .route("/")
  .get(getBrands)
  .post(
    protect,
    restrictTo("admin", "manager"),
    uploadBrandImage,
    resizeBrandImage,
    createBrandValidator,
    createBrand
  );

router
  .route("/:id")
  .get(getBrandValidator, getBrand)
  .put(
    protect,
    restrictTo("admin", "manager"),
    uploadBrandImage,
    resizeBrandImage,
    updateBrandValidator,
    updateBrand
  )
  .delete(protect, restrictTo("admin"), deleteBrandValidator, deleteBrand);

export default router;
