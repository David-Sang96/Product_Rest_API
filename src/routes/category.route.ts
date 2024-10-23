import express from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../controllers/category.controller";
const router = express.Router();

router.get("/", getCategories);

router.post("/", createCategory);

router.put("/:id", updateCategory);

router.delete("/:id", deleteCategory);

export default router;
