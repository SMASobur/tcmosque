import express from "express";
import {
  getGallery,
  addGalleryItem,
} from "../controllers/gallery.controller.js";

const router = express.Router();

router.get("/", getGallery);
router.post("/", addGalleryItem);

export default router;
