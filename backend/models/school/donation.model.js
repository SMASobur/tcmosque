import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
  {
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donor",
      required: true,
    },
    amount: { type: Number, required: true },
    medium: { type: String, required: true },
    date: { type: Date, required: true },
    createdBy: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    },
    updatedBy: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      name: String,
    },
  },
  { timestamps: true }
);

export const Donation = mongoose.model("Donation", donationSchema);
