// controllers/categoryController.js
import Category from "../models/category.js";
import Meme from "../models/memes.js";

/**
 * @desc    Create a new category
 * @route   POST /api/categories
 * @access  Admin (or public if you want)
 */
export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    // check if category already exists
    const existingCategory = await Category.findOne({ name: name.trim() });
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }

    // create category
    const category = new Category({
      name: name.trim(),
      description,
    });

    await category.save();

    res.status(201).json({
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc    Get memes by category
 * @route   GET /api/categories/:categoryId/memes
 * @access  Public
 */
export const getMemesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const memes = await Meme.find({ category: categoryId })
      .populate("category", "name")
      .populate("author");

    res.json(memes);
  } catch (error) {
    console.error("Error fetching memes by category:", error);
    res.status(500).json({ error: "Server error" });
  }
};
