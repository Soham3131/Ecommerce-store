// // src/pages/CategorySubCategoriesPage.js

// import React, { useState, useEffect, useCallback } from "react";
// import { useParams, Link } from "react-router-dom";
// import apiClient from "../services/apiClient";
// import LoadingSpinner from "../components/LoadingSpinner";

// const CategorySubCategoriesPage = () => {
//     const { categoryId } = useParams();
//     const [subCategories, setSubCategories] = useState([]);
//     const [categoryName, setCategoryName] = useState("Category");
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     const fetchSubCategories = useCallback(async () => {
//         setLoading(true);
//         setError(null);
//         try {
//             // Fetch subcategories filtered by categoryId
//             const subCatResponse = await apiClient.get(`/subcategories?category=${categoryId}`);
//             setSubCategories(subCatResponse.data);

//             // Infer category name from the first subcategory or make a separate API call if needed
//             if (subCatResponse.data.length > 0 && subCatResponse.data[0].category) {
//                 setCategoryName(subCatResponse.data[0].category.name);
//             } else {
//                 // If no subcategories, maybe fetch category details directly
//                 const catResponse = await apiClient.get(`/categories/${categoryId}`);
//                 setCategoryName(catResponse.data.name);
//             }
//         } catch (err) {
//             setError(err.response?.data?.message || err.message || "Failed to fetch subcategories.");
//         } finally {
//             setLoading(false);
//         }
//     }, [categoryId]);

//     useEffect(() => {
//         fetchSubCategories();
//     }, [fetchSubCategories]);

//     if (loading) return <LoadingSpinner />;
//     if (error) return <div className="text-center py-12 text-red-500">Error: {error}</div>;

//     return (
//         <div className="container mx-auto px-4 py-8">
//             <h1 className="text-4xl font-extrabold mb-8 text-gray-900 text-center">
//                 SubCategories in <span className="text-blue-600">{categoryName}</span>
//             </h1>

//             {subCategories.length === 0 ? (
//                 <p className="text-center text-gray-600">No subcategories found for this category.</p>
//             ) : (
//                 <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//                     {subCategories.map((subCategory) => (
//                         <Link
//                             key={subCategory._id}
//                             // Link to the new page that shows products for this subcategory
//                             to={`/subcategories/${subCategory._id}`}
//                             className="block bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
//                         >
//                             <img
//                                 src={subCategory.mediaUrl || 'placeholder.jpg'} // Use mediaUrl from SubCategory model
//                                 alt={subCategory.name}
//                                 className="w-full h-40 object-cover"
//                             />
//                             <div className="p-4 text-center">
//                                 <h2 className="text-xl font-semibold text-gray-800">{subCategory.name}</h2>
//                             </div>
//                         </Link>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default CategorySubCategoriesPage;

// src/pages/CategorySubCategoriesPage.js
import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import apiClient from "../services/apiClient";
import LoadingSpinner from "../components/LoadingSpinner";

const CategorySubCategoriesPage = () => {
    const { categoryId } = useParams();
    const [subCategories, setSubCategories] = useState([]);
    const [categoryName, setCategoryName] = useState("Category");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchSubCategories = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const subCatResponse = await apiClient.get(`/subcategories?category=${categoryId}`);
            let subCats = subCatResponse.data;

            // Move 'featured' subcategory to the first position if it exists
            const featuredIndex = subCats.findIndex(sub => sub.name.toLowerCase() === "featured");
            if (featuredIndex > 0) {
                const [featuredItem] = subCats.splice(featuredIndex, 1);
                subCats.unshift(featuredItem);
            }

            setSubCategories(subCats);

            // Set category name
            if (subCats.length > 0 && subCats[0].category) {
                setCategoryName(subCats[0].category.name);
            } else {
                const catResponse = await apiClient.get(`/categories/${categoryId}`);
                setCategoryName(catResponse.data.name);
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to fetch subcategories.");
        } finally {
            setLoading(false);
        }
    }, [categoryId]);

    useEffect(() => {
        fetchSubCategories();
    }, [fetchSubCategories]);

    if (loading) return <LoadingSpinner />;
    if (error) return <div className="text-center py-12 text-red-500">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-12 text-gray-900 text-center">
                SubCategories in <span className="text-blue-600">{categoryName}</span>
            </h1>

            {subCategories.length === 0 ? (
                <p className="text-center text-gray-500 text-lg">No subcategories found for this category.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {subCategories.map((subCategory) => (
                        <Link
                            key={subCategory._id}
                            to={`/subcategories/${subCategory._id}`}
                            className="block bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-2xl transition-shadow duration-300 overflow-hidden group"
                        >
                            <div className="relative w-full h-52 md:h-56 lg:h-60 overflow-hidden">
                                <img
                                    src={subCategory.mediaUrl || '/placeholder.jpg'}
                                    alt={subCategory.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                {subCategory.name.toLowerCase() === "featured" && (
                                    <span className="absolute top-2 left-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full shadow">
                                        FEATURED
                                    </span>
                                )}
                            </div>
                            <div className="p-4 text-center">
                                <h2 className="text-lg md:text-xl font-semibold text-gray-800 truncate">
                                    {subCategory.name}
                                </h2>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CategorySubCategoriesPage;
