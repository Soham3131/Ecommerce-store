
// import React, { useState, useEffect, useRef } from "react";
// import { Link } from "react-router-dom";
// import apiClient from "../services/apiClient";
// import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
// import LoadingSpinner from "../components/LoadingSpinner";

// const CategorySlider = () => {
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const sliderRef = useRef(null);

// useEffect(() => {
//   const fetchCategories = async () => {
//     try {
//       const response = await apiClient.get("/categories");
//       setCategories(response.data);
//     } catch (err) {
//       setError(err.response?.data?.message || err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchCategories();
// }, []);


//   const scrollLeft = () => {
//     sliderRef.current?.scrollBy({ left: -300, behavior: "smooth" });
//   };

//   const scrollRight = () => {
//     sliderRef.current?.scrollBy({ left: 300, behavior: "smooth" });
//   };

//   if (loading) return <LoadingSpinner />;
//   if (error)
//     return (
//       <div className="text-center py-12 text-red-500">Error: {error}</div>
//     );

//   return (
//     <section className="relative py-20 overflow-hidden bg-white">
//       {/* Decorative Text */}
//       <h1 className="absolute top-10 left-6 text-6xl md:text-9xl font-extrabold text-gray-100 select-none pointer-events-none">
//         SSJ
//       </h1>
//       <h1 className="absolute bottom-6 right-6 text-6xl md:text-9xl font-extrabold text-gray-100 select-none pointer-events-none">
//         ECOMM
//       </h1>

//       <div className="container mx-auto px-4 relative z-10">
//         <h2 className="text-4xl md:text-5xl font-extrabold text-center text-gray-900 mb-12">
//           Featured Categories
//         </h2>

//         {/* Slider */}
//         <div className="relative">
//           <div
//             ref={sliderRef}
//             className="flex space-x-6 overflow-x-auto scroll-smooth snap-x snap-mandatory px-4 py-2 custom-scrollbar-hidden"
//           >
//             {categories.map((category) => (
//               <div
//                 key={category._id}
//                 className="flex-shrink-0 snap-center"
//               >
//                 <Link
//                   to={`/categories/${category._id}`}
//                   className="block w-[80vw] sm:w-64 md:w-72 lg:w-80 relative overflow-hidden rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow duration-300 border"
//                 >
//                   <div className="relative">
//                     <img
//                       src={category.image}
//                       alt={category.name}
//                       className="w-full h-52 object-cover"
//                     />
//                     <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent"></div>
//                   </div>
//                   <div className="absolute bottom-0 inset-x-0 p-4 text-center">
//                     <h3 className="text-lg font-semibold text-white drop-shadow">
//                       {category.name}
//                     </h3>
//                   </div>
//                 </Link>
//               </div>
//             ))}
//           </div>

//           {/* Arrows */}
//           <button
//             onClick={scrollLeft}
//             className="absolute top-1/2 left-2 md:left-4 -translate-y-1/2 bg-white p-3 rounded-full shadow hover:bg-gray-100 transition z-20"
//           >
//             <FaChevronLeft className="w-5 h-5 text-gray-700" />
//           </button>
//           <button
//             onClick={scrollRight}
//             className="absolute top-1/2 right-2 md:right-4 -translate-y-1/2 bg-white p-3 rounded-full shadow hover:bg-gray-100 transition z-20"
//           >
//             <FaChevronRight className="w-5 h-5 text-gray-700" />
//           </button>
//         </div>
//       </div>

//       <style jsx>{`
//         .custom-scrollbar-hidden::-webkit-scrollbar {
//           display: none;
//         }
//         .custom-scrollbar-hidden {
//           -ms-overflow-style: none;
//           scrollbar-width: none;
//         }
//       `}</style>
//     </section>
//   );
// };

// export default CategorySlider;
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import apiClient from "../services/apiClient";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import LoadingSpinner from "../components/LoadingSpinner";

const CategorySlider = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sliderRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.get("/categories");
        const categoriesWithCounts = await Promise.all(
          response.data.map(async (cat) => {
            try {
              const subRes = await apiClient.get(
                `/categories/${cat._id}/subcount`
              );
              return { ...cat, subCount: subRes.data.count };
            } catch {
              return { ...cat, subCount: 0 };
            }
          })
        );
        setCategories(categoriesWithCounts);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const scrollLeft = () => {
    sliderRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    sliderRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <div className="text-center py-12 text-red-500">Error: {error}</div>
    );

  return (
    <section className="relative py-20 overflow-hidden bg-white">
      {/* Decorative Text */}
      <h1 className="absolute top-10 left-6 text-6xl md:text-9xl font-extrabold text-gray-100 select-none pointer-events-none">
        SSJ
      </h1>
      <h1 className="absolute bottom-6 right-6 text-6xl md:text-9xl font-extrabold text-gray-100 select-none pointer-events-none">
        ECOMM
      </h1>

      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center text-gray-900 mb-12">
          Featured Categories
        </h2>

        {/* Slider */}
        <div className="relative">
          <div
            ref={sliderRef}
            className="flex space-x-6 overflow-x-auto scroll-smooth snap-x snap-mandatory px-4 py-2 custom-scrollbar-hidden"
          >
            {categories.map((category) => (
              <div key={category._id} className="flex-shrink-0 snap-center">
                <Link
                  to={
                    category.subCount > 0
                      ? `/categories/${category._id}` // → CategorySubCategoriesPage
                      : `/categories/${category._id}`.replace(
                          category._id,
                          `${category._id}/products`
                        ) // → CategoryProductsPage
                  }
                  className="block w-[80vw] sm:w-64 md:w-72 lg:w-80 relative overflow-hidden rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow duration-300 border"
                >
                  <div className="relative">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-52 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent"></div>
                  </div>
                  <div className="absolute bottom-0 inset-x-0 p-4 text-center">
                    <h3 className="text-lg font-semibold text-white drop-shadow">
                      {category.name}
                    </h3>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* Arrows */}
          <button
            onClick={scrollLeft}
            className="absolute top-1/2 left-2 md:left-4 -translate-y-1/2 bg-white p-3 rounded-full shadow hover:bg-gray-100 transition z-20"
          >
            <FaChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
          <button
            onClick={scrollRight}
            className="absolute top-1/2 right-2 md:right-4 -translate-y-1/2 bg-white p-3 rounded-full shadow hover:bg-gray-100 transition z-20"
          >
            <FaChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar-hidden::-webkit-scrollbar {
          display: none;
        }
        .custom-scrollbar-hidden {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default CategorySlider;

