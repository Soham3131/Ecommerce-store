// src/pages/WishlistPage.js
import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const WishlistPage = () => {
  const { wishlist, fetchWishlist } = useAuth();

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  if (wishlist.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Your wishlist is empty 💔</h2>
        <Link
          to="/products"
          className="mt-4 inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
        >
          Go Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Wishlist ❤️</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {wishlist.map((product) => (
          <Link
            key={product._id}
            to={`/product/${product._id}`}
            className="border rounded-lg p-4 shadow hover:shadow-lg transition"
          >
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-48 object-cover rounded"
            />
            <h2 className="mt-2 font-semibold text-lg">{product.name}</h2>
            <p className="text-gray-500">{product.brand}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
