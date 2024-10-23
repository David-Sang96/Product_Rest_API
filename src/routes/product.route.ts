import express from "express";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  getProductsByCategoryId,
  updateProduct,
} from "../controllers/product.controller";
const router = express.Router();

router.get("/", getProducts);

router.get("/:id", getProductById);

router.get("/category/:categoryId", getProductsByCategoryId);

router.post("/", createProduct);

router.put("/:id", updateProduct);

router.delete("/:id", deleteProduct);

export default router;
