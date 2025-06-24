import express from "express";
import {
  createProductBooks,
  deleteProductBooks,
  getProductsBooks,
  getSingleProductsBooks,
  updateProductBooks,
} from "../controllers/book.controller.js";

import authMiddleware, { requireRole } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getProductsBooks);
router.get("/:id", getSingleProductsBooks);

// Protected (admin-only)
router.post("/", authMiddleware, createProductBooks);
router.put("/:id", authMiddleware, updateProductBooks);
router.delete("/:id", authMiddleware, deleteProductBooks);
//role base actjion controll
// router.delete("/:id", authMiddleware, requireRole("admin"), deleteProductBooks);

export default router;
