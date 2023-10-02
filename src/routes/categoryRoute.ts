import express from "express";
import subCategoryRoute from "./subcategoryRoute";
import {
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
//* Adding Nested Routes
router.use("/:mainCategory/subcategories", subCategoryRoute);

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

/* //?instead of using the router this way we can group same routes together using route method
// router.get("/", categoryServices.getCategories);
// router.get("/:id", categoryServices.getCategory);
// router.post("/", categoryServices.createCategory);
// router.put("/:id", categoryServices.updateCategory);
// router.delete("/:id", categoryServices.deleteCategory);
*/
