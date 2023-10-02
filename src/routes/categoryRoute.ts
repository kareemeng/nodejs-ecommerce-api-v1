import express from "express";
// import { param, validationResult } from "express-validator";
import categoryServices, {
  getCategories,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
} from "../services/categoryServices";
import {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} from "../utils/validators/categoryValidator";
const router = express.Router();

//?instead of using the router this way we can group same routes together using route method
/*
// router.get("/", categoryServices.getCategories);
// router.get("/:id", categoryServices.getCategory);
// router.post("/", categoryServices.createCategory);
// router.put("/:id", categoryServices.updateCategory);
// router.delete("/:id", categoryServices.deleteCategory);
*/

router
  .route("/")
  .get(getCategories)
  .post(createCategoryValidator, createCategory);

router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(updateCategoryValidator, updateCategory)
  .delete(deleteCategoryValidator, deleteCategory);

export default router;
