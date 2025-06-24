// import mongoose from "mongoose";

// const expenseSchema = new mongoose.Schema({
//   description: { type: String, required: true },
//   amount: { type: Number, required: true },
//   date: { type: Date, default: Date.now },
// });

// export const Expense = mongoose.model("Expense", expenseSchema);

import mongoose from "mongoose";
const expenseSchema = new mongoose.Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ExpenseCategory",
    required: true,
  },
});

export const Expense = mongoose.model("Expense", expenseSchema);
