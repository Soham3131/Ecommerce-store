// src/pages/SubCategoryProductsPage.js

import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import apiClient from "../services/apiClient";
import LoadingSpinner from "../components/LoadingSpinner";
// Assuming you have a ProductCard component or use the simple card structure here
import ProductCard from "../components/ProductCard"; 

const SubCategoryProductsPage = () => {
    const { subCategoryId } = useParams();
    const [products, setProducts] = useState([]);
    const [subCategoryName, setSubCategoryName] = useState("Products");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProductsBySubCategory = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // New Backend Route needed: GET /api/products/subcategory/:subCategoryId
            const response = await apiClient.get(`/products/subcategory/${subCategoryId}`);
            setProducts(response.data);

            // Optional: Fetch subcategory details to get the name for the title
            const subCatResponse = await apiClient.get(`/subcategories/${subCategoryId}`);
            setSubCategoryName(subCatResponse.data.name);

        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to fetch products.");
        } finally {
            setLoading(false);
        }
    }, [subCategoryId]);

    useEffect(() => {
        fetchProductsBySubCategory();
    }, [fetchProductsBySubCategory]);

    if (loading) return <LoadingSpinner />;
    if (error) return <div className="text-center py-12 text-red-500">Error: {error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-extrabold mb-8 text-gray-900 text-center">
                All Products in <span className="text-green-600">{subCategoryName}</span>
            </h1>

            {products.length === 0 ? (
                <p className="text-center text-gray-600">No products found in this subcategory.</p>
            ) : (
                // Grid layout: two cards in small screen (sm:grid-cols-2)
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default SubCategoryProductsPage;