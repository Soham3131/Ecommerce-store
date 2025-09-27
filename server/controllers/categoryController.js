// src/controllers/categoryController.js
const Category = require('../models/Category');
const SubCategory = require('../models/SubCategory');
const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');
const { Readable } = require('stream');


// Helper function for uploading a single file to Cloudinary
const bufferUpload = (buffer, folder) => {
    return new Promise((resolve, reject) => {
        const readable = new Readable();
        readable.push(buffer);
        readable.push(null);
        readable.pipe(
            cloudinary.uploader.upload_stream(
                { resource_type: "auto", folder: folder },
                (error, result) => {
                    if (error) reject(error);
                    resolve(result);
                }
            )
        );
    });
};

// @desc    Create a new category with an image
// @route   POST /api/categories
// @access  Private/Admin
exports.createCategory = async (req, res) => {
    const { name } = req.body;
    const file = req.file;

    if (!file) {
        return res.status(400).json({ message: 'Category image is required' });
    }
    
    try {
        const result = await bufferUpload(file.buffer, process.env.CLOUDINARY_FOLDER);
        const category = new Category({ name, image: result.secure_url });
        await category.save();
        res.status(201).json(category);
    } catch (error) {
        console.error('Category creation failed:', error);
        res.status(500).json({ message: 'Category creation failed', error });
    }
};



// @desc    Delete a category by ID
// @route   DELETE /api/categories/:id
// @access  Private/Admin
exports.deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        
        const productsCount = await Product.countDocuments({ category: categoryId });
        if (productsCount > 0) {
            return res.status(400).json({ message: 'Cannot delete category with associated products.' });
        }
        
        await Category.findByIdAndDelete(categoryId);
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Failed to delete category:', error);
        res.status(500).json({ message: 'Failed to delete category.', error });
    }
};

exports.getSubCategoryCount = async (req, res) => {
    try {
        const categoryId = req.params.id;
        
        // Count how many subcategories belong to this category
        const count = await SubCategory.countDocuments({ category: categoryId });

        res.json({ count });
    } catch (error) {
        // Handle invalid ID format gracefully
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid Category ID format.' });
        }
        console.error('Error fetching subcategory count:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};


exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// ✅ Get single category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid Category ID format.' });
    }
    console.error('Error fetching category:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// ✅ Count how many subcategories a category has
exports.getSubCategoryCount = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const count = await SubCategory.countDocuments({ category: categoryId });
    res.json({ count });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid Category ID format.' });
    }
    console.error('Error fetching subcategory count:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};