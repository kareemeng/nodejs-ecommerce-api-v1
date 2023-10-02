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
const router = express.Router();

router
  .route("/")
  .get(getBrands)
  .post(uploadBrandImage, resizeBrandImage, createBrandValidator, createBrand);

router
  .route("/:id")
  .get(getBrandValidator, getBrand)
  .put(uploadBrandImage, resizeBrandImage, updateBrandValidator, updateBrand)
  .delete(deleteBrandValidator, deleteBrand);

export default router;
