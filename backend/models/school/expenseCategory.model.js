import mongoose from "mongoose";

const expenseCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
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
  },
  { timestamps: true }
);

export const ExpenseCategory = mongoose.model(
  "ExpenseCategory",
  expenseCategorySchema
);
