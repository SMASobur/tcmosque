import mongoose from "mongoose";

const donorSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

export const Donor = mongoose.model("Donor", donorSchema);
