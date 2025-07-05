import Gallery from "../models/gallery.model.js";

export const getGallery = async (req, res) => {
  try {
    const images = await Gallery.find();
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addGalleryItem = async (req, res) => {
  const { category, caption, imageUrl } = req.body;
  try {
    const newItem = new Gallery({ category, caption, imageUrl });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteGalleryImage = async (req, res) => {
  try {
    const deleted = await Gallery.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Image not found" });
    }
    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
