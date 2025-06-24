import express from "express";
import {
  getDonors,
  createDonor,
  getDonations,
  createDonation,
  getExpenses,
  createExpense,
  getAllSchoolData,
  getExpenseCategories,
  createExpenseCategory,
  deleteExpense,
  deleteDonor,
  deleteDonation,
  deleteExpenseCategory,
} from "../../controllers/school/school.controller.js";

import { ExpenseCategory } from "../../models/school/expenseCategory.model.js";

const router = express.Router();
router.get("/", getAllSchoolData);

router.get("/donors", getDonors);
router.post("/donors", createDonor);
router.delete("/donors/:id", deleteDonor);

router.get("/donations", getDonations);
router.post("/donations", createDonation);
router.delete("/donations/:id", deleteDonation);

router.get("/expense-categories", getExpenseCategories);
router.post("/expense-categories", createExpenseCategory);
router.delete("/expense-categories/:id", deleteExpenseCategory);

router.get("/expenses", getExpenses);
router.post("/expenses", createExpense);
router.delete("/expenses/:id", deleteExpense);

export default router;
