const express = require('express');
const router = express.Router();
const subCategoryController = require('../controllers/subCategoryController');
const { protect, admin } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware'); 

// GET subcategories (optionally filtered by category ID)
router.get('/', subCategoryController.getSubCategories);

// POST a new subcategory with optional media upload
// upload.single('media') assumes the frontend sends the file in a field named 'media'
router.post('/', protect, admin, upload.single('media'), subCategoryController.createSubCategory);

router.get('/:id', subCategoryController.getSubCategoryById);


module.exports = router;