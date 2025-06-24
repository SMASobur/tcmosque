import express from "express";
import {
  getAllUsers,
  updateUserRole,
  deleteUser,
} from "../controllers/admin.controller.js";
import authMiddleware, {
  isSuperAdmin,
  requireRole,
} from "../middleware/auth.middleware.js";

const router = express.Router();

// GET /api/admin/users
router.get("/users", authMiddleware, requireRole("admin"), getAllUsers);
router.put(
  "/users/:id/role",
  authMiddleware,
  requireRole("admin"),
  updateUserRole
);
// DELETE /api/admin/users/:id
router.delete("/users/:id", authMiddleware, isSuperAdmin, deleteUser);

export default router;
