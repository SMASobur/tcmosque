import mongoose from "mongoose";

const donationSchema = new mongoose.Schema({
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Donor",
    required: true,
  },
  amount: { type: Number, required: true },
  medium: { type: String, required: false },
  date: { type: Date, default: Date.now },
});

export const Donation = mongoose.model("Donation", donationSchema);
