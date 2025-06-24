import mongoose from "mongoose";
import { Book } from "../models/book.model.js";

// Route to get all books from the database
export const getProductsBooks = async (req, res) => {
  try {
    const books = await Book.find({});
    res.status(200).json({
      success: true,
      count: books.length,
      data: books,
    });
  } catch (error) {
    console.error("Error fetching books:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// Route to save a new book
export const createProductBooks = async (req, res) => {
  try {
    const { title, author, publishYear, price, createdBy } = req.body;

    // Validate required fields
    if (!title || !author || !price) {
      return res
        .status(400)
        .json({ message: "Please fill in all required fields." });
    }

    // Create and save the book
    const book = await Book.create({
      title,
      author,
      publishYear,
      price,
      createdBy,
    });

    return res.status(201).json({
      success: true,
      message: "Book created successfully.",
      data: book,
    });
  } catch (error) {
    console.error("Error creating book:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// Route to get a book by ID
export const getSingleProductsBooks = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid book ID format.",
      });
    }

    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Book retrieved successfully.",
      data: book,
    });
  } catch (error) {
    console.error("Error fetching book by ID:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// Route to update a book by ID
export const updateProductBooks = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, publishYear, price, updatedBy } = req.body;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid book ID format.",
      });
    }

    // Validate required fields
    if (!title || !author || !price) {
      return res.status(400).json({
        success: false,
        message: "Fields (title, author, publishYear) are required.",
      });
    }
    // First find the book to check ownership
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found.",
      });
    }

    // Check permissions: admin/superadmin OR original creator
    const isAdmin = req.user.role === "admin" || req.user.role === "superadmin";
    const isOwner = book.createdBy?.id?.toString() === req.user.id;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this book.",
      });
    }

    const updatedBook = await Book.findByIdAndUpdate(
      id,
      { title, author, publishYear, price, updatedBy },
      { new: true }
    );

    if (!updatedBook) {
      return res.status(404).json({
        success: false,
        message: "Book not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Book updated successfully.",
      data: updatedBook,
    });
  } catch (error) {
    console.error("Error updating book:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// Route to delete a book by ID
export const deleteProductBooks = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid book ID format.",
      });
    }

    const deletedBook = await Book.findByIdAndDelete(id);

    if (!deletedBook) {
      return res.status(404).json({
        success: false,
        message: "Book not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Book deleted successfully.",
      data: deletedBook,
    });
  } catch (error) {
    console.error("Error deleting book:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};
