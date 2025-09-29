

// import React, { useState, useEffect, useCallback } from 'react';
// import apiClient from '../services/apiClient';

// const ProductManagement = () => {
//     const [products, setProducts] = useState([]);
//     const [categories, setCategories] = useState([]);
//     const [subCategories, setSubCategories] = useState([]); // State for fetching subcategories

//     const [formData, setFormData] = useState({
//         name: '',
//         description: '',
//         brand: '',
//         category: '',
//         gender: '',
//         subCategory: '',
//     });

//     // Category States
//     const [newCategoryName, setNewCategoryName] = useState('');
//     const [newCategoryImage, setNewCategoryImage] = useState(null);
//     const [newCategoryImagePreview, setNewCategoryImagePreview] = useState(null);
//     const [showCategoryForm, setShowCategoryForm] = useState(false);

//     // SubCategory States (New/Updated States)
//     const [newSubCategoryName, setNewSubCategoryName] = useState('');
//     const [newSubCategoryMedia, setNewSubCategoryMedia] = useState(null);
//     const [newSubCategoryMediaPreview, setNewSubCategoryMediaPreview] = useState(null);
//     const [showSubCategoryForm, setShowSubCategoryForm] = useState(false);

//     // Product States
//     const [variants, setVariants] = useState([{ size: '', price: '', countInStock: '' }]);
//     const [images, setImages] = useState([]);
//     const [imagePreviews, setImagePreviews] = useState([]);
//     const [existingImages, setExistingImages] = useState([]);
//     const [editingProduct, setEditingProduct] = useState(null);
//     const [refreshCategories, setRefreshCategories] = useState(false);
//     const [refreshProducts, setRefreshProducts] = useState(false);

//     // --- FETCH FUNCTIONS ---
//     const fetchProducts = useCallback(async () => {
//         try {
//             const response = await apiClient.get('/products');
//             setProducts(response.data);
//         } catch (error) {
//             console.error('Failed to fetch products:', error);
//         }
//     }, []);

//     const fetchCategories = useCallback(async () => {
//         try {
//             const token = localStorage.getItem('token');
//             const response = await apiClient.get('/categories', {
//                 headers: { 'Authorization': `Bearer ${token}` }
//             });
//             setCategories(response.data);
//         } catch (error) {
//             console.error('Failed to fetch categories:', error);
//         }
//     }, []);

//     // NEW: Function to fetch subcategories based on the selected category
//     const fetchSubCategories = useCallback(async (categoryId) => {
//         if (!categoryId) {
//             setSubCategories([]);
//             return;
//         }
//         try {
//             const response = await apiClient.get(`/subcategories?category=${categoryId}`);
//             setSubCategories(response.data);
//         } catch (error) {
//             console.error('Failed to fetch subcategories:', error);
//             setSubCategories([]);
//         }
//     }, []);

//     // --- EFFECTS ---
//     useEffect(() => {
//         fetchProducts();
//         fetchCategories();
//     }, [refreshCategories, refreshProducts, fetchProducts, fetchCategories]);

//     useEffect(() => {
//         // Trigger fetching subcategories when category selection changes
//         fetchSubCategories(formData.category);
        
//         // Optionally reset subCategory if the category is changed to an invalid one
//         if (formData.category && formData.subCategory) {
//              const isSubCategoryValid = subCategories.some(sc => sc._id === formData.subCategory);
//              if (!isSubCategoryValid) {
//                  setFormData(prev => ({ ...prev, subCategory: '' }));
//              }
//         } else if (!formData.category) {
//             // Clear subCategory if parent category is cleared
//             setFormData(prev => ({ ...prev, subCategory: '' }));
//         }
//     }, [formData.category, fetchSubCategories]);

//     // --- HANDLERS ---
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
        
//         // Convert empty string to null for optional ObjectId/String fields (gender/subCategory)
//         let finalValue = value;
//         if ((name === 'gender' || name === 'subCategory') && value === '') {
//             finalValue = null;
//         }

//         setFormData(prev => ({ 
//             ...prev, 
//             [name]: finalValue 
//         }));
//     };

//     const handleImageChange = (e) => {
//         const files = Array.from(e.target.files);
//         setImages(prevImages => [...prevImages, ...files]);
//         const newPreviews = files.map(file => URL.createObjectURL(file));
//         setImagePreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
//     };

//     const handleRemoveImage = (indexToRemove, isExisting) => {
//         if (isExisting) {
//             setExistingImages(existingImages.filter((_, index) => index !== indexToRemove));
//         } else {
//              // Revoke object URL to prevent memory leaks in dev/test environment
//             const urlToRemove = imagePreviews[indexToRemove];
//             URL.revokeObjectURL(urlToRemove);

//             setImages(images.filter((_, index) => index !== indexToRemove));
//             setImagePreviews(imagePreviews.filter((_, index) => index !== indexToRemove));
//         }
//     };

//     const handleVariantChange = (index, e) => {
//         const newVariants = [...variants];
//         newVariants[index][e.target.name] = e.target.value;
//         setVariants(newVariants);
//     };

//     const addVariant = () => setVariants([...variants, { size: '', price: '', countInStock: '' }]);
//     const removeVariant = (index) => {
//         const newVariants = [...variants];
//         newVariants.splice(index, 1);
//         setVariants(newVariants);
//     };

//     const resetForm = () => {
//         setEditingProduct(null);
//         setFormData({ name: '', description: '', brand: '', category: '', gender: '', subCategory: '' });
//         setVariants([{ size: '', price: '', countInStock: '' }]);
        
//         // Cleanup old preview URLs
//         imagePreviews.forEach(URL.revokeObjectURL);

//         setImages([]);
//         setImagePreviews([]);
//         setExistingImages([]);
//         setShowCategoryForm(false);
//         setShowSubCategoryForm(false); // Reset SubCategory form visibility
//         // Optionally reset category and subcategory creation states
//         setNewCategoryName('');
//         setNewSubCategoryName('');
//     };

//     // NEW: SubCategory Creation Handler
//     const handleCreateSubCategory = async () => {
//         try {
//             if (!newSubCategoryName.trim() || !formData.category) return alert("SubCategory name and parent Category are required.");

//             const token = localStorage.getItem("token");
//             const data = new FormData();
//             data.append("name", newSubCategoryName);
//             data.append("category", formData.category); // Parent Category ID
//             if (newSubCategoryMedia) data.append("media", newSubCategoryMedia); // Key must match backend upload.single('media')

//             const res = await apiClient.post("/subcategories", data, {
//                 headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
//             });

//             alert("SubCategory created!");
//             setSubCategories([...subCategories, res.data]); // Add to local state
//             setFormData(prev => ({ ...prev, subCategory: res.data._id })); // Select the new subcategory
//             setShowSubCategoryForm(false);
//             setNewSubCategoryName("");
//             setNewSubCategoryMedia(null);
//             if (newSubCategoryMediaPreview) URL.revokeObjectURL(newSubCategoryMediaPreview); // Cleanup URL
//             setNewSubCategoryMediaPreview(null);
//         } catch (err) {
//             console.error(err);
//             alert("Failed to create subcategory");
//         }
//     };
    
//     // --- CRUD OPERATIONS ---
//     const handleAddProduct = async (e) => {
//         e.preventDefault();
//         const token = localStorage.getItem('token');
//         const data = new FormData();
        
//         // Append all formData fields, converting null to empty string for FormData
//         for (const key in formData) {
//             data.append(key, formData[key] === null ? '' : formData[key]); 
//         }

//         data.append('variants', JSON.stringify(variants));
//         for (const image of images) data.append('images', image);

//         try {
//             await apiClient.post('/products', data, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                     'Authorization': `Bearer ${token}`
//                 },
//             });
//             alert('Product added successfully!');
//             resetForm();
//             setRefreshProducts(prev => !prev);
//         } catch (error) {
//             console.error('Failed to add product:', error);
//             alert('Failed to add product.');
//         }
//     };

//     const handleEditClick = (product) => {
//         setEditingProduct(product);
//         setFormData({
//             name: product.name,
//             description: product.description,
//             brand: product.brand,
//             category: product.category?._id || '', // Handle null/undefined
//             gender: product.gender || '', // Use '' to match select behavior
//             subCategory: product.subCategory?._id || '', // Use '' to match select behavior
//         });
//         setVariants(product.variants);
//         setExistingImages(product.images);
//         setImages([]);
//         setImagePreviews([]);
//         setShowSubCategoryForm(false);
//     };

//     const handleUpdateProduct = async (e) => {
//         e.preventDefault();
//         const token = localStorage.getItem('token');
//         const data = new FormData();
        
//         // Append all formData fields, converting null to empty string for FormData
//         for (const key in formData) {
//             data.append(key, formData[key] === null ? '' : formData[key]);
//         }
        
//         data.append('variants', JSON.stringify(variants));
//         for (const image of images) data.append('newImages', image); // Use newImages key for updates
//         existingImages.forEach(url => data.append('existingImages', url)); // Pass existing images

//         try {
//             await apiClient.put(`/products/${editingProduct._id}`, data, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                     'Authorization': `Bearer ${token}`
//                 },
//             });
//             alert('Product updated successfully!');
//             resetForm();
//             setRefreshProducts(prev => !prev);
//         } catch (error) {
//             console.error('Failed to update product:', error);
//             alert('Failed to update product.');
//         }
//     };

//     const handleDeleteProduct = async (productId) => {
//         if (!window.confirm('Are you sure you want to delete this product?')) return;
//         try {
//             const token = localStorage.getItem('token');
//             // FIX: Correctly call apiClient.delete
//             await apiClient.delete(`/products/${productId}`, { 
//                 headers: { 'Authorization': `Bearer ${token}` },
//             });
//             alert('Product deleted successfully!');
//             setRefreshProducts(prev => !prev);
//         } catch (error) {
//             console.error('Failed to delete product:', error);
//             alert('Failed to delete product.');
//         }
//     };


//     // --- RENDER ---
//     return (
//         <div className="p-6 bg-white shadow-md rounded-lg">
//             <h2 className="text-2xl font-bold mb-4">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
//             <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct} className="space-y-4">
//                 <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Product Name" className="w-full p-2 border rounded-md" required />
//                 <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Description" className="w-full p-2 border rounded-md" required />
//                 <input type="text" name="brand" value={formData.brand} onChange={handleInputChange} placeholder="Brand" className="w-full p-2 border rounded-md" required />

//                 {/* Category Selection and Creation */}
//                 <select
//                     name="category"
//                     value={formData.category}
//                     onChange={(e) => {
//                         if (e.target.value === "new") {
//                             setShowCategoryForm(true);
//                             setFormData({ ...formData, category: "" });
//                         } else {
//                             setShowCategoryForm(false);
//                             handleInputChange(e);
//                         }
//                     }}
//                     className="w-full p-2 border rounded-md"
//                     required
//                 >
//                     <option value="">Select Category</option>
//                     {categories.map(cat => (
//                         <option key={cat._id} value={cat._id}>{cat.name}</option>
//                     ))}
//                     <option value="new">+ Create New Category</option>
//                 </select>

//                 {/* New Category Form (Existing Logic) */}
//                 {showCategoryForm && (
//                     <div className="p-4 border rounded-md bg-gray-50 mt-2">
//                         <h3 className="text-lg font-semibold mb-2">Add New Category</h3>
//                         <input
//                             type="text"
//                             placeholder="Category Name"
//                             value={newCategoryName}
//                             onChange={(e) => setNewCategoryName(e.target.value)}
//                             className="w-full p-2 border rounded-md mb-2"
//                         />
//                         <input
//                             type="file"
//                             accept="image/*"
//                             onChange={(e) => {
//                                 const file = e.target.files[0];
//                                 setNewCategoryImage(file);
//                                 setNewCategoryImagePreview(URL.createObjectURL(file));
//                             }}
//                             className="w-full p-2 border rounded-md mb-2"
//                         />
//                         {newCategoryImagePreview && (
//                             <img src={newCategoryImagePreview} alt="Preview" className="h-20 w-20 object-cover rounded-md mb-2" />
//                         )}
//                         <button
//                             type="button"
//                             onClick={async () => {
//                                 try {
//                                     const token = localStorage.getItem("token");
//                                     const data = new FormData();
//                                     data.append("name", newCategoryName);
//                                     if (newCategoryImage) data.append("image", newCategoryImage);

//                                     const res = await apiClient.post("/categories", data, {
//                                         headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
//                                     });

//                                     alert("Category created!");
//                                     setCategories([...categories, res.data]);
//                                     setFormData({ ...formData, category: res.data._id });
//                                     setShowCategoryForm(false);
//                                     setNewCategoryName("");
//                                     setNewCategoryImage(null);
//                                     if (newCategoryImagePreview) URL.revokeObjectURL(newCategoryImagePreview);
//                                     setNewCategoryImagePreview(null);
//                                 } catch (err) {
//                                     console.error(err);
//                                     alert("Failed to create category");
//                                 }
//                             }}
//                             className="bg-green-600 text-white px-4 py-2 rounded-md"
//                         >
//                             Save Category
//                         </button>
//                     </div>
//                 )}


//                 {/* Gender */}
//                 <select
//                     name="gender"
//                     value={formData.gender || ''}
//                     onChange={handleInputChange}
//                     className="w-full p-2 border rounded-md"
//                 >
//                     <option value="">Select Gender (Optional)</option>
//                     <option value="male">Male</option>
//                     <option value="female">Female</option>
//                     <option value="unisex">Unisex</option>
//                     <option value="boys">Boys</option>
//                     <option value="girls">Girls</option>
//                 </select>

//                 {/* SubCategory Selection and Creation (NEW LOGIC) */}
//                 <select
//                     name="subCategory"
//                     value={formData.subCategory || ""}
//                     onChange={(e) => {
//                         if (e.target.value === "new") {
//                             setShowSubCategoryForm(true);
//                             setFormData({ ...formData, subCategory: "" });
//                         } else {
//                             setShowSubCategoryForm(false);
//                             handleInputChange(e);
//                         }
//                     }}
//                     className="w-full p-2 border rounded-md"
//                     // Disable if no category is selected
//                     disabled={!formData.category || showCategoryForm}
//                 >
//                     <option value="">Select SubCategory (Optional)</option>
//                     {subCategories.map(subCat => (
//                         <option key={subCat._id} value={subCat._id}>{subCat.name}</option>
//                     ))}
//                     {/* Only allow creating a new subcategory if a parent category is selected */}
//                     {formData.category && <option value="new">+ Create New SubCategory</option>}
//                 </select>

//                 {/* New SubCategory Form */}
//                 {showSubCategoryForm && formData.category && (
//                     <div className="p-4 border rounded-md bg-gray-50 mt-2">
//                         <h3 className="text-lg font-semibold mb-2">Add New SubCategory for: {categories.find(c => c._id === formData.category)?.name}</h3>
//                         <input
//                             type="text"
//                             placeholder="SubCategory Name"
//                             value={newSubCategoryName}
//                             onChange={(e) => setNewSubCategoryName(e.target.value)}
//                             className="w-full p-2 border rounded-md mb-2"
//                         />
//                         {/* Input for image/video/gif */}
//                         <input
//                             type="file"
//                             accept="image/*,video/*,.gif" // Accept common media types
//                             onChange={(e) => {
//                                 const file = e.target.files[0];
//                                 setNewSubCategoryMedia(file);
//                                 setNewSubCategoryMediaPreview(URL.createObjectURL(file));
//                             }}
//                             className="w-full p-2 border rounded-md mb-2"
//                         />
//                         {newSubCategoryMediaPreview && (
//                             // Simple display for media preview
//                             <img
//                                 src={newSubCategoryMediaPreview}
//                                 alt="Media Preview"
//                                 className="h-20 w-20 object-cover rounded-md mb-2"
//                             />
//                         )}
//                         <button
//                             type="button"
//                             onClick={handleCreateSubCategory}
//                             className="bg-green-600 text-white px-4 py-2 rounded-md"
//                             disabled={!newSubCategoryName.trim()}
//                         >
//                             Save SubCategory
//                         </button>
//                     </div>
//                 )}


//                 {/* Variants */}
//                 <h3 className="text-lg font-semibold">Product Variants</h3>
//                 {variants.map((variant, index) => (
//                     <div key={index} className="flex space-x-2">
//                         <input type="text" name="size" value={variant.size} onChange={(e) => handleVariantChange(index, e)} placeholder="Size" className="w-full p-2 border rounded-md" required />
//                         <input type="number" name="price" value={variant.price} onChange={(e) => handleVariantChange(index, e)} placeholder="Price" className="w-full p-2 border rounded-md" required />
//                         <input type="number" name="countInStock" value={variant.countInStock} onChange={(e) => handleVariantChange(index, e)} placeholder="Inventory" className="w-full p-2 border rounded-md" required />
//                         <button type="button" onClick={() => removeVariant(index)} className="bg-red-500 text-white p-2 rounded-md">-</button>
//                     </div>
//                 ))}
//                 <button type="button" onClick={addVariant} className="bg-gray-200 text-gray-800 p-2 rounded-md">Add Variant</button>

//                 {/* Images */}
//                 <h3 className="text-lg font-semibold">Product Images</h3>
//                 <input type="file" name="images" multiple onChange={handleImageChange} className="w-full p-2 border rounded-md" />
//                 <div className="flex flex-wrap space-x-2 mt-2">
//                     {existingImages.map((url, idx) => (
//                         <div key={`ex-${idx}`} className="relative">
//                             <img src={url} alt="" className="h-24 w-24 object-cover rounded-md" />
//                             <button type="button" onClick={() => handleRemoveImage(idx, true)} className="absolute top-0 right-0 bg-red-600 text-white rounded-full h-6 w-6">&times;</button>
//                         </div>
//                     ))}
//                     {imagePreviews.map((preview, idx) => (
//                         <div key={`new-${idx}`} className="relative">
//                             <img src={preview} alt="" className="h-24 w-24 object-cover rounded-md" />
//                             <button type="button" onClick={() => handleRemoveImage(idx, false)} className="absolute top-0 right-0 bg-red-600 text-white rounded-full h-6 w-6">&times;</button>
//                         </div>
//                     ))}
//                 </div>

//                 <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-md">
//                     {editingProduct ? 'Update Product' : 'Add Product'}
//                 </button>
//                 {editingProduct && (
//                     <button type="button" onClick={resetForm} className="w-full bg-gray-400 text-white p-2 rounded-md">Cancel</button>
//                 )}
//             </form>

//             {/* Existing Products */}
//             <h2 className="text-2xl font-bold mt-8 mb-4">Existing Products</h2>
//             <div className="space-y-4">
//                 {products.map(product => (
//                     <div key={product._id} className="flex justify-between items-center p-4 bg-gray-100 rounded-md">
//                         <div className="flex items-center space-x-4">
//                             <img src={product.images[0]} alt={product.name} className="w-16 h-16 object-cover rounded-md" />
//                             <div>
//                                 <span className="font-semibold">{product.name} - {product.brand}</span>
//                                 {/* Use optional chaining for safe access */}
//                                 <p className="text-sm text-gray-600">Category: {product.category?.name || 'N/A'}</p> 
//                                 <p className="text-sm text-gray-600">SubCategory: {product.subCategory?.name || 'N/A'}</p> 
//                                 <p className="text-sm text-gray-600">Gender: {product.gender || 'N/A'}</p>
//                                 <p className="text-sm text-gray-600">Variants: {product.variants.map(v => `${v.size}(₹${v.price})`).join(', ')}</p>
//                             </div>
//                         </div>
//                         <div className="flex space-x-2">
//                             <button onClick={() => handleEditClick(product)} className="bg-yellow-500 text-white px-4 py-2 rounded-md">Edit</button>
//                             <button onClick={() => handleDeleteProduct(product._id)} className="bg-red-600 text-white px-4 py-2 rounded-md">Delete</button>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default ProductManagement;

// import React, { useState, useEffect, useCallback } from 'react';
// import apiClient from '../services/apiClient';

// const ProductManagement = () => {
//     const [products, setProducts] = useState([]);
//     const [categories, setCategories] = useState([]);
//     const [subCategories, setSubCategories] = useState([]); // State for fetching subcategories

//     // 💡 UPDATED: Added new optional fields to formData
//     const [formData, setFormData] = useState({
//         name: '',
//         description: '', // Short description
//         brand: '',
//         category: '',
//         gender: '',
//         subCategory: '',
//         discountPercentage: 0, // NEW: Discount
//         detailedDescription: '', // NEW: Comma-separated string for bullet points
//         productDetails: '', // NEW: More Information column content
//     });

//     // Category States
//     const [newCategoryName, setNewCategoryName] = useState('');
//     const [newCategoryImage, setNewCategoryImage] = useState(null);
//     const [newCategoryImagePreview, setNewCategoryImagePreview] = useState(null);
//     const [showCategoryForm, setShowCategoryForm] = useState(false);

//     // SubCategory States (New/Updated States)
//     const [newSubCategoryName, setNewSubCategoryName] = useState('');
//     const [newSubCategoryMedia, setNewSubCategoryMedia] = useState(null);
//     const [newSubCategoryMediaPreview, setNewSubCategoryMediaPreview] = useState(null);
//     const [showSubCategoryForm, setShowSubCategoryForm] = useState(false);

//     // Product States
//     const [variants, setVariants] = useState([{ size: '', price: '', countInStock: '' }]);
//     const [images, setImages] = useState([]);
//     const [imagePreviews, setImagePreviews] = useState([]);
//     const [existingImages, setExistingImages] = useState([]);
//     const [editingProduct, setEditingProduct] = useState(null);
//     const [refreshCategories, setRefreshCategories] = useState(false);
//     const [refreshProducts, setRefreshProducts] = useState(false);
    
//     // 💡 NEW STATES for Size Chart Image
//     const [sizeChartImage, setSizeChartImage] = useState(null);
//     const [sizeChartPreview, setSizeChartPreview] = useState(null);
//     const [existingSizeChartImage, setExistingSizeChartImage] = useState(null);

//     // 💡 NEW STATES for Collapsible Sections (The '+ icon' click functionality)
//     const [showDiscountSection, setShowDiscountSection] = useState(false);
//     const [showSizeChartSection, setShowSizeChartSection] = useState(false);
//     const [showDetailsSection, setShowDetailsSection] = useState(false);

//     // --- FETCH FUNCTIONS (UNCHANGED) ---
//     const fetchProducts = useCallback(async () => {
//         try {
//             const response = await apiClient.get('/products');
//             setProducts(response.data);
//         } catch (error) {
//             console.error('Failed to fetch products:', error);
//         }
//     }, []);

//     const fetchCategories = useCallback(async () => {
//         try {
//             const token = localStorage.getItem('token');
//             const response = await apiClient.get('/categories', {
//                 headers: { 'Authorization': `Bearer ${token}` }
//             });
//             setCategories(response.data);
//         } catch (error) {
//             console.error('Failed to fetch categories:', error);
//         }
//     }, []);

//     // NEW: Function to fetch subcategories based on the selected category
//     const fetchSubCategories = useCallback(async (categoryId) => {
//         if (!categoryId) {
//             setSubCategories([]);
//             return;
//         }
//         try {
//             const response = await apiClient.get(`/subcategories?category=${categoryId}`);
//             setSubCategories(response.data);
//         } catch (error) {
//             console.error('Failed to fetch subcategories:', error);
//             setSubCategories([]);
//         }
//     }, []);

//     // --- EFFECTS (UNCHANGED) ---
//     useEffect(() => {
//         fetchProducts();
//         fetchCategories();
//     }, [refreshCategories, refreshProducts, fetchProducts, fetchCategories]);

//     useEffect(() => {
//         // Trigger fetching subcategories when category selection changes
//         fetchSubCategories(formData.category);
        
//         // Optionally reset subCategory if the category is changed to an invalid one
//         if (formData.category && formData.subCategory) {
//              const isSubCategoryValid = subCategories.some(sc => sc._id === formData.subCategory);
//              if (!isSubCategoryValid) {
//                  setFormData(prev => ({ ...prev, subCategory: '' }));
//              }
//         } else if (!formData.category) {
//             // Clear subCategory if parent category is cleared
//             setFormData(prev => ({ ...prev, subCategory: '' }));
//         }
//     }, [formData.category, fetchSubCategories]);

//     // --- HANDLERS ---
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
        
//         // Convert empty string to null for optional ObjectId/String fields (gender/subCategory)
//         let finalValue = value;
//         if ((name === 'gender' || name === 'subCategory') && value === '') {
//             finalValue = null;
//         }
        
//         // 💡 NEW: Ensure discount is treated as a number
//         if (name === 'discountPercentage') {
//              finalValue = Number(value);
//         }

//         setFormData(prev => ({ 
//             ...prev, 
//             [name]: finalValue 
//         }));
//     };

//     const handleImageChange = (e) => {
//         const files = Array.from(e.target.files);
//         setImages(prevImages => [...prevImages, ...files]);
//         const newPreviews = files.map(file => URL.createObjectURL(file));
//         setImagePreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
//     };

//     const handleRemoveImage = (indexToRemove, isExisting) => {
//         if (isExisting) {
//             setExistingImages(existingImages.filter((_, index) => index !== indexToRemove));
//         } else {
//              // Revoke object URL to prevent memory leaks in dev/test environment
//              const urlToRemove = imagePreviews[indexToRemove];
//              URL.revokeObjectURL(urlToRemove);

//              setImages(images.filter((_, index) => index !== indexToRemove));
//              setImagePreviews(imagePreviews.filter((_, index) => index !== indexToRemove));
//         }
//     };

//     const handleVariantChange = (index, e) => {
//         const newVariants = [...variants];
//         newVariants[index][e.target.name] = e.target.value;
//         setVariants(newVariants);
//     };

//     const addVariant = () => setVariants([...variants, { size: '', price: '', countInStock: '' }]);
//     const removeVariant = (index) => {
//         const newVariants = [...variants];
//         newVariants.splice(index, 1);
//         setVariants(newVariants);
//     };

//     // 💡 NEW: Size Chart Handlers
//     const handleSizeChartChange = (e) => {
//         const file = e.target.files[0];
//         setSizeChartImage(file);
//         if (sizeChartPreview) URL.revokeObjectURL(sizeChartPreview);
//         if (file) setSizeChartPreview(URL.createObjectURL(file));
//         setExistingSizeChartImage(null); // Clear existing if a new file is uploaded
//     };

//     const handleRemoveSizeChart = () => {
//         setExistingSizeChartImage(null);
//         setSizeChartImage(null);
//         if (sizeChartPreview) URL.revokeObjectURL(sizeChartPreview);
//         setSizeChartPreview(null);
//         setShowSizeChartSection(false); // Close section on removal
//     };


//     const resetForm = () => {
//         setEditingProduct(null);
//         setFormData({ 
//             name: '', 
//             description: '', 
//             brand: '', 
//             category: '', 
//             gender: '', 
//             subCategory: '',
//             // 💡 Reset new fields
//             discountPercentage: 0,
//             detailedDescription: '',
//             productDetails: '',
//         });
//         setVariants([{ size: '', price: '', countInStock: '' }]);
        
//         // Cleanup old preview URLs
//         imagePreviews.forEach(URL.revokeObjectURL);
//         if (sizeChartPreview) URL.revokeObjectURL(sizeChartPreview); // Clean up size chart preview

//         setImages([]);
//         setImagePreviews([]);
//         setExistingImages([]);
        
//         // 💡 Reset size chart specific states
//         setSizeChartImage(null);
//         setExistingSizeChartImage(null);
//         setSizeChartPreview(null);
        
//         setShowCategoryForm(false);
//         setShowSubCategoryForm(false);
//         // 💡 Reset section visibility
//         setShowDiscountSection(false);
//         setShowSizeChartSection(false);
//         setShowDetailsSection(false);

//         // Optionally reset category and subcategory creation states
//         setNewCategoryName('');
//         setNewSubCategoryName('');
//     };

//     // NEW: SubCategory Creation Handler (UNCHANGED)
//     const handleCreateSubCategory = async () => {
//         try {
//             if (!newSubCategoryName.trim() || !formData.category) return alert("SubCategory name and parent Category are required.");

//             const token = localStorage.getItem("token");
//             const data = new FormData();
//             data.append("name", newSubCategoryName);
//             data.append("category", formData.category); // Parent Category ID
//             if (newSubCategoryMedia) data.append("media", newSubCategoryMedia); // Key must match backend upload.single('media')

//             const res = await apiClient.post("/subcategories", data, {
//                 headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
//             });

//             alert("SubCategory created!");
//             setSubCategories([...subCategories, res.data]); // Add to local state
//             setFormData(prev => ({ ...prev, subCategory: res.data._id })); // Select the new subcategory
//             setShowSubCategoryForm(false);
//             setNewSubCategoryName("");
//             setNewSubCategoryMedia(null);
//             if (newSubCategoryMediaPreview) URL.revokeObjectURL(newSubCategoryMediaPreview); // Cleanup URL
//             setNewSubCategoryMediaPreview(null);
//         } catch (err) {
//             console.error(err);
//             alert("Failed to create subcategory");
//         }
//     };
    
//     // 💡 NEW: Helper function to build FormData for Create/Update
//     const buildFormData = (isUpdate = false) => {
//         const data = new FormData();
        
//         // Append all formData fields
//         for (const key in formData) {
//             data.append(key, formData[key] === null ? '' : formData[key]); 
//         }

//         data.append('variants', JSON.stringify(variants));

//         // Append main images
//         for (const image of images) data.append('images', image);
        
//         // Append existing image URLs for update
//         if (isUpdate) {
//             existingImages.forEach(url => data.append('existingImages', url));
//         }

//         // 💡 Append Size Chart Image
//         if (sizeChartImage) {
//             data.append('sizeChartImage', sizeChartImage);
//         }
        
//         // 💡 Append existing size chart image URL for update
//         if (isUpdate) {
//             // Send existing URL or 'null' string if it was removed
//             data.append('existingSizeChartImage', existingSizeChartImage || 'null'); 
//         }

//         return data;
//     }

//     // --- CRUD OPERATIONS ---
//     const handleAddProduct = async (e) => {
//         e.preventDefault();
//         const data = buildFormData(false);
//         const token = localStorage.getItem('token');
        
//         try {
//             // Note: I'm keeping the original 'images' key for create based on your previous controller logic.
//             // The backend update logic was modified to handle 'images' (new images) and 'existingImages'.
//             await apiClient.post('/products', data, { 
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                     'Authorization': `Bearer ${token}`
//                 },
//             });
//             alert('Product added successfully!');
//             resetForm();
//             setRefreshProducts(prev => !prev);
//         } catch (error) {
//             console.error('Failed to add product:', error);
//             alert('Failed to add product. Check console for details.');
//         }
//     };

//     const handleEditClick = (product) => {
//         setEditingProduct(product);
//         setFormData({
//             name: product.name,
//             description: product.description,
//             brand: product.brand,
//             category: product.category?._id || '', 
//             gender: product.gender || '', 
//             subCategory: product.subCategory?._id || '', 
//             // 💡 Populate NEW FIELDS for Edit
//             discountPercentage: product.discountPercentage || 0,
//             // Convert array of strings back to comma-separated string for input display
//             detailedDescription: Array.isArray(product.detailedDescription) ? product.detailedDescription.join(', ') : '', 
//             productDetails: product.productDetails || '',
//         });
//         setVariants(product.variants);
//         setExistingImages(product.images);
//         setImages([]);
//         setImagePreviews([]);
        
//         // 💡 Populate Size Chart states for Edit
//         setExistingSizeChartImage(product.sizeChartImage || null);
//         setSizeChartImage(null);
//         setSizeChartPreview(null);

//         setShowSubCategoryForm(false);
        
//         // 💡 Set initial section visibility based on existing data
//         setShowDiscountSection(product.discountPercentage > 0);
//         setShowSizeChartSection(!!product.sizeChartImage);
//         setShowDetailsSection(!!product.detailedDescription.length || !!product.productDetails);
//     };

//     const handleUpdateProduct = async (e) => {
//         e.preventDefault();
//         const data = buildFormData(true); // Pass true to trigger update logic
//         const token = localStorage.getItem('token');

//         try {
//             await apiClient.put(`/products/${editingProduct._id}`, data, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                     'Authorization': `Bearer ${token}`
//                 },
//             });
//             alert('Product updated successfully!');
//             resetForm();
//             setRefreshProducts(prev => !prev);
//         } catch (error) {
//             console.error('Failed to update product:', error);
//             alert('Failed to update product. Check console for details.');
//         }
//     };

//     const handleDeleteProduct = async (productId) => {
//         if (!window.confirm('Are you sure you want to delete this product?')) return;
//         try {
//             const token = localStorage.getItem('token');
//             // FIX: Correctly call apiClient.delete
//             await apiClient.delete(`/products/${productId}`, { 
//                 headers: { 'Authorization': `Bearer ${token}` },
//             });
//             alert('Product deleted successfully!');
//             setRefreshProducts(prev => !prev);
//         } catch (error) {
//             console.error('Failed to delete product:', error);
//             alert('Failed to delete product.');
//         }
//     };


//     // --- RENDER ---
//     return (
//         <div className="p-6 bg-white shadow-md rounded-lg">
//             <h2 className="text-2xl font-bold mb-4">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
//             <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct} className="space-y-4">
//                 <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Product Name" className="w-full p-2 border rounded-md" required />
//                 <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Short Description/Summary" className="w-full p-2 border rounded-md" required />
//                 <input type="text" name="brand" value={formData.brand} onChange={handleInputChange} placeholder="Brand" className="w-full p-2 border rounded-md" required />

//                 {/* Category Selection and Creation */}
//                 <select
//                     name="category"
//                     value={formData.category}
//                     onChange={(e) => {
//                         if (e.target.value === "new") {
//                             setShowCategoryForm(true);
//                             setFormData({ ...formData, category: "" });
//                         } else {
//                             setShowCategoryForm(false);
//                             handleInputChange(e);
//                         }
//                     }}
//                     className="w-full p-2 border rounded-md"
//                     required
//                 >
//                     <option value="">Select Category</option>
//                     {categories.map(cat => (
//                         <option key={cat._id} value={cat._id}>{cat.name}</option>
//                     ))}
//                     <option value="new">+ Create New Category</option>
//                 </select>

//                 {/* New Category Form (Existing Logic) */}
//                 {showCategoryForm && (
//                     <div className="p-4 border rounded-md bg-gray-50 mt-2">
//                         <h3 className="text-lg font-semibold mb-2">Add New Category</h3>
//                         <input
//                             type="text"
//                             placeholder="Category Name"
//                             value={newCategoryName}
//                             onChange={(e) => setNewCategoryName(e.target.value)}
//                             className="w-full p-2 border rounded-md mb-2"
//                         />
//                         <input
//                             type="file"
//                             accept="image/*"
//                             onChange={(e) => {
//                                 const file = e.target.files[0];
//                                 setNewCategoryImage(file);
//                                 setNewCategoryImagePreview(URL.createObjectURL(file));
//                             }}
//                             className="w-full p-2 border rounded-md mb-2"
//                         />
//                         {newCategoryImagePreview && (
//                             <img src={newCategoryImagePreview} alt="Preview" className="h-20 w-20 object-cover rounded-md mb-2" />
//                         )}
//                         <button
//                             type="button"
//                             onClick={async () => {
//                                 try {
//                                     const token = localStorage.getItem("token");
//                                     const data = new FormData();
//                                     data.append("name", newCategoryName);
//                                     if (newCategoryImage) data.append("image", newCategoryImage);

//                                     const res = await apiClient.post("/categories", data, {
//                                         headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
//                                     });

//                                     alert("Category created!");
//                                     setCategories([...categories, res.data]);
//                                     setFormData({ ...formData, category: res.data._id });
//                                     setShowCategoryForm(false);
//                                     setNewCategoryName("");
//                                     setNewCategoryImage(null);
//                                     if (newCategoryImagePreview) URL.revokeObjectURL(newCategoryImagePreview);
//                                     setNewCategoryImagePreview(null);
//                                 } catch (err) {
//                                     console.error(err);
//                                     alert("Failed to create category");
//                                 }
//                             }}
//                             className="bg-green-600 text-white px-4 py-2 rounded-md"
//                         >
//                             Save Category
//                         </button>
//                     </div>
//                 )}


//                 {/* Gender */}
//                 <select
//                     name="gender"
//                     value={formData.gender || ''}
//                     onChange={handleInputChange}
//                     className="w-full p-2 border rounded-md"
//                 >
//                     <option value="">Select Gender (Optional)</option>
//                     <option value="male">Male</option>
//                     <option value="female">Female</option>
//                     <option value="unisex">Unisex</option>
//                     <option value="boys">Boys</option>
//                     <option value="girls">Girls</option>
//                 </select>

//                 {/* SubCategory Selection and Creation (NEW LOGIC) */}
//                 <select
//                     name="subCategory"
//                     value={formData.subCategory || ""}
//                     onChange={(e) => {
//                         if (e.target.value === "new") {
//                             setShowSubCategoryForm(true);
//                             setFormData({ ...formData, subCategory: "" });
//                         } else {
//                             setShowSubCategoryForm(false);
//                             handleInputChange(e);
//                         }
//                     }}
//                     className="w-full p-2 border rounded-md"
//                     // Disable if no category is selected
//                     disabled={!formData.category || showCategoryForm}
//                 >
//                     <option value="">Select SubCategory (Optional)</option>
//                     {subCategories.map(subCat => (
//                         <option key={subCat._id} value={subCat._id}>{subCat.name}</option>
//                     ))}
//                     {/* Only allow creating a new subcategory if a parent category is selected */}
//                     {formData.category && <option value="new">+ Create New SubCategory</option>}
//                 </select>

//                 {/* New SubCategory Form */}
//                 {showSubCategoryForm && formData.category && (
//                     <div className="p-4 border rounded-md bg-gray-50 mt-2">
//                         <h3 className="text-lg font-semibold mb-2">Add New SubCategory for: {categories.find(c => c._id === formData.category)?.name}</h3>
//                         <input
//                             type="text"
//                             placeholder="SubCategory Name"
//                             value={newSubCategoryName}
//                             onChange={(e) => setNewSubCategoryName(e.target.value)}
//                             className="w-full p-2 border rounded-md mb-2"
//                         />
//                         {/* Input for image/video/gif */}
//                         <input
//                             type="file"
//                             accept="image/*,video/*,.gif" // Accept common media types
//                             onChange={(e) => {
//                                 const file = e.target.files[0];
//                                 setNewSubCategoryMedia(file);
//                                 setNewSubCategoryMediaPreview(URL.createObjectURL(file));
//                             }}
//                             className="w-full p-2 border rounded-md mb-2"
//                         />
//                         {newSubCategoryMediaPreview && (
//                             // Simple display for media preview
//                             <img
//                                 src={newSubCategoryMediaPreview}
//                                 alt="Media Preview"
//                                 className="h-20 w-20 object-cover rounded-md mb-2"
//                             />
//                         )}
//                         <button
//                             type="button"
//                             onClick={handleCreateSubCategory}
//                             className="bg-green-600 text-white px-4 py-2 rounded-md"
//                             disabled={!newSubCategoryName.trim()}
//                         >
//                             Save SubCategory
//                         </button>
//                     </div>
//                 )}

//                 {/* 💡 NEW COLLAPSIBLE SECTION: Discounted Price Option */}
//                 <div className="border p-4 rounded-md">
//                     <button type="button" onClick={() => setShowDiscountSection(prev => !prev)} className="font-semibold text-blue-600 flex items-center">
//                         {showDiscountSection ? '➖' : '➕'} Discount Percentage (Optional)
//                     </button>
//                     {showDiscountSection && (
//                         <div className="mt-2 space-y-2">
//                             <label className="block text-sm font-medium text-gray-700">Discount Percentage</label>
//                             <input 
//                                 type="number" 
//                                 name="discountPercentage" 
//                                 value={formData.discountPercentage} 
//                                 onChange={handleInputChange} 
//                                 placeholder="e.g., 10 (for 10% off)" 
//                                 min="0" 
//                                 max="100" 
//                                 className="w-full p-2 border rounded-md" 
//                             />
//                             <p className="text-xs text-gray-500">This percentage will apply to all variant prices.</p>
//                         </div>
//                     )}
//                 </div>

//                 {/* 💡 NEW COLLAPSIBLE SECTION: Detailed Description & Product Details */}
//                 <div className="border p-4 rounded-md">
//                     <button type="button" onClick={() => setShowDetailsSection(prev => !prev)} className="font-semibold text-blue-600 flex items-center">
//                         {showDetailsSection ? '➖' : '➕'} Detailed Description & Specs
//                     </button>
//                     {showDetailsSection && (
//                         <div className="mt-2 space-y-4">
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700">Description Bullet Points (separate with commas)</label>
//                                 <textarea 
//                                     name="detailedDescription" 
//                                     value={formData.detailedDescription} 
//                                     onChange={handleInputChange} 
//                                     placeholder="Feature 1, Feature 2, Feature 3..." 
//                                     className="w-full p-2 border rounded-md" 
//                                 />
//                                 <p className="text-xs text-gray-500">Enter each bullet point separated by a comma (e.g., *Soft Cotton*, *Machine Washable*).</p>
//                             </div>
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700">Product Details / More Information</label>
//                                 <textarea 
//                                     name="productDetails" 
//                                     value={formData.productDetails} 
//                                     onChange={handleInputChange} 
//                                     placeholder="Material: 100% Cotton. Country of Origin: India. Wash Care: Machine wash cold." 
//                                     className="w-full p-2 border rounded-md" 
//                                 />
//                             </div>
//                         </div>
//                     )}
//                 </div>

//                 {/* 💡 NEW COLLAPSIBLE SECTION: Size Chart Image */}
//                 <div className="border p-4 rounded-md">
//                     <button type="button" onClick={() => setShowSizeChartSection(prev => !prev)} className="font-semibold text-blue-600 flex items-center">
//                         {showSizeChartSection ? '➖' : '➕'} Size Chart Image (Optional)
//                     </button>
//                     {showSizeChartSection && (
//                         <div className="mt-2 space-y-2">
//                             <label className="block text-sm font-medium text-gray-700">Upload Size Chart Image</label>
//                             <input 
//                                 type="file" 
//                                 name="sizeChartImage" 
//                                 accept="image/*"
//                                 onChange={handleSizeChartChange} 
//                                 className="w-full p-2 border rounded-md" 
//                             />
//                             {(sizeChartPreview || existingSizeChartImage) && (
//                                 <div className="relative inline-block mt-2">
//                                     <img 
//                                         src={sizeChartPreview || existingSizeChartImage} 
//                                         alt="Size Chart Preview" 
//                                         className="h-32 w-32 object-contain border rounded-md" 
//                                     />
//                                     <button 
//                                         type="button" 
//                                         onClick={handleRemoveSizeChart} 
//                                         className="absolute top-0 right-0 bg-red-600 text-white rounded-full h-6 w-6 text-sm flex items-center justify-center p-1"
//                                     >
//                                         &times;
//                                     </button>
//                                 </div>
//                             )}
//                         </div>
//                     )}
//                 </div>


//                 {/* Variants */}
//                 <h3 className="text-lg font-semibold">Product Variants</h3>
//                 {variants.map((variant, index) => (
//                     <div key={index} className="flex space-x-2">
//                         <input type="text" name="size" value={variant.size} onChange={(e) => handleVariantChange(index, e)} placeholder="Size" className="w-full p-2 border rounded-md" required />
//                         <input type="number" name="price" value={variant.price} onChange={(e) => handleVariantChange(index, e)} placeholder="Price" className="w-full p-2 border rounded-md" required />
//                         <input type="number" name="countInStock" value={variant.countInStock} onChange={(e) => handleVariantChange(index, e)} placeholder="Inventory" className="w-full p-2 border rounded-md" required />
//                         <button type="button" onClick={() => removeVariant(index)} className="bg-red-500 text-white p-2 rounded-md">Remove</button>
//                     </div>
//                 ))}
//                 <button type="button" onClick={addVariant} className="bg-gray-200 text-gray-800 p-2 rounded-md">Add Variant</button>

//                 {/* Images */}
//                 <h3 className="text-lg font-semibold">Product Images</h3>
//                 <input type="file" name="images" multiple onChange={handleImageChange} className="w-full p-2 border rounded-md" />
//                 <div className="flex flex-wrap space-x-2 mt-2">
//                     {existingImages.map((url, idx) => (
//                         <div key={`ex-${idx}`} className="relative">
//                             <img src={url} alt="" className="h-24 w-24 object-cover rounded-md" />
//                             <button type="button" onClick={() => handleRemoveImage(idx, true)} className="absolute top-0 right-0 bg-red-600 text-white rounded-full h-6 w-6">&times;</button>
//                         </div>
//                     ))}
//                     {imagePreviews.map((preview, idx) => (
//                         <div key={`new-${idx}`} className="relative">
//                             <img src={preview} alt="" className="h-24 w-24 object-cover rounded-md" />
//                             <button type="button" onClick={() => handleRemoveImage(idx, false)} className="absolute top-0 right-0 bg-red-600 text-white rounded-full h-6 w-6">&times;</button>
//                         </div>
//                     ))}
//                 </div>

//                 <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-md">
//                     {editingProduct ? 'Update Product' : 'Add Product'}
//                 </button>
//                 {editingProduct && (
//                     <button type="button" onClick={resetForm} className="w-full bg-gray-400 text-white p-2 rounded-md">Cancel</button>
//                 )}
//             </form>

//             {/* Existing Products */}
//             <h2 className="text-2xl font-bold mt-8 mb-4">Existing Products</h2>
//             <div className="space-y-4">
//                 {products.map(product => (
//                     <div key={product._id} className="flex justify-between items-center p-4 bg-gray-100 rounded-md">
//                         <div className="flex items-center space-x-4">
//                             <img src={product.images[0]} alt={product.name} className="w-16 h-16 object-cover rounded-md" />
//                             <div>
//                                 <span className="font-semibold">{product.name} - {product.brand}</span>
//                                 {/* Use optional chaining for safe access */}
//                                 <p className="text-sm text-gray-600">Category: {product.category?.name || 'N/A'}</p> 
//                                 <p className="text-sm text-gray-600">SubCategory: {product.subCategory?.name || 'N/A'}</p> 
//                                 <p className="text-sm text-gray-600">Gender: {product.gender || 'N/A'}</p>
                                
//                                 {/* 💡 New Display Fields */}
//                                 <p className="text-sm text-green-700 font-medium">Discount: {product.discountPercentage || 0}%</p>
//                                 <p className="text-sm text-gray-600">Details: {product.detailedDescription?.length || 0} bullets | Size Chart: {product.sizeChartImage ? 'Yes' : 'No'}</p>

//                                 <p className="text-sm text-gray-600">Variants: {product.variants.map(v => `${v.size}(₹${v.price})`).join(', ')}</p>
//                             </div>
//                         </div>
//                         <div className="flex space-x-2">
//                             <button onClick={() => handleEditClick(product)} className="bg-yellow-500 text-white px-4 py-2 rounded-md">Edit</button>
//                             <button onClick={() => handleDeleteProduct(product._id)} className="bg-red-600 text-white px-4 py-2 rounded-md">Delete</button>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default ProductManagement;


import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '../services/apiClient';

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]); // State for fetching subcategories

    // 💡 UPDATED: Added new optional fields to formData
    const [formData, setFormData] = useState({
        name: '',
        description: '', // Short description
        brand: '',
        category: '',
        gender: '',
        subCategory: '',
        discountPercentage: 0, // NEW: Discount
        detailedDescription: '', // NEW: Comma-separated string for bullet points
        productDetails: '', // NEW: More Information column content
    });

    // Category States
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryImage, setNewCategoryImage] = useState(null);
    const [newCategoryImagePreview, setNewCategoryImagePreview] = useState(null);
    const [showCategoryForm, setShowCategoryForm] = useState(false);

    // SubCategory States (New/Updated States)
    const [newSubCategoryName, setNewSubCategoryName] = useState('');
    const [newSubCategoryMedia, setNewSubCategoryMedia] = useState(null);
    const [newSubCategoryMediaPreview, setNewSubCategoryMediaPreview] = useState(null);
    const [showSubCategoryForm, setShowSubCategoryForm] = useState(false);

    // Product States
    const [variants, setVariants] = useState([{ size: '', price: '', countInStock: '' }]);
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [refreshCategories, setRefreshCategories] = useState(false);
    const [refreshProducts, setRefreshProducts] = useState(false);
    
    // 💡 NEW STATES for Size Chart Image
    const [sizeChartImage, setSizeChartImage] = useState(null);
    const [sizeChartPreview, setSizeChartPreview] = useState(null);
    const [existingSizeChartImage, setExistingSizeChartImage] = useState(null);

    // 💡 NEW STATES for Collapsible Sections (The '+ icon' click functionality)
    const [showDiscountSection, setShowDiscountSection] = useState(false);
    const [showSizeChartSection, setShowSizeChartSection] = useState(false);
    const [showDetailsSection, setShowDetailsSection] = useState(false);

    // --- FETCH FUNCTIONS (UNCHANGED) ---
    const fetchProducts = useCallback(async () => {
        try {
            const response = await apiClient.get('/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        }
    }, []);

    const fetchCategories = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await apiClient.get('/categories', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setCategories(response.data);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    }, []);

    // NEW: Function to fetch subcategories based on the selected category
    const fetchSubCategories = useCallback(async (categoryId) => {
        if (!categoryId) {
            setSubCategories([]);
            return;
        }
        try {
            const response = await apiClient.get(`/subcategories?category=${categoryId}`);
            setSubCategories(response.data);
        } catch (error) {
            console.error('Failed to fetch subcategories:', error);
            setSubCategories([]);
        }
    }, []);

    // --- EFFECTS (UNCHANGED) ---
    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, [refreshCategories, refreshProducts, fetchProducts, fetchCategories]);

    useEffect(() => {
        // Trigger fetching subcategories when category selection changes
        fetchSubCategories(formData.category);
        
        // Optionally reset subCategory if the category is changed to an invalid one
        if (formData.category && formData.subCategory) {
             const isSubCategoryValid = subCategories.some(sc => sc._id === formData.subCategory);
             if (!isSubCategoryValid) {
                 setFormData(prev => ({ ...prev, subCategory: '' }));
             }
        } else if (!formData.category) {
            // Clear subCategory if parent category is cleared
            setFormData(prev => ({ ...prev, subCategory: '' }));
        }
    }, [formData.category, fetchSubCategories]);

    // --- HANDLERS ---
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        // Convert empty string to null for optional ObjectId/String fields (gender/subCategory)
        let finalValue = value;
        if ((name === 'gender' || name === 'subCategory') && value === '') {
            finalValue = null;
        }
        
        // 💡 NEW: Ensure discount is treated as a number
        if (name === 'discountPercentage') {
             finalValue = Number(value);
        }

        setFormData(prev => ({ 
            ...prev, 
            [name]: finalValue 
        }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(prevImages => [...prevImages, ...files]);
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
    };

    const handleRemoveImage = (indexToRemove, isExisting) => {
        if (isExisting) {
            setExistingImages(existingImages.filter((_, index) => index !== indexToRemove));
        } else {
             // Revoke object URL to prevent memory leaks in dev/test environment
             const urlToRemove = imagePreviews[indexToRemove];
             URL.revokeObjectURL(urlToRemove);

             setImages(images.filter((_, index) => index !== indexToRemove));
             setImagePreviews(imagePreviews.filter((_, index) => index !== indexToRemove));
        }
    };

    const handleVariantChange = (index, e) => {
        const newVariants = [...variants];
        newVariants[index][e.target.name] = e.target.value;
        setVariants(newVariants);
    };

    const addVariant = () => setVariants([...variants, { size: '', price: '', countInStock: '' }]);
    const removeVariant = (index) => {
        const newVariants = [...variants];
        newVariants.splice(index, 1);
        setVariants(newVariants);
    };

    // 💡 NEW: Size Chart Handlers
    const handleSizeChartChange = (e) => {
        const file = e.target.files[0];
        setSizeChartImage(file);
        if (sizeChartPreview) URL.revokeObjectURL(sizeChartPreview);
        if (file) setSizeChartPreview(URL.createObjectURL(file));
        setExistingSizeChartImage(null); // Clear existing if a new file is uploaded
    };

    const handleRemoveSizeChart = () => {
        setExistingSizeChartImage(null);
        setSizeChartImage(null);
        if (sizeChartPreview) URL.revokeObjectURL(sizeChartPreview);
        setSizeChartPreview(null);
        setShowSizeChartSection(false); // Close section on removal
    };


    const resetForm = () => {
        setEditingProduct(null);
        setFormData({ 
            name: '', 
            description: '', 
            brand: '', 
            category: '', 
            gender: '', 
            subCategory: '',
            // 💡 Reset new fields
            discountPercentage: 0,
            detailedDescription: '',
            productDetails: '',
        });
        setVariants([{ size: '', price: '', countInStock: '' }]);
        
        // Cleanup old preview URLs
        imagePreviews.forEach(URL.revokeObjectURL);
        if (sizeChartPreview) URL.revokeObjectURL(sizeChartPreview); // Clean up size chart preview

        setImages([]);
        setImagePreviews([]);
        setExistingImages([]);
        
        // 💡 Reset size chart specific states
        setSizeChartImage(null);
        setExistingSizeChartImage(null);
        setSizeChartPreview(null);
        
        setShowCategoryForm(false);
        setShowSubCategoryForm(false);
        // 💡 Reset section visibility
        setShowDiscountSection(false);
        setShowSizeChartSection(false);
        setShowDetailsSection(false);

        // Optionally reset category and subcategory creation states
        setNewCategoryName('');
        setNewSubCategoryName('');
    };

    // NEW: SubCategory Creation Handler (UNCHANGED)
    const handleCreateSubCategory = async () => {
        try {
            if (!newSubCategoryName.trim() || !formData.category) return alert("SubCategory name and parent Category are required.");

            const token = localStorage.getItem("token");
            const data = new FormData();
            data.append("name", newSubCategoryName);
            data.append("category", formData.category); // Parent Category ID
            if (newSubCategoryMedia) data.append("media", newSubCategoryMedia); // Key must match backend upload.single('media')

            const res = await apiClient.post("/subcategories", data, {
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
            });

            alert("SubCategory created!");
            setSubCategories([...subCategories, res.data]); // Add to local state
            setFormData(prev => ({ ...prev, subCategory: res.data._id })); // Select the new subcategory
            setShowSubCategoryForm(false);
            setNewSubCategoryName("");
            setNewSubCategoryMedia(null);
            if (newSubCategoryMediaPreview) URL.revokeObjectURL(newSubCategoryMediaPreview); // Cleanup URL
            setNewSubCategoryMediaPreview(null);
        } catch (err) {
            console.error(err);
            alert("Failed to create subcategory");
        }
    };
    
    // 💡 NEW: Helper function to build FormData for Create/Update
    const buildFormData = (isUpdate = false) => {
        const data = new FormData();
        
        // Append all formData fields
        for (const key in formData) {
            data.append(key, formData[key] === null ? '' : formData[key]); 
        }

        data.append('variants', JSON.stringify(variants));

        // Append NEW images for both Create and Update
        // 💡 ADJUSTED: Using 'images' key for both new files in Update and all files in Create
        for (const image of images) data.append('images', image); 
        
        // Append existing image URLs only for Update
        if (isUpdate) {
            existingImages.forEach(url => data.append('existingImages', url));
        }

        // 💡 Append Size Chart Image
        if (sizeChartImage) {
            data.append('sizeChartImage', sizeChartImage);
        }
        
        // 💡 Append existing size chart image URL for update
        if (isUpdate) {
            // Send existing URL or 'null' string if it was removed
            data.append('existingSizeChartImage', existingSizeChartImage || 'null'); 
        }

        return data;
    }

    // --- CRUD OPERATIONS ---
    const handleAddProduct = async (e) => {
        e.preventDefault();
        const data = buildFormData(false);
        const token = localStorage.getItem('token');
        
        try {
            await apiClient.post('/products', data, { 
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                },
            });
            alert('Product added successfully!');
            resetForm();
            setRefreshProducts(prev => !prev);
        } catch (error) {
            console.error('Failed to add product:', error);
            // This alert will show the detailed error if the server response is structured
            alert('Failed to add product. Check console for details. (Possible Multer Error: Server needs update for new file fields)'); 
        }
    };

    const handleEditClick = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            description: product.description,
            brand: product.brand,
            category: product.category?._id || '', 
            gender: product.gender || '', 
            subCategory: product.subCategory?._id || '', 
            // 💡 Populate NEW FIELDS for Edit
            discountPercentage: product.discountPercentage || 0,
            // Convert array of strings back to comma-separated string for input display
            detailedDescription: Array.isArray(product.detailedDescription) ? product.detailedDescription.join(', ') : '', 
            productDetails: product.productDetails || '',
        });
        setVariants(product.variants);
        setExistingImages(product.images);
        setImages([]);
        setImagePreviews([]);
        
        // 💡 Populate Size Chart states for Edit
        setExistingSizeChartImage(product.sizeChartImage || null);
        setSizeChartImage(null);
        setSizeChartPreview(null);

        setShowSubCategoryForm(false);
        
        // 💡 Set initial section visibility based on existing data
        setShowDiscountSection(product.discountPercentage > 0);
        setShowSizeChartSection(!!product.sizeChartImage);
        setShowDetailsSection(!!product.detailedDescription?.length || !!product.productDetails);
    };

    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        const data = buildFormData(true); // Pass true to trigger update logic
        const token = localStorage.getItem('token');

        try {
            await apiClient.put(`/products/${editingProduct._id}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                },
            });
            alert('Product updated successfully!');
            resetForm();
            setRefreshProducts(prev => !prev);
        } catch (error) {
            console.error('Failed to update product:', error);
            alert('Failed to update product. Check console for details. (Possible Multer Error: Server needs update for new file fields)');
        }
    };

    const handleDeleteProduct = async (productId) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            const token = localStorage.getItem('token');
            // FIX: Correctly call apiClient.delete
            await apiClient.delete(`/products/${productId}`, { 
                headers: { 'Authorization': `Bearer ${token}` },
            });
            alert('Product deleted successfully!');
            setRefreshProducts(prev => !prev);
        } catch (error) {
            console.error('Failed to delete product:', error);
            alert('Failed to delete product.');
        }
    };


    // --- RENDER ---
    return (
        <div className="p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-4">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct} className="space-y-4">
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Product Name" className="w-full p-2 border rounded-md" required />
                <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Short Description/Summary" className="w-full p-2 border rounded-md" required />
                <input type="text" name="brand" value={formData.brand} onChange={handleInputChange} placeholder="Brand" className="w-full p-2 border rounded-md" required />

                {/* Category Selection and Creation */}
                <select
                    name="category"
                    value={formData.category}
                    onChange={(e) => {
                        if (e.target.value === "new") {
                            setShowCategoryForm(true);
                            setFormData({ ...formData, category: "" });
                        } else {
                            setShowCategoryForm(false);
                            handleInputChange(e);
                        }
                    }}
                    className="w-full p-2 border rounded-md"
                    required
                >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                    <option value="new">+ Create New Category</option>
                </select>

                {/* New Category Form (Existing Logic) */}
                {showCategoryForm && (
                    <div className="p-4 border rounded-md bg-gray-50 mt-2">
                        <h3 className="text-lg font-semibold mb-2">Add New Category</h3>
                        <input
                            type="text"
                            placeholder="Category Name"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            className="w-full p-2 border rounded-md mb-2"
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                setNewCategoryImage(file);
                                setNewCategoryImagePreview(URL.createObjectURL(file));
                            }}
                            className="w-full p-2 border rounded-md mb-2"
                        />
                        {newCategoryImagePreview && (
                            <img src={newCategoryImagePreview} alt="Preview" className="h-20 w-20 object-cover rounded-md mb-2" />
                        )}
                        <button
                            type="button"
                            onClick={async () => {
                                try {
                                    const token = localStorage.getItem("token");
                                    const data = new FormData();
                                    data.append("name", newCategoryName);
                                    if (newCategoryImage) data.append("image", newCategoryImage);

                                    const res = await apiClient.post("/categories", data, {
                                        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
                                    });

                                    alert("Category created!");
                                    setCategories([...categories, res.data]);
                                    setFormData({ ...formData, category: res.data._id });
                                    setShowCategoryForm(false);
                                    setNewCategoryName("");
                                    setNewCategoryImage(null);
                                    if (newCategoryImagePreview) URL.revokeObjectURL(newCategoryImagePreview);
                                    setNewCategoryImagePreview(null);
                                } catch (err) {
                                    console.error(err);
                                    alert("Failed to create category");
                                }
                            }}
                            className="bg-green-600 text-white px-4 py-2 rounded-md"
                        >
                            Save Category
                        </button>
                    </div>
                )}


                {/* Gender */}
                <select
                    name="gender"
                    value={formData.gender || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                >
                    <option value="">Select Gender (Optional)</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="unisex">Unisex</option>
                    <option value="boys">Boys</option>
                    <option value="girls">Girls</option>
                </select>

                {/* SubCategory Selection and Creation (NEW LOGIC) */}
                <select
                    name="subCategory"
                    value={formData.subCategory || ""}
                    onChange={(e) => {
                        if (e.target.value === "new") {
                            setShowSubCategoryForm(true);
                            setFormData({ ...formData, subCategory: "" });
                        } else {
                            setShowSubCategoryForm(false);
                            handleInputChange(e);
                        }
                    }}
                    className="w-full p-2 border rounded-md"
                    // Disable if no category is selected
                    disabled={!formData.category || showCategoryForm}
                >
                    <option value="">Select SubCategory (Optional)</option>
                    {subCategories.map(subCat => (
                        <option key={subCat._id} value={subCat._id}>{subCat.name}</option>
                    ))}
                    {/* Only allow creating a new subcategory if a parent category is selected */}
                    {formData.category && <option value="new">+ Create New SubCategory</option>}
                </select>

                {/* New SubCategory Form */}
                {showSubCategoryForm && formData.category && (
                    <div className="p-4 border rounded-md bg-gray-50 mt-2">
                        <h3 className="text-lg font-semibold mb-2">Add New SubCategory for: {categories.find(c => c._id === formData.category)?.name}</h3>
                        <input
                            type="text"
                            placeholder="SubCategory Name"
                            value={newSubCategoryName}
                            onChange={(e) => setNewSubCategoryName(e.target.value)}
                            className="w-full p-2 border rounded-md mb-2"
                        />
                        {/* Input for image/video/gif */}
                        <input
                            type="file"
                            accept="image/*,video/*,.gif" // Accept common media types
                            onChange={(e) => {
                                const file = e.target.files[0];
                                setNewSubCategoryMedia(file);
                                setNewSubCategoryMediaPreview(URL.createObjectURL(file));
                            }}
                            className="w-full p-2 border rounded-md mb-2"
                        />
                        {newSubCategoryMediaPreview && (
                            // Simple display for media preview
                            <img
                                src={newSubCategoryMediaPreview}
                                alt="Media Preview"
                                className="h-20 w-20 object-cover rounded-md mb-2"
                            />
                        )}
                        <button
                            type="button"
                            onClick={handleCreateSubCategory}
                            className="bg-green-600 text-white px-4 py-2 rounded-md"
                            disabled={!newSubCategoryName.trim()}
                        >
                            Save SubCategory
                        </button>
                    </div>
                )}

                {/* 💡 NEW COLLAPSIBLE SECTION: Discounted Price Option */}
                <div className="border p-4 rounded-md">
                    <button type="button" onClick={() => setShowDiscountSection(prev => !prev)} className="font-semibold text-blue-600 flex items-center">
                        {showDiscountSection ? '➖' : '➕'} Discount Percentage (Optional)
                    </button>
                    {showDiscountSection && (
                        <div className="mt-2 space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Discount Percentage</label>
                            <input 
                                type="number" 
                                name="discountPercentage" 
                                value={formData.discountPercentage} 
                                onChange={handleInputChange} 
                                placeholder="e.g., 10 (for 10% off)" 
                                min="0" 
                                max="100" 
                                className="w-full p-2 border rounded-md" 
                            />
                            <p className="text-xs text-gray-500">This percentage will apply to all variant prices.</p>
                        </div>
                    )}
                </div>

                {/* 💡 NEW COLLAPSIBLE SECTION: Detailed Description & Product Details */}
                <div className="border p-4 rounded-md">
                    <button type="button" onClick={() => setShowDetailsSection(prev => !prev)} className="font-semibold text-blue-600 flex items-center">
                        {showDetailsSection ? '➖' : '➕'} Detailed Description & Specs
                    </button>
                    {showDetailsSection && (
                        <div className="mt-2 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description Bullet Points (separate with commas)</label>
                                <textarea 
                                    name="detailedDescription" 
                                    value={formData.detailedDescription} 
                                    onChange={handleInputChange} 
                                    placeholder="Feature 1, Feature 2, Feature 3..." 
                                    className="w-full p-2 border rounded-md" 
                                />
                                <p className="text-xs text-gray-500">Enter each bullet point separated by a comma (e.g., *Soft Cotton*, *Machine Washable*).</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Product Details / More Information</label>
                                <textarea 
                                    name="productDetails" 
                                    value={formData.productDetails} 
                                    onChange={handleInputChange} 
                                    placeholder="Material: 100% Cotton. Country of Origin: India. Wash Care: Machine wash cold." 
                                    className="w-full p-2 border rounded-md" 
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* 💡 NEW COLLAPSIBLE SECTION: Size Chart Image */}
                <div className="border p-4 rounded-md">
                    <button type="button" onClick={() => setShowSizeChartSection(prev => !prev)} className="font-semibold text-blue-600 flex items-center">
                        {showSizeChartSection ? '➖' : '➕'} Size Chart Image (Optional)
                    </button>
                    {showSizeChartSection && (
                        <div className="mt-2 space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Upload Size Chart Image</label>
                            <input 
                                type="file" 
                                name="sizeChartImage" 
                                accept="image/*"
                                onChange={handleSizeChartChange} 
                                className="w-full p-2 border rounded-md" 
                            />
                            {(sizeChartPreview || existingSizeChartImage) && (
                                <div className="relative inline-block mt-2">
                                    <img 
                                        src={sizeChartPreview || existingSizeChartImage} 
                                        alt="Size Chart Preview" 
                                        className="h-32 w-32 object-contain border rounded-md" 
                                    />
                                    <button 
                                        type="button" 
                                        onClick={handleRemoveSizeChart} 
                                        className="absolute top-0 right-0 bg-red-600 text-white rounded-full h-6 w-6 text-sm flex items-center justify-center p-1"
                                    >
                                        &times;
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>


                {/* Variants */}
                <h3 className="text-lg font-semibold">Product Variants</h3>
                {variants.map((variant, index) => (
                    <div key={index} className="flex space-x-2">
                        <input type="text" name="size" value={variant.size} onChange={(e) => handleVariantChange(index, e)} placeholder="Size" className="w-full p-2 border rounded-md" required />
                        <input type="number" name="price" value={variant.price} onChange={(e) => handleVariantChange(index, e)} placeholder="Price" className="w-full p-2 border rounded-md" required />
                        <input type="number" name="countInStock" value={variant.countInStock} onChange={(e) => handleVariantChange(index, e)} placeholder="Inventory" className="w-full p-2 border rounded-md" required />
                        <button type="button" onClick={() => removeVariant(index)} className="bg-red-500 text-white p-2 rounded-md">Remove</button>
                    </div>
                ))}
                <button type="button" onClick={addVariant} className="bg-gray-200 text-gray-800 p-2 rounded-md">Add Variant</button>

                {/* Images */}
                <h3 className="text-lg font-semibold">Product Images</h3>
                <input type="file" name="images" multiple onChange={handleImageChange} className="w-full p-2 border rounded-md" />
                <div className="flex flex-wrap space-x-2 mt-2">
                    {existingImages.map((url, idx) => (
                        <div key={`ex-${idx}`} className="relative">
                            <img src={url} alt="" className="h-24 w-24 object-cover rounded-md" />
                            <button type="button" onClick={() => handleRemoveImage(idx, true)} className="absolute top-0 right-0 bg-red-600 text-white rounded-full h-6 w-6">&times;</button>
                        </div>
                    ))}
                    {imagePreviews.map((preview, idx) => (
                        <div key={`new-${idx}`} className="relative">
                            <img src={preview} alt="" className="h-24 w-24 object-cover rounded-md" />
                            <button type="button" onClick={() => handleRemoveImage(idx, false)} className="absolute top-0 right-0 bg-red-600 text-white rounded-full h-6 w-6">&times;</button>
                        </div>
                    ))}
                </div>

                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-md">
                    {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
                {editingProduct && (
                    <button type="button" onClick={resetForm} className="w-full bg-gray-400 text-white p-2 rounded-md">Cancel</button>
                )}
            </form>

            {/* Existing Products */}
            <h2 className="text-2xl font-bold mt-8 mb-4">Existing Products</h2>
            <div className="space-y-4">
                {products.map(product => (
                    <div key={product._id} className="flex justify-between items-center p-4 bg-gray-100 rounded-md">
                        <div className="flex items-center space-x-4">
                            <img src={product.images[0]} alt={product.name} className="w-16 h-16 object-cover rounded-md" />
                            <div>
                                <span className="font-semibold">{product.name} - {product.brand}</span>
                                {/* Use optional chaining for safe access */}
                                <p className="text-sm text-gray-600">Category: {product.category?.name || 'N/A'}</p> 
                                <p className="text-sm text-gray-600">SubCategory: {product.subCategory?.name || 'N/A'}</p> 
                                <p className="text-sm text-gray-600">Gender: {product.gender || 'N/A'}</p>
                                
                                {/* 💡 New Display Fields */}
                                <p className="text-sm text-green-700 font-medium">Discount: {product.discountPercentage || 0}%</p>
                                <p className="text-sm text-gray-600">Details: {product.detailedDescription?.length || 0} bullets | Size Chart: {product.sizeChartImage ? 'Yes' : 'No'}</p>

                                <p className="text-sm text-gray-600">Variants: {product.variants.map(v => `${v.size}(₹${v.price})`).join(', ')}</p>
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            <button onClick={() => handleEditClick(product)} className="bg-yellow-500 text-white px-4 py-2 rounded-md">Edit</button>
                            <button onClick={() => handleDeleteProduct(product._id)} className="bg-red-600 text-white px-4 py-2 rounded-md">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductManagement;