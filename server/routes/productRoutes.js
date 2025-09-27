// // src/routes/productRoutes.js
// const express = require('express');
// const router = express.Router();
// const productController = require('../controllers/productController');
// const { protect, admin } = require('../middlewares/authMiddleware');
// const upload = require('../middlewares/uploadMiddleware');

// router.get('/recent', productController.getRecentProducts);

// router.get('/gender/:gender', productController.getProductsByGender);
// router.get('/search', productController.searchProducts);
// router.get('/', productController.getProducts);
// router.get('/:id', productController.getProductById);
// router.post('/', protect, admin, upload.array('images', 10), productController.createProduct);
// router.put('/:id', protect, admin, upload.array('images', 10), productController.updateProduct);
// router.delete('/:id', protect, admin, productController.deleteProduct);
// router.get('/category/:categoryId', productController.getProductsByCategory);



// router.get('/subcategory/featured', productController.getGenericFeaturedProducts); 


// // 2. Dynamic route MUST be placed second
// // Maps to: GET /api/products/subcategory/:subCategoryId
// router.get('/subcategory/:subCategoryId', productController.getProductsBySubCategory); 


// module.exports = router;

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, admin } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.get('/recent', productController.getRecentProducts);

router.get('/gender/:gender', productController.getProductsByGender);
router.get('/search', productController.searchProducts);
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.post('/', protect, admin, upload.array('images', 10), productController.createProduct);
router.put('/:id', protect, admin, upload.array('images', 10), productController.updateProduct);
router.delete('/:id', protect, admin, productController.deleteProduct);
router.get('/category/:categoryId', productController.getProductsByCategory);

// 🌟 FIX: The static route for 'featured' must be placed before the dynamic ':subCategoryId' route. 🌟
router.get('/subcategory/featured', productController.getGenericFeaturedProducts); 

// 2. Dynamic route MUST be placed second
// Maps to: GET /api/products/subcategory/:subCategoryId
router.get('/subcategory/:subCategoryId', productController.getProductsBySubCategory); 


module.exports = router;
