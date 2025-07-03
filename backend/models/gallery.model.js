import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ["process", "3d-model"],
      required: true,
    },
    caption: { type: String, required: true },
    imageUrl: { type: String, required: true },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

export default mongoose.model("Gallery", gallerySchema);
