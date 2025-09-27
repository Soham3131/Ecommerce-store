

// import React, { useState, useEffect } from 'react';

// import apiClient from '../services/apiClient';

// const ProductManagement = () => {
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     brand: '',
//     category: '',
//     gender: '',
//     subCategory: '',
//   });
//   const [newCategoryName, setNewCategoryName] = useState('');
//   const [newCategoryImage, setNewCategoryImage] = useState(null);
//   const [newCategoryImagePreview, setNewCategoryImagePreview] = useState(null);
//   const [showCategoryForm, setShowCategoryForm] = useState(false);
//   const [variants, setVariants] = useState([{ size: '', price: '', countInStock: '' }]);
//   const [images, setImages] = useState([]);
//   const [imagePreviews, setImagePreviews] = useState([]);
//   const [existingImages, setExistingImages] = useState([]);
//   const [editingProduct, setEditingProduct] = useState(null);
//   const [refreshCategories, setRefreshCategories] = useState(false);
//   const [refreshProducts, setRefreshProducts] = useState(false);

//   const [subCategories, setSubCategories] = useState([]);
// const [newSubCategoryName, setNewSubCategoryName] = useState('');
// const [newSubCategoryMedia, setNewSubCategoryMedia] = useState(null);
// const [newSubCategoryMediaPreview, setNewSubCategoryMediaPreview] = useState(null);
// const [showSubCategoryForm, setShowSubCategoryForm] = useState(false);

//   useEffect(() => {
//     fetchProducts();
//     fetchCategories();
//   }, [refreshCategories, refreshProducts]);

//   const fetchProducts = async () => {
//     try {
//       const response = await apiClient.get('/products');
//       setProducts(response.data);
//     } catch (error) {
//       console.error('Failed to fetch products:', error);
//     }
//   };

//   const fetchCategories = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await apiClient.get('/categories', {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });
//       setCategories(response.data);
//     } catch (error) {
//       console.error('Failed to fetch categories:', error);
//     }
//   };

//   const handleInputChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files);
//     setImages(prevImages => [...prevImages, ...files]);
//     const newPreviews = files.map(file => URL.createObjectURL(file));
//     setImagePreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
//   };

//   const handleRemoveImage = (indexToRemove, isExisting) => {
//     if (isExisting) {
//       setExistingImages(existingImages.filter((_, index) => index !== indexToRemove));
//     } else {
//       setImages(images.filter((_, index) => index !== indexToRemove));
//       setImagePreviews(imagePreviews.filter((_, index) => index !== indexToRemove));
//     }
//   };

//   const handleVariantChange = (index, e) => {
//     const newVariants = [...variants];
//     newVariants[index][e.target.name] = e.target.value;
//     setVariants(newVariants);
//   };

//   const addVariant = () => setVariants([...variants, { size: '', price: '', countInStock: '' }]);
//   const removeVariant = (index) => {
//     const newVariants = [...variants];
//     newVariants.splice(index, 1);
//     setVariants(newVariants);
//   };

//   const handleAddProduct = async (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem('token');
//     const data = new FormData();
//     for (const key in formData) data.append(key, formData[key]);
//     data.append('variants', JSON.stringify(variants));
//     for (const image of images) data.append('images', image);

//     try {
//       await apiClient.post('/products', data, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           'Authorization': `Bearer ${token}`
//         },
//       });
//       alert('Product added successfully!');
//       resetForm();
//       setRefreshProducts(prev => !prev);
//     } catch (error) {
//       console.error('Failed to add product:', error);
//       alert('Failed to add product.');
//     }
//   };

//   const handleEditClick = (product) => {
//     setEditingProduct(product);
//     setFormData({
//       name: product.name,
//       description: product.description,
//       brand: product.brand,
//       category: product.category._id,
//       gender: product.gender,
//       subCategory: product.subCategory || '',
//     });
//     setVariants(product.variants);
//     setExistingImages(product.images);
//     setImages([]);
//     setImagePreviews([]);
//   };

//   const handleUpdateProduct = async (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem('token');
//     const data = new FormData();
//     for (const key in formData) data.append(key, formData[key]);
//     data.append('variants', JSON.stringify(variants));
//     for (const image of images) data.append('newImages', image);
//     for (const imageUrl of existingImages) data.append('existingImages', imageUrl);

//     try {
//       await apiClient.put(`/products/${editingProduct._id}`, data, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           'Authorization': `Bearer ${token}`
//         },
//       });
//       alert('Product updated successfully!');
//       resetForm();
//       setRefreshProducts(prev => !prev);
//     } catch (error) {
//       console.error('Failed to update product:', error);
//       alert('Failed to update product.');
//     }
//   };

//   const handleDeleteProduct = async (productId) => {
//     if (!window.confirm('Are you sure you want to delete this product?')) return;
//     try {
//       const token = localStorage.getItem('token');
//       await (`/products/${productId}`, {
//         headers: { 'Authorization': `Bearer ${token}` },
//       });
//       alert('Product deleted successfully!');
//       setRefreshProducts(prev => !prev);
//     } catch (error) {
//       console.error('Failed to delete product:', error);
//       alert('Failed to delete product.');
//     }
//   };

//   const resetForm = () => {
//     setEditingProduct(null);
//     setFormData({ name: '', description: '', brand: '', category: '', gender: '', subCategory: '' });
//     setVariants([{ size: '', price: '', countInStock: '' }]);
//     setImages([]);
//     setImagePreviews([]);
//     setExistingImages([]);
//   };

//   return (
//     <div className="p-6 bg-white shadow-md rounded-lg">
//       <h2 className="text-2xl font-bold mb-4">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
//       <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct} className="space-y-4">
//         <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Product Name" className="w-full p-2 border rounded-md" required />
//         <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Description" className="w-full p-2 border rounded-md" required />
//         <input type="text" name="brand" value={formData.brand} onChange={handleInputChange} placeholder="Brand" className="w-full p-2 border rounded-md" required />

//         {/* Category */}
//        {/* Category */}
// <select
//   name="category"
//   value={formData.category}
//   onChange={(e) => {
//     if (e.target.value === "new") {
//       setShowCategoryForm(true);
//       setFormData({ ...formData, category: "" });
//     } else {
//       setShowCategoryForm(false);
//       handleInputChange(e);
//     }
//   }}
//   className="w-full p-2 border rounded-md"
//   required
// >
//   <option value="">Select Category</option>
//   {categories.map(cat => (
//     <option key={cat._id} value={cat._id}>{cat.name}</option>
//   ))}
//   <option value="new">+ Create New Category</option>
// </select>

// {/* Show new category form if selected */}
// {showCategoryForm && (
//   <div className="p-4 border rounded-md bg-gray-50 mt-2">
//     <h3 className="text-lg font-semibold mb-2">Add New Category</h3>
//     <input
//       type="text"
//       placeholder="Category Name"
//       value={newCategoryName}
//       onChange={(e) => setNewCategoryName(e.target.value)}
//       className="w-full p-2 border rounded-md mb-2"
//     />
//     <input
//       type="file"
//       accept="image/*"
//       onChange={(e) => {
//         const file = e.target.files[0];
//         setNewCategoryImage(file);
//         setNewCategoryImagePreview(URL.createObjectURL(file));
//       }}
//       className="w-full p-2 border rounded-md mb-2"
//     />
//     {newCategoryImagePreview && (
//       <img src={newCategoryImagePreview} alt="Preview" className="h-20 w-20 object-cover rounded-md mb-2" />
//     )}
//     <button
//       type="button"
//       onClick={async () => {
//         try {
//           const token = localStorage.getItem("token");
//           const data = new FormData();
//           data.append("name", newCategoryName);
//           if (newCategoryImage) data.append("image", newCategoryImage);

//           const res = await apiClient.post("/categories", data, {
//             headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
//           });

//           alert("Category created!");
//           setCategories([...categories, res.data]);
//           setFormData({ ...formData, category: res.data._id });
//           setShowCategoryForm(false);
//           setNewCategoryName("");
//           setNewCategoryImage(null);
//           setNewCategoryImagePreview(null);
//         } catch (err) {
//           console.error(err);
//           alert("Failed to create category");
//         }
//       }}
//       className="bg-green-600 text-white px-4 py-2 rounded-md"
//     >
//       Save Category
//     </button>
//   </div>
// )}


//         {/* Gender */}
//        <select 
//   name="gender" 
//   // Ensure the value matches what's in state
//   value={formData.gender || ''} 
//   onChange={handleInputChange} 
//   className="w-full p-2 border rounded-md"
//   // *** REMOVED 'required' ATTRIBUTE ***
// >
//   {/* The option with value="" is what will be selected when formData.gender is null */}
//   <option value="">Select Gender (Optional)</option> 
//   <option value="male">Male</option>
//   <option value="female">Female</option>
//   <option value="unisex">Unisex</option>
//   <option value="boys">Boys</option>
//   <option value="girls">Girls</option>
// </select>

//         {/* SubCategory */}
//         <input
//           type="text"
//           name="subCategory"
//           value={formData.subCategory}
//           onChange={handleInputChange}
//           placeholder="Sub Category (e.g., Sneakers, Boots)"
//           className="w-full p-2 border rounded-md"
//         />

//         {/* Variants */}
//         <h3 className="text-lg font-semibold">Product Variants</h3>
//         {variants.map((variant, index) => (
//           <div key={index} className="flex space-x-2">
//             <input type="text" name="size" value={variant.size} onChange={(e) => handleVariantChange(index, e)} placeholder="Size" className="w-full p-2 border rounded-md" required />
//             <input type="number" name="price" value={variant.price} onChange={(e) => handleVariantChange(index, e)} placeholder="Price" className="w-full p-2 border rounded-md" required />
//             <input type="number" name="countInStock" value={variant.countInStock} onChange={(e) => handleVariantChange(index, e)} placeholder="Inventory" className="w-full p-2 border rounded-md" required />
//             <button type="button" onClick={() => removeVariant(index)} className="bg-red-500 text-white p-2 rounded-md">-</button>
//           </div>
//         ))}
//         <button type="button" onClick={addVariant} className="bg-gray-200 text-gray-800 p-2 rounded-md">Add Variant</button>

//         {/* Images */}
//         <h3 className="text-lg font-semibold">Product Images</h3>
//         <input type="file" name="images" multiple onChange={handleImageChange} className="w-full p-2 border rounded-md" />
//         <div className="flex flex-wrap space-x-2 mt-2">
//           {existingImages.map((url, idx) => (
//             <div key={`ex-${idx}`} className="relative">
//               <img src={url} alt="" className="h-24 w-24 object-cover rounded-md" />
//               <button type="button" onClick={() => handleRemoveImage(idx, true)} className="absolute top-0 right-0 bg-red-600 text-white rounded-full h-6 w-6">&times;</button>
//             </div>
//           ))}
//           {imagePreviews.map((preview, idx) => (
//             <div key={`new-${idx}`} className="relative">
//               <img src={preview} alt="" className="h-24 w-24 object-cover rounded-md" />
//               <button type="button" onClick={() => handleRemoveImage(idx, false)} className="absolute top-0 right-0 bg-red-600 text-white rounded-full h-6 w-6">&times;</button>
//             </div>
//           ))}
//         </div>

//         <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-md">
//           {editingProduct ? 'Update Product' : 'Add Product'}
//         </button>
//         {editingProduct && (
//           <button type="button" onClick={resetForm} className="w-full bg-gray-400 text-white p-2 rounded-md">Cancel</button>
//         )}
//       </form>

//       {/* Existing Products */}
//       <h2 className="text-2xl font-bold mt-8 mb-4">Existing Products</h2>
//       <div className="space-y-4">
//         {products.map(product => (
//           <div key={product._id} className="flex justify-between items-center p-4 bg-gray-100 rounded-md">
//             <div className="flex items-center space-x-4">
//               <img src={product.images[0]} alt={product.name} className="w-16 h-16 object-cover rounded-md" />
//               <div>
//                 <span className="font-semibold">{product.name} - {product.brand}</span>
//                 <p className="text-sm text-gray-600">Category: {product.category?.name || 'N/A'}</p>
//                 <p className="text-sm text-gray-600">Gender: {product.gender} | Sub: {product.subCategory || 'N/A'}</p>
//                 <p className="text-sm text-gray-600">Variants: {product.variants.map(v => `${v.size}(₹${v.price})`).join(', ')}</p>
//               </div>
//             </div>
//             <div className="flex space-x-2">
//               <button onClick={() => handleEditClick(product)} className="bg-yellow-500 text-white px-4 py-2 rounded-md">Edit</button>
//               <button onClick={() => handleDeleteProduct(product._id)} className="bg-red-600 text-white px-4 py-2 rounded-md">Delete</button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ProductManagement;

import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '../services/apiClient';

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]); // State for fetching subcategories

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        brand: '',
        category: '',
        gender: '',
        subCategory: '',
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

    // --- FETCH FUNCTIONS ---
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

    // --- EFFECTS ---
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

    const resetForm = () => {
        setEditingProduct(null);
        setFormData({ name: '', description: '', brand: '', category: '', gender: '', subCategory: '' });
        setVariants([{ size: '', price: '', countInStock: '' }]);
        
        // Cleanup old preview URLs
        imagePreviews.forEach(URL.revokeObjectURL);

        setImages([]);
        setImagePreviews([]);
        setExistingImages([]);
        setShowCategoryForm(false);
        setShowSubCategoryForm(false); // Reset SubCategory form visibility
        // Optionally reset category and subcategory creation states
        setNewCategoryName('');
        setNewSubCategoryName('');
    };

    // NEW: SubCategory Creation Handler
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
    
    // --- CRUD OPERATIONS ---
    const handleAddProduct = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const data = new FormData();
        
        // Append all formData fields, converting null to empty string for FormData
        for (const key in formData) {
            data.append(key, formData[key] === null ? '' : formData[key]); 
        }

        data.append('variants', JSON.stringify(variants));
        for (const image of images) data.append('images', image);

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
            alert('Failed to add product.');
        }
    };

    const handleEditClick = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            description: product.description,
            brand: product.brand,
            category: product.category?._id || '', // Handle null/undefined
            gender: product.gender || '', // Use '' to match select behavior
            subCategory: product.subCategory?._id || '', // Use '' to match select behavior
        });
        setVariants(product.variants);
        setExistingImages(product.images);
        setImages([]);
        setImagePreviews([]);
        setShowSubCategoryForm(false);
    };

    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const data = new FormData();
        
        // Append all formData fields, converting null to empty string for FormData
        for (const key in formData) {
            data.append(key, formData[key] === null ? '' : formData[key]);
        }
        
        data.append('variants', JSON.stringify(variants));
        for (const image of images) data.append('newImages', image); // Use newImages key for updates
        existingImages.forEach(url => data.append('existingImages', url)); // Pass existing images

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
            alert('Failed to update product.');
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
                <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Description" className="w-full p-2 border rounded-md" required />
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


                {/* Variants */}
                <h3 className="text-lg font-semibold">Product Variants</h3>
                {variants.map((variant, index) => (
                    <div key={index} className="flex space-x-2">
                        <input type="text" name="size" value={variant.size} onChange={(e) => handleVariantChange(index, e)} placeholder="Size" className="w-full p-2 border rounded-md" required />
                        <input type="number" name="price" value={variant.price} onChange={(e) => handleVariantChange(index, e)} placeholder="Price" className="w-full p-2 border rounded-md" required />
                        <input type="number" name="countInStock" value={variant.countInStock} onChange={(e) => handleVariantChange(index, e)} placeholder="Inventory" className="w-full p-2 border rounded-md" required />
                        <button type="button" onClick={() => removeVariant(index)} className="bg-red-500 text-white p-2 rounded-md">-</button>
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