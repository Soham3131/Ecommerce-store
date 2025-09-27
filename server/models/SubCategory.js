const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    // Reference to the parent Category
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    // To hold the URL for the image/video/gif (uploaded to Cloudinary)
    mediaUrl: {
        type: String,
        required: false, // Optional if a subcategory doesn't need media
    },
}, { timestamps: true });

module.exports = mongoose.model('SubCategory', subCategorySchema);