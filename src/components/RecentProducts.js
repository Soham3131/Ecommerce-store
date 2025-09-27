// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import ProductCard from './ProductCard'; // Assuming you have a ProductCard component
// import { BsArrowRight } from 'react-icons/bs';
// import LoadingSpinner from './LoadingSpinner';
// const RecentProducts = () => {
//     const [products, setProducts] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchRecentProducts = async () => {
//             try {
//                 const response = await fetch('/products/recent');
//                 if (!response.ok) {
//                     throw new Error('Failed to fetch recently added products');
//                 }
//                 const data = await response.json();
//                 setProducts(data);
//             } catch (err) {
//                 setError(err.message);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchRecentProducts();
//     }, []);

//     if (loading) {
//         // return <div className="text-center py-12 text-gray-600">Loading new arrivals...</div>;
//         return <LoadingSpinner />
//     }

//     if (error) {
//         return <div className="text-center py-12 text-red-500">Error: {error}</div>;
//     }

//     if (products.length === 0) {
//         return null;
//     }

//     return (
//         <section className="py-16 bg-gray-100">
//             <div className="container mx-auto px-4">
//                 <div className="flex justify-between items-center mb-10">
//                     <h2 className="text-4xl font-extrabold text-gray-800">New Arrivals</h2>
//                     <Link
//                         to="/products/recent" // This route will be added in App.js
//                         className="flex items-center space-x-2 text-indigo-600 font-semibold group"
//                     >
//                         <span>View All</span>
//                         <BsArrowRight className="transform transition-transform duration-300 group-hover:translate-x-1" />
//                     </Link>
//                 </div>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
//                     {products.map((product, index) => (
//                         <div key={product._id} className={`animate-fadeInUp delay-${index * 100}`}>
//                             <ProductCard product={product} />
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </section>
//     );
// };

// export default RecentProducts;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard'; 
import { BsArrowRight } from 'react-icons/bs';
import apiClient from '../services/apiClient';
import LoadingSpinner from './LoadingSpinner';

const RecentProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

   useEffect(() => {
  const fetchRecentProducts = async () => {
    try {
      // Fetch only the 8 most recent products
      const { data } = await apiClient.get("/products/recent?limit=8");
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchRecentProducts();
}, []);


    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <div className="text-center py-12 text-red-500">Error: {error}</div>;
    }

    // Only render the component if there are products to show
    if (products.length === 0) {
        return null; 
    }

    return (
        <section className="py-16 bg-gray-100">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-4xl font-extrabold text-gray-800">New Arrivals</h2>
                    <Link
                        to="/products/recent/all" 
                        className="flex items-center space-x-2 text-indigo-600 font-semibold group"
                    >
                        <span>View All</span>
                        <BsArrowRight className="transform transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                </div>
                {/* Responsive grid for 4 columns on large screens, 2 on mobile */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <div key={product._id} className="animate-fadeInUp">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default RecentProducts;