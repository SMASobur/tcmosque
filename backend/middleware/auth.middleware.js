import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const SECRET = process.env.JWT_SECRET || "yoursecretkey";

// Middleware to verify token and attach user object
const authMiddleware = async (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(auth.split(" ")[1], SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user; // Now req.user has full role, email, etc.
    next();
  } catch (err) {
    console.error("Auth error:", err);
    res.status(401).json({ message: "Invalid token" });
  }
};

// Middleware to allow only superadmins
export const isSuperAdmin = (req, res, next) => {
  if (req.user?.role !== "superadmin") {
    return res
      .status(403)
      .json({ message: "Access denied: Super Admins only" });
  }
  next();
};

// Role-based authorization with hierarchy
export const requireRole = (requiredRole) => {
  const roleHierarchy = ["user", "admin", "superadmin"];

  return (req, res, next) => {
    const userRole = req.user?.role;
    const userIndex = roleHierarchy.indexOf(userRole);
    const requiredIndex = roleHierarchy.indexOf(requiredRole);

    if (userIndex === -1 || userIndex < requiredIndex) {
      return res
        .status(403)
        .json({ message: "Access denied: insufficient permissions" });
    }

    next();
  };
};

export default authMiddleware;
