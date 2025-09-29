
// // module.exports = mongoose.model('Product', productSchema);

// const mongoose = require('mongoose');

// const productSchema = new mongoose.Schema({
//   productId: { type: Number, unique: true },
//   name: { type: String, required: true },
//   description: { type: String, required: true },
//   images: [{ type: String }],
//   brand: { type: String, required: true },
//   category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },

//   // NEW FIELDS
//   gender: {
//     type: String,
//     enum: ['male', 'female', 'unisex', 'boys', 'girls',null],
//     required: false,
//      default: null
//   },
//   subCategory:{ type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory' },

//   variants: [{
//     size: { type: String, required: true },
//     price: { type: Number, required: true },
//     countInStock: { type: Number, required: true, default: 0 },
//   }],
// }, { timestamps: true });

// // Auto-increment productId
// productSchema.pre('save', async function (next) {
//   if (!this.productId) {
//     const lastProduct = await mongoose.model('Product').findOne().sort({ productId: -1 });
//     this.productId = lastProduct ? lastProduct.productId + 1 : 1;
//   }
//   next();
// });

// module.exports = mongoose.model('Product', productSchema);


// module.exports = mongoose.model('Product', productSchema);

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productId: { type: Number, unique: true },
    name: { type: String, required: true },
    
    // 💡 CHANGE 1: Main description can be a summary/short description
    description: { type: String, required: true }, 

    images: [{ type: String }],
    brand: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },

    // NEW FIELDS FOR RICH PRODUCT PAGE
    // 💡 NEW FIELD 1: Discount
    discountPercentage: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    // 💡 NEW FIELD 2: Bullet points for detailed description
    detailedDescription: {
        type: [String], // Array of strings for bullet points
        default: [],
    },
    // 💡 NEW FIELD 3: Product details/More Information column content
    productDetails: {
        type: String, 
        default: '',
    },
    // 💡 NEW FIELD 4: Size Chart Image URL
    sizeChartImage: {
        type: String, 
        default: null, // Optional field
    },
    
    gender: {
        type: String,
        enum: ['male', 'female', 'unisex', 'boys', 'girls', null],
        required: false,
        default: null
    },
    subCategory:{ type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory' },

    variants: [{
        size: { type: String, required: true },
        // Price should be the *original* price. The discounted price is calculated.
        price: { type: Number, required: true }, 
        countInStock: { type: Number, required: true, default: 0 },
    }],
}, { timestamps: true });

// Auto-increment productId
productSchema.pre('save', async function (next) {
    if (!this.productId) {
        const lastProduct = await mongoose.model('Product').findOne().sort({ productId: -1 });
        this.productId = lastProduct ? lastProduct.productId + 1 : 1;
    }
    next();
});

module.exports = mongoose.model('Product', productSchema);