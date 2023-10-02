import express from "express";
import {
  getSubCategories,
  getSubCategory,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
} from "../services/subCategoryServices";
import {
  getSubCategoryValidator,
  createSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} from "../utils/validators/subCategoryValidator";
import {
  setMainCategoryIdToBody,
  setFilter,
  removeDuplicateSubCategories,
} from "../middlewares/subCategoryMiddleware";
import { protect, restrictTo } from "../services/authServices";
//mergeParams: true is required for nested routes to access the parent params
//ex we need to access the mainCategoryId in the subCategoryRoute from the categoryRoute
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(setFilter, getSubCategories)
  .post(
    protect,
    restrictTo("admin", "manager"),
    setMainCategoryIdToBody,
    createSubCategoryValidator,
    createSubCategory
  );

router
  .route("/:id")
  .get(getSubCategoryValidator, getSubCategory)
  .put(
    protect,
    restrictTo("admin", "manager"),
    updateSubCategoryValidator,
    updateSubCategory
  )
  .delete(
    protect,
    restrictTo("admin"),
    deleteSubCategoryValidator,
    deleteSubCategory
  );

export default router;
