import express from "express";
import categoryServices, {
  getCategories,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
} from "../services/categoryServices";
const router = express.Router();
// *instead of using the router this way we can group same routes together using route method
// router.get("/", categoryServices.getCategories);
// router.get("/:id", categoryServices.getCategory);
// router.post("/", categoryServices.createCategory);
// router.put("/:id", categoryServices.updateCategory);
// router.delete("/:id", categoryServices.deleteCategory);
router.route("/").get(getCategories).post(createCategory);

router
  .route("/:id")
  .get(getCategory)
  .put(updateCategory)
  .delete(deleteCategory);

export default router;
