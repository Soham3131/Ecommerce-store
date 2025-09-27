const SubCategory = require("../models/SubCategory")
const Product = require('../models/Product'); // Assuming you want to check for associated products before deleting
const cloudinary = require('../config/cloudinary');
const { Readable } = require('stream');

// Reusing your existing helper function for Cloudinary upload
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

// @desc    Create a new subcategory with optional media
// @route   POST /api/subcategories
// @access  Private/Admin
exports.createSubCategory = async (req, res) => {
    const { name, category } = req.body;
    const file = req.file;

    try {
        let mediaUrl = null;
        if (file) {
            // Upload to Cloudinary with resource_type: "auto" to handle images/video/gifs
            const result = await bufferUpload(file.buffer, process.env.CLOUDINARY_FOLDER + '/subcategories');
            mediaUrl = result.secure_url;
        }
        
        const subCategory = new SubCategory({ name, category, mediaUrl });
        await subCategory.save();
        res.status(201).json(subCategory);
    } catch (error) {
        console.error('SubCategory creation failed:', error);
        res.status(500).json({ message: 'SubCategory creation failed', error });
    }
};

// @desc    Get all subcategories (or filtered by category ID)
// @route   GET /api/subcategories?category=...
// @access  Public
exports.getSubCategories = async (req, res) => {
    try {
        const filter = req.query.category ? { category: req.query.category } : {};
        const subCategories = await SubCategory.find(filter).populate('category', 'name');
        res.json(subCategories);
    } catch (error) {
        res.status(500).json({ message: 'Server Error fetching subcategories' });
    }
};

exports.getSubCategoryById = async (req, res) => {
    try {
        // 🎯 Use 'id' as per the route definition
        const subCategory = await SubCategory.findById(req.params.id); 
        if (!subCategory) {
            return res.status(404).json({ message: 'SubCategory not found' });
        }
        res.json(subCategory);
    } catch (error) {
        // Handle invalid ID format error
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid SubCategory ID format.' });
        }
        res.status(500).json({ message: 'Server Error' });
    }
};