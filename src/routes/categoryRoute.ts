import express from "express";
import categoryServices from "../services/categoryServices";
const router = express.Router();
router.get("/", categoryServices.getCategories);
router.post("/", categoryServices.createCategory);

export default router;
