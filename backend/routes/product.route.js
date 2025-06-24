import express from "express";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
  getSingleProducts,
} from "../controllers/product.controller.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getSingleProducts);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;