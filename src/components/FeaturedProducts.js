
// src/components/FeaturedProducts.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import apiClient from "../services/apiClient";
import { BsArrowRight } from "react-icons/bs";
import LoadingSpinner from "./LoadingSpinner";

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
  const fetchFeaturedProducts = async () => {
    try {
      const response = await apiClient.get("/products/subcategory/featured");
      setProducts(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  fetchFeaturedProducts();
}, []);


  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">Error: {error}</div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section
      className="py-20 text-white relative"
      style={{
        background: "linear-gradient(135deg, #1f1c2c, #928dab)", // richer gradient
        backgroundImage:
          "url('https://www.transparenttextures.com/patterns/asfalt-dark.png')", // darker texture
        backgroundBlendMode: "overlay",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <h2 className="text-3xl md:text-5xl font-extrabold text-black text-center mb-10 drop-shadow-lg">
          Featured Products
        </h2>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-10">
          {products.map((product) => (
            <div key={product._id}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="flex justify-center mt-12">
          <Link
            to="/products/subcategory/featured"
          //   className="relative inline-flex items-center space-x-2 px-8 py-4 rounded-full overflow-hidden
          //              bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold text-lg
          //              shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1
          //              group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
          // >
          className="relative inline-flex items-center space-x-2 px-8 py-4 rounded-full overflow-hidden
           bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-lg
           shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1
           group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">

            <span className="relative z-10">View All</span>
            <BsArrowRight className="relative z-10 transform transition-transform duration-300 group-hover:translate-x-1" />
            <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
