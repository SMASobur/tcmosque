import { Donor } from "../../models/school/donor.model.js";
import { Donation } from "../../models/school/donation.model.js";
import { Expense } from "../../models/school/expense.model.js";
import { ExpenseCategory } from "../../models/school/expenseCategory.model.js";

// Get all donors
export const getDonors = async (req, res) => {
  const donors = await Donor.find().lean();
  res.json(donors);
};
// Add new donor
export const createDonor = async (req, res) => {
  try {
    const { name, createdBy } = req.body;
    const donor = new Donor({ name, createdBy });
    const savedDonor = await donor.save();

    // Make sure to return this exact structure
    res.status(201).json({
      success: true,
      message: "Donor created successfully",
      data: savedDonor, // Ensure this includes _id
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
export const updateDonor = async (req, res) => {
  try {
    const updatedDonor = await Donor.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    );

    if (!updatedDonor) {
      return res.status(404).json({ message: "Donor not found" });
    }

    res.json({
      success: true,
      message: "Donor updated successfully",
      data: updatedDonor,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all donations
export const getDonations = async (req, res) => {
  const donations = await Donation.find().populate("donorId", "name");
  res.json(donations);
};
// Add donation
export const createDonation = async (req, res) => {
  try {
    const { donorId, amount, medium, date, createdBy } = req.body;
    const donation = new Donation({ donorId, amount, medium, date, createdBy });
    const savedDonation = await donation.save();

    res.status(201).json({
      success: true,
      message: "Donation created successfully",
      data: {
        ...savedDonation.toObject(),
        id: savedDonation._id,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
export const updateDonation = async (req, res) => {
  try {
    const updatedDonation = await Donation.findByIdAndUpdate(
      req.params.id,
      {
        amount: req.body.amount,
        date: req.body.date,
        medium: req.body.medium,
        donorId: req.body.donorId,
      },
      { new: true }
    ).populate("donorId", "name");

    if (!updatedDonation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    res.json({
      success: true,
      message: "Donation updated successfully",
      data: updatedDonation,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all expenses
export const getExpenses = async (req, res) => {
  const expenses = await Expense.find().populate("category", "name");
  res.json(expenses);
};
// Add expense
export const createExpense = async (req, res) => {
  try {
    const { description, amount, date, category, createdBy } = req.body;
    const expense = new Expense({
      description,
      amount,
      date,
      category,
      createdBy,
    });
    const savedExpense = await expense.save();

    res.status(201).json({
      success: true,
      message: "Expense created successfully",
      data: {
        ...savedExpense.toObject(),
        id: savedExpense._id,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateExpense = async (req, res) => {
  try {
    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("category", "name");

    if (!updatedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json({
      success: true,
      message: "Expense updated",
      data: updatedExpense,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllSchoolData = async (req, res) => {
  try {
    const [donors, donations, expenses, expenseCategories] = await Promise.all([
      Donor.find(),
      Donation.find(),
      Expense.find(),
      ExpenseCategory.find(),
    ]);

    res.json({
      donors,
      donations,
      expenses,
      expenseCategories,
    });
  } catch (error) {
    console.error("Error in getAllSchoolData:", error);
    res.status(500).json({ message: error.message });
  }
};
// Get all expense categories
export const getExpenseCategories = async (req, res) => {
  try {
    const categories = await ExpenseCategory.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new expense category
export const createExpenseCategory = async (req, res) => {
  try {
    const { name, createdBy } = req.body;
    const category = new ExpenseCategory({ name, createdBy });
    const savedCategory = await category.save();

    res.status(201).json({
      success: true,
      message: "Expense category created successfully",
      data: savedCategory,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
export const deleteExpense = async (req, res) => {
  try {
    const deletedExpense = await Expense.findByIdAndDelete(req.params.id);
    if (!deletedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.json({ success: true, message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const deleteDonor = async (req, res) => {
  try {
    // Delete donor and all their donations
    await Donation.deleteMany({ donorId: req.params.id });
    const deletedDonor = await Donor.findByIdAndDelete(req.params.id);

    if (!deletedDonor) {
      return res.status(404).json({ message: "Donor not found" });
    }

    res.json({
      success: true,
      message: "Donor and donations deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteDonation = async (req, res) => {
  try {
    const deletedDonation = await Donation.findByIdAndDelete(req.params.id);
    if (!deletedDonation) {
      return res.status(404).json({ message: "Donation not found" });
    }
    res.json({ success: true, message: "Donation deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteExpenseCategory = async (req, res) => {
  try {
    // Delete category and all associated expenses
    await Expense.deleteMany({
      $or: [{ category: req.params.id }, { "category._id": req.params.id }],
    });
    const deletedCategory = await ExpenseCategory.findByIdAndDelete(
      req.params.id
    );

    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({
      success: true,
      message: "Category and expenses deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
