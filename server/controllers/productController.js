// src/controllers/productController.js
const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');
const { Readable } = require('stream');
const SubCategory = require('../models/SubCategory');

 const Category = require('../models/Category');
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


exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({})
        // 1. Populate the 'category' field and grab only the 'name'
        .populate('category', 'name') 
        // 2. Populate the 'subCategory' field and grab only the 'name'
        .populate('subCategory', 'name'); // <--- 🌟 ADD THIS LINE 🌟

    res.json(products);
  } catch (error) {
    console.error('Error in getProducts:', error); // Better error logging
    res.status(500).json({ message: 'Server Error fetching products' });
  }
};


exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    await Product.deleteOne({ _id: product._id });
    res.json({ message: 'Product removed' });
  } catch (error) {
    console.error('Backend Error during product deletion:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};


exports.getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.categoryId });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getProductsBySubCategory = async (req, res) => {
    // 🎯 Use 'subCategoryId' to match the route parameter
    const { subCategoryId } = req.params; 

    try {
        // Query MongoDB for products matching the SubCategory ObjectId
        const products = await Product.find({ subCategory: subCategoryId })
          .populate('category', 'name')
          .populate('subCategory', 'name')
          .exec();

        if (!products || products.length === 0) {
            // Return an empty array if no products are found (Status 200 is fine here)
            return res.status(200).json([]); 
        }

        res.json(products);
    } catch (error) {
        console.error("Error fetching products by subcategory:", error);
        // If the ID format is invalid (e.g., not a valid MongoDB ObjectId format)
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid SubCategory ID format.' });
        }
        res.status(500).json({ message: 'Server Error fetching products.' });
    }
};

exports.getProductsByGender = async (req, res) => {
    try {
        const products = await Product.find({ gender: req.params.gender });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// exports.getRecentProducts = async (req, res) => {
//   const limit = parseInt(req.query.limit, 10) || 20; // Default to 20 products
  
//   // The key change: add .populate('category', 'name')
//   const products = await Product.find({})
//     .sort({ createdAt: -1 }) // Sort by creation date, newest first
//     .limit(limit)
//     .populate('category', 'name') // This populates the category field
//     .exec();

//   res.json(products);
// };
exports.searchProducts = async (req, res) => {
    const { keyword } = req.query;
    if (!keyword) {
        return res.status(400).json({ message: 'Search keyword is required' });
    }

    try {
        const regex = new RegExp(keyword, 'i'); // 'i' for case-insensitive search

        const products = await Product.find({
            $or: [
                { name: { $regex: regex } },
                { brand: { $regex: regex } },
                { subCategory: { $regex: regex } },
                { gender: { $regex: regex } }
            ]
        }).populate('category');

        res.json(products);
    } catch (error) {
        console.error("Error searching products:", error);
        res.status(500).json({ message: error.message });
    }
  };

const mapOptionalField = (value) => {
    // If the value is undefined (not sent) or an empty string, we want it to be null
    // If the field is sent as the string "null" (due to FormData conversion), we also want null
    if (value === undefined || value === '' || value === 'null') {
        return null;
    }
    return value;
}

// @desc   Create a new product
// @route   POST /api/products
// @access Private/Admin
exports.createProduct = async (req, res) => {
  const { name, description, brand, category, gender, subCategory, variants } = req.body;

  if (!category) {
    return res.status(400).json({ message: 'Category is required.' });
  }

  try {
    const fileUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await bufferUpload(file.buffer, process.env.CLOUDINARY_FOLDER);
        fileUrls.push(result.secure_url);
      }
    }

    const product = new Product({
      name,
      description,
      brand,
      category,
      // ✅ FIX: Use helper function to convert '""' or 'null' string to JS null
      gender: mapOptionalField(gender),
      subCategory: mapOptionalField(subCategory), 
      images: fileUrls,
      variants: JSON.parse(variants),
    });

    const createdProduct = await product.save();
    res.status(201).json({
      message: 'Product created successfully',
      product: createdProduct,
    });
  } catch (error) {
    console.error('Backend Error during product creation:', error);
    if (error.name === 'ValidationError') {
        return res.status(400).json({ message: 'Validation failed', errors: error.errors });
    }
    res.status(500).json({ message: 'Failed to create product', error });
  }
};

// @desc   Update a product
// @route   PUT /api/products/:id
// @access Private/Admin
exports.updateProduct = async (req, res) => {
  const { name, description, brand, category, gender, subCategory, variants } = req.body;

  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const fileUrls = req.files && req.files.length > 0 ? [] : product.images;
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await bufferUpload(file.buffer, process.env.CLOUDINARY_FOLDER);
        fileUrls.push(result.secure_url);
      }
    }

    product.name = name !== undefined ? name : product.name;
    product.description = description !== undefined ? description : product.description;
    product.brand = brand !== undefined ? brand : product.brand;
    product.category = category !== undefined ? category : product.category;
    
    // ✅ FIX: Use helper function for updates as well
    if (gender !== undefined) product.gender = mapOptionalField(gender);
    if (subCategory !== undefined) product.subCategory = mapOptionalField(subCategory);

    product.images = fileUrls;
    product.variants = variants ? JSON.parse(variants) : product.variants;

    const updatedProduct = await product.save();
    res.json({
      message: 'Product updated successfully',
      product: updatedProduct,
    });
  } catch (error) {
    console.error('Backend Error during product update:', error);
    res.status(500).json({ message: 'Failed to update product', error });
  }
};

exports.getGenericFeaturedProducts = async (req, res) => {
    try {
        // 1. Find the SubCategory with the name "Featured" (case-insensitive search is safer)
        const featuredSubCategory = await SubCategory.findOne({ 
            name: { $regex: /featured/i } 
        });

        if (!featuredSubCategory) {
            // If the subcategory "Featured" doesn't exist, return an empty array or 404
            return res.json([]); 
        }

        // 2. Use the ID of the found subcategory to filter the products
        const featuredProducts = await Product.find({ subCategory: featuredSubCategory._id })
          .sort({ createdAt: -1 })       // Order as you like
          .limit(8)               // Limit to show a featured set (e.g., 8)
          .populate('category', 'name')
          .populate('subCategory', 'name');

        res.json(featuredProducts);

    } catch (error) {
        console.error('Error fetching generic featured products:', error);
        res.status(500).json({ message: 'Server Error fetching featured products' });
    }
};



exports.getFilteredProducts = async (req, res) => {
  const { category, subCategory, gender, brand, size, minPrice, maxPrice } = req.query;

  try {
    let query = {};

    if (category) {
      query.category = category;
    }
    if (subCategory) {
      query.subCategory = subCategory;
    }
    if (gender) {
      query.gender = gender;
    }
    if (brand) {
      query.brand = brand;
    }
    
    // Note: Filtering by size and price on the backend with Mongoose can be complex
    // as it requires matching elements within a nested array. The current frontend
    // filtering is more efficient for the given data structure. This is just an example
    // of how you might start a backend filter.
    if (minPrice || maxPrice) {
      query['variants.price'] = {};
      if (minPrice) {
        query['variants.price']['$gte'] = Number(minPrice);
      }
      if (maxPrice) {
        query['variants.price']['$lte'] = Number(maxPrice);
      }
    }
    
    // Note: Filtering by size is also tricky. The best approach is to filter
    // products that contain at least one variant with the specified size.
    if (size) {
      query['variants.size'] = size;
    }
    
    const filteredProducts = await Product.find(query)
      .populate('category', 'name')
      .populate('subCategory', 'name');

    res.json(filteredProducts);

  } catch (error) {
    console.error('Error fetching filtered products:', error);
    res.status(500).json({ message: 'Server Error fetching filtered products' });
  }
};



// ✅ Get products by category (with names)
exports.getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.categoryId })
      .populate('category', 'name')
      .populate('subCategory', 'name'); // ✅ added

    res.json(products);
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({ message: 'Server Error fetching category products' });
  }
};

// ✅ Get recent products (with names)
exports.getRecentProducts = async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 20;

  try {
    const products = await Product.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('category', 'name')
      .populate('subCategory', 'name'); // ✅ added

    res.json(products);
  } catch (error) {
    console.error("Error fetching recent products:", error);
    res.status(500).json({ message: 'Server Error fetching recent products' });
  }
};
