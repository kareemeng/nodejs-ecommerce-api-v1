import express from "express";
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  resizeProductImage,
} from "../services/productServices";
import {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} from "../utils/validators/productValidator";
import { protect, restrictTo } from "../services/authServices";

// import { removeDuplicateSubCategories } from  "../middleware/subCategoryMiddleware";
const router = express.Router();

router
  .route("/")
  .get(getProducts)
  .post(
    protect,
    restrictTo("admin", "manager"),
    uploadProductImage,
    resizeProductImage,
    createProductValidator,
    createProduct
  );

router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .put(
    protect,
    restrictTo("admin", "manager"),
    updateProductValidator,
    updateProduct
  )
  .delete(protect, restrictTo("admin"), deleteProductValidator, deleteProduct);

export default router;
