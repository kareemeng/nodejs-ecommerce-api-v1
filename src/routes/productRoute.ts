import express from "express";
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/productServices";
import {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} from "../utils/validators/productValidator";

// import { removeDuplicateSubCategories } from  "../middleware/subCategoryMiddleware";
const router = express.Router();

router.route("/").get(getProducts).post(createProductValidator, createProduct);

router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .put(updateProductValidator, updateProduct)
  .delete(deleteProductValidator, deleteProduct);

export default router;
