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
} from "../middleware/subCategoryMiddleware";

//mergeParams: true is required for nested routes to access the parent params
//ex we need to access the mainCategoryId in the subCategoryRoute from the categoryRoute
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(setFilter, getSubCategories)
  .post(setMainCategoryIdToBody, createSubCategoryValidator, createSubCategory);

router
  .route("/:id")
  .get(getSubCategoryValidator, getSubCategory)
  .put(updateSubCategoryValidator, updateSubCategory)
  .delete(deleteSubCategoryValidator, deleteSubCategory);

export default router;
