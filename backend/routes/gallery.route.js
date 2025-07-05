import express from "express";
import {
  getGallery,
  addGalleryItem,
  deleteGalleryImage,
} from "../controllers/gallery.controller.js";

const router = express.Router();

router.get("/", getGallery);
router.post("/", addGalleryItem);
router.delete("/:id", deleteGalleryImage);

export default router;
