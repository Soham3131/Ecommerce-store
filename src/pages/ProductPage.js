

// import React, { useState, useEffect } from "react";
// import apiClient from '../services/apiClient';
// import { useParams } from "react-router-dom";
// import { useCart } from "../context/CartContext";
// import {
//   FaHeart,
//   FaShareAlt,
//   FaStar,
//   FaChevronLeft,
//   FaChevronRight,
//   FaSearchPlus,
//   FaSearchMinus,
// } from "react-icons/fa";
// import LoadingSpinner from "../components/LoadingSpinner";
// import { motion, AnimatePresence } from "framer-motion";
// import { useAuth } from "../context/AuthContext";

// const ProductPage = () => {
//   const { id } = useParams();
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedVariant, setSelectedVariant] = useState(null);
//   const { addToCart } = useCart();
//   const [activeImageIndex, setActiveImageIndex] = useState(0);

//   const { user, wishlist, fetchWishlist } = useAuth();
//   const [isWishlisted, setIsWishlisted] = useState(false);
//   const [heartAnimation, setHeartAnimation] = useState(false);

//   const [dynamicRating, setDynamicRating] = useState(null);
//   const [isZoomed, setIsZoomed] = useState(false); // desktop hover zoom
//   const [isFullScreen, setIsFullScreen] = useState(false); // mobile fullscreen zoom
//   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

//   // detect mobile
//   const isMobile = window.matchMedia("(pointer: coarse)").matches;

//   const isNewArrival = (creationTime) => {
//     const oneDay = 24 * 60 * 60 * 1000;
//     const creationDate = new Date(creationTime);
//     const today = new Date();
//     const diffDays = Math.round(Math.abs((today - creationDate) / oneDay));
//     return diffDays < 15;
//   };

//   // size → review mapping
//   const reviewMap = {
//     6: 109,
//     7: 205,
//     8: 157,
//     9: 184,
//     10: 232,
//     11: 120,
//     12: 178,
//     13: 99,
//   };

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const response = await apiClient.get(
//           `/products/${id}`
//         );
//         setProduct(response.data);

//         if (response.data.variants && response.data.variants.length > 0) {
//           const firstAvailableVariant = response.data.variants.find(
//             (v) => v.countInStock > 0
//           );
//           if (firstAvailableVariant) {
//             setSelectedVariant(firstAvailableVariant);

//             // reviews based on first available size
//             const size = parseInt(firstAvailableVariant.size, 10);
//             const reviews = reviewMap[size] || 150; // fallback
//             setDynamicRating({
//               rating: (Math.random() * (5.0 - 4.0) + 4.0).toFixed(1),
//               reviews,
//             });
//           }
//         }
//       } catch (err) {
//         setError("Product not found.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProduct();
//   }, [id]);

//   useEffect(() => {
//     if (!user) {
//       setIsWishlisted(false);
//       return;
//     }
//     const isInWishlist = wishlist.some((item) => item._id === id);
//     setIsWishlisted(isInWishlist);
//   }, [id, user, wishlist]);

//   const handleAddToCart = () => {
//     if (!selectedVariant) {
//       alert("Please select a size first.");
//       return;
//     }
//     if (selectedVariant.countInStock <= 0) {
//       alert("This size is out of stock.");
//       return;
//     }
//     const productToAdd = {
//       _id: product._id,
//       name: product.name,
//       images: product.images,
//       selectedVariant: selectedVariant,
//     };
//     addToCart(productToAdd);
//     alert(`${product.name} (size: ${selectedVariant.size}) added to cart!`);
//   };

//   const isVideo = (url) => {
//     const videoExtensions = [".mp4", ".mov", ".webm", ".ogg"];
//     return videoExtensions.some((ext) => url.endsWith(ext));
//   };

//   const nextImage = () => {
//     setActiveImageIndex(
//       (prevIndex) => (prevIndex + 1) % product.images.length
//     );
//   };

//   const prevImage = () => {
//     setActiveImageIndex(
//       (prevIndex) =>
//         (prevIndex - 1 + product.images.length) % product.images.length
//     );
//   };

//   const toggleWishlist = async () => {
//     try {
//       if (!user) {
//         alert("Please login to use wishlist.");
//         return;
//       }
//       if (isWishlisted) {
//         await (`/wishlist/${product._id}`);
//       } else {
//         await apiClient.post(`/wishlist/${product._id}`);
//       }
//       await fetchWishlist();
//       setHeartAnimation(true);
//       setTimeout(() => setHeartAnimation(false), 1000);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleShare = () => {
//     const link = window.location.href;
//     navigator.clipboard
//       .writeText(link)
//       .then(() => alert("Product link copied to clipboard!"))
//       .catch(() => alert("Failed to copy link"));
//   };

//   const handleMouseMove = (e) => {
//     if (!isZoomed) return;
//     const { left, top, width, height } =
//       e.currentTarget.getBoundingClientRect();
//     const x = ((e.pageX - left) / width) * 100;
//     const y = ((e.pageY - top) / height) * 100;
//     setMousePosition({ x, y });
//   };

//   if (loading) return <LoadingSpinner />;
//   if (error)
//     return <div className="text-center text-red-500 mt-10">{error}</div>;
//   if (!product) return null;

//   const productDescriptionParagraphs = product.description
//     .split("\n\n")
//     .map((p, i) => (
//       <p key={i} className="mt-4 first:mt-0 leading-relaxed text-gray-700">
//         {p}
//       </p>
//     ));

//   return (
//     <div className="container mx-auto px-4 py-8 md:py-16 bg-white font-sans antialiased">
//       {/* Full-screen image modal for mobile zoom */}
//       <AnimatePresence>
//         {isFullScreen && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 z-[100] bg-black flex items-center justify-center p-4"
//             onClick={() => setIsFullScreen(false)}
//           >
//             <motion.img
//               src={product.images[activeImageIndex]}
//               alt={product.name}
//               initial={{ scale: 0.8 }}
//               animate={{ scale: 1 }}
//               transition={{ duration: 0.3 }}
//               className="max-w-full max-h-full object-contain"
//             />
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Main product page layout */}
//       <div className="flex flex-col md:flex-row gap-8 items-start justify-center">
//         {/* Image and Video Gallery */}
//         <div className="w-full md:w-1/2">
//           <div
//             className="relative w-full h-[500px] bg-gray-50 rounded-2xl shadow-xl overflow-hidden group"
//             onMouseMove={handleMouseMove}
//             onMouseLeave={() => setIsZoomed(false)}
//             onClick={() => {
//               if (isMobile && !isVideo(product.images[activeImageIndex])) {
//                 setIsFullScreen(true);
//               }
//             }}
//           >
//             {isVideo(product.images[activeImageIndex]) ? (
//               <video
//                 src={product.images[activeImageIndex]}
//                 controls
//                 autoPlay
//                 loop
//                 muted
//                 className="w-full h-full object-contain p-4"
//               />
//             ) : (
//               <img
//                 src={product.images[activeImageIndex]}
//                 alt={product.name}
//                 className={`w-full h-full object-contain p-4 transition-transform duration-500 ease-in-out ${
//                   isZoomed && !isMobile ? "scale-110" : "scale-100"
//                 }`}
//               />
//             )}

//             {/* Desktop zoom toggle */}
//             {!isVideo(product.images[activeImageIndex]) && !isMobile && (
//               <button
//                 onClick={() => setIsZoomed(!isZoomed)}
//                 className="hidden md:flex absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-md hover:bg-white transition z-30"
//                 aria-label="Toggle zoom"
//               >
//                 {isZoomed ? (
//                   <FaSearchMinus className="text-gray-700" />
//                 ) : (
//                   <FaSearchPlus className="text-gray-700" />
//                 )}
//               </button>
//             )}

//             {/* Zoom lens background (desktop only) */}
//             {isZoomed && !isMobile && (
//               <div
//                 className="hidden md:block absolute top-0 left-0 w-full h-full cursor-none z-20"
//                 style={{
//                   backgroundImage: `url(${product.images[activeImageIndex]})`,
//                   backgroundPosition: `${mousePosition.x}% ${mousePosition.y}%`,
//                   backgroundSize: "200%",
//                 }}
//               />
//             )}

//             {/* Mobile zoom icon */}
//             {!isVideo(product.images[activeImageIndex]) && isMobile && (
//               <button
//                 onClick={() => setIsFullScreen(true)}
//                 className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition z-30"
//                 aria-label="Full screen zoom"
//               >
//                 <FaSearchPlus className="text-gray-700" />
//               </button>
//             )}

//             {/* Navigation arrows */}
//             {product.images.length > 1 && (
//               <>
//                 <button
//                   onClick={prevImage}
//                   className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-md hover:bg-white transition z-30"
//                 >
//                   <FaChevronLeft className="text-gray-700" />
//                 </button>
//                 <button
//                   onClick={nextImage}
//                   className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-md hover:bg-white transition z-30"
//                 >
//                   <FaChevronRight className="text-gray-700" />
//                 </button>
//               </>
//             )}
//           </div>

//           {/* Thumbnail grid */}
//           <div className="flex space-x-2 md:space-x-4 mt-4 overflow-x-auto pb-4">
//             {product.images.map((img, index) => (
//               <div
//                 key={index}
//                 className={`flex-shrink-0 w-16 h-16 md:w-24 md:h-24 overflow-hidden rounded-md cursor-pointer border-2 transition-all duration-300 ${
//                   activeImageIndex === index
//                     ? "border-gray-900 shadow-md"
//                     : "border-transparent hover:border-gray-400"
//                 }`}
//                 onClick={() => {
//                   setActiveImageIndex(index);
//                 }}
//               >
//                 {isVideo(img) ? (
//                   <video src={img} className="w-full h-full object-cover" />
//                 ) : (
//                   <img
//                     src={img}
//                     alt={`${product.name} thumbnail ${index}`}
//                     className="w-full h-full object-cover"
//                   />
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Product details */}
//         <div className="w-full md:w-1/2 flex flex-col p-4 md:p-0">
//           <div className="flex items-center justify-between mb-2">
//             {isNewArrival(product.createdAt) && (
//               <span className="bg-gray-200 text-gray-700 text-sm font-semibold px-3 py-1 rounded-full tracking-wide">
//                 New Arrival
//               </span>
//             )}
//             <div className="flex space-x-4 ml-auto relative">
//               <button
//                 onClick={toggleWishlist}
//                 className="relative p-2 rounded-full hover:bg-gray-100 transition"
//               >
//                 <FaHeart
//                   className={`text-2xl transition-transform duration-300 ${
//                     isWishlisted
//                       ? "text-red-500 scale-110"
//                       : "text-gray-400 hover:text-red-400"
//                   }`}
//                 />
//                 <AnimatePresence>
//                   {heartAnimation && (
//                     <motion.div
//                       initial={{ opacity: 1, y: 0, scale: 1 }}
//                       animate={{ opacity: 0, y: -40, scale: 1.5 }}
//                       exit={{ opacity: 0 }}
//                       transition={{ duration: 0.8 }}
//                       className="absolute top-0 left-1/2 -translate-x-1/2 text-red-500"
//                     >
//                       <FaHeart />
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </button>
//               <button
//                 onClick={handleShare}
//                 className="p-2 rounded-full hover:bg-gray-100 transition"
//               >
//                 <FaShareAlt className="text-2xl text-gray-400 hover:text-gray-900" />
//               </button>
//             </div>
//           </div>

//           <h1 className="text-4xl font-extrabold text-gray-900 leading-tight tracking-tight mt-2">
//             {product.name}
//           </h1>
//           <p className="text-xl font-medium text-gray-500">{product.brand}</p>

//           {dynamicRating && (
//             <div className="flex items-center mt-3">
//               {[...Array(5)].map((_, i) => (
//                 <FaStar
//                   key={i}
//                   className={`w-5 h-5 ${
//                     i < Math.floor(dynamicRating.rating)
//                       ? "text-yellow-400"
//                       : "text-gray-300"
//                   }`}
//                 />
//               ))}
//               <span className="ml-2 text-sm text-gray-500">
//                 ({dynamicRating.reviews} Reviews)
//               </span>
//             </div>
//           )}

//           <p className="mt-4 text-3xl font-bold text-gray-900">
//             ₹{selectedVariant ? selectedVariant.price : "N/A"}
//           </p>

//           <div className="mt-6">
//             <h4 className="font-semibold text-gray-800 mb-2">Select Size:</h4>
//             <div className="grid grid-cols-4 md:grid-cols-5 gap-2">
//               {product.variants.map((variant) => (
//                 <button
//                   key={variant.size}
//                   onClick={() => setSelectedVariant(variant)}
//                   className={`py-3 rounded-md font-medium transition-all duration-200 border border-gray-300 hover:border-gray-900
//                     ${
//                       selectedVariant?.size === variant.size
//                         ? "bg-gray-900 text-white"
//                         : "bg-white text-gray-800"
//                     }
//                     ${
//                       variant.countInStock <= 0
//                         ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
//                         : ""
//                     }`}
//                   disabled={variant.countInStock <= 0}
//                 >
//                   {variant.size}
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div className="mt-auto pt-8">
//             <h4 className="font-semibold text-gray-800 mb-2">Description:</h4>
//             <div className="mt-2 text-gray-700 leading-relaxed">
//               {productDescriptionParagraphs}
//             </div>
//           </div>

//           <div className="mt-8">
//             {selectedVariant && selectedVariant.countInStock > 0 ? (
//               <button
//                 onClick={handleAddToCart}
//                 className="w-full bg-gray-900 text-white font-bold py-4 rounded-md text-lg hover:bg-gray-800 transition transform shadow-lg"
//               >
//                 Add to Cart
//               </button>
//             ) : (
//               <button
//                 className="w-full bg-gray-400 text-white font-bold py-4 rounded-md text-lg cursor-not-allowed shadow-md"
//                 disabled
//               >
//                 Out of Stock
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductPage;

// // src/pages/ProductPage.js
// import React, { useState, useEffect } from "react";
// import apiClient from '../services/apiClient';
// import { useParams } from "react-router-dom";
// import { useCart } from "../context/CartContext";
// import {
//   FaHeart,
//   FaShareAlt,
//   FaStar,
//   FaChevronLeft,
//   FaChevronRight,
//   FaSearchPlus,
//   FaSearchMinus,
// } from "react-icons/fa";
// import LoadingSpinner from "../components/LoadingSpinner";
// import { motion, AnimatePresence } from "framer-motion";
// import { useAuth } from "../context/AuthContext";

// const ProductPage = () => {
//   const { id } = useParams();
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedVariant, setSelectedVariant] = useState(null);
//   const { addToCart } = useCart();
//   const [activeImageIndex, setActiveImageIndex] = useState(0);
//   const { user, wishlist, fetchWishlist } = useAuth();
//   const [isWishlisted, setIsWishlisted] = useState(false);
//   const [heartAnimation, setHeartAnimation] = useState(false);
//   const [dynamicRating, setDynamicRating] = useState(null);

//   // Desktop hover zoom
//   const [isZoomed, setIsZoomed] = useState(false);
//   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

//   // Mobile touch zoom
//   const [isTouchZoom, setIsTouchZoom] = useState(false);
//   const [touchPosition, setTouchPosition] = useState({ x: 50, y: 50 });

//   const isMobile = window.matchMedia("(pointer: coarse)").matches;

//   const reviewMap = { 6: 109, 7: 205, 8: 157, 9: 184, 10: 232, 11: 120, 12: 178, 13: 99 };

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const response = await apiClient.get(`/products/${id}`);
//         setProduct(response.data);

//         if (response.data.variants && response.data.variants.length > 0) {
//           const firstAvailableVariant = response.data.variants.find(v => v.countInStock > 0);
//           if (firstAvailableVariant) setSelectedVariant(firstAvailableVariant);

//           const size = parseInt(firstAvailableVariant?.size || 6, 10);
//           setDynamicRating({
//             rating: (Math.random() * (5 - 4) + 4).toFixed(1),
//             reviews: reviewMap[size] || 150,
//           });
//         }
//       } catch (err) {
//         setError("Product not found.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProduct();
//   }, [id]);

//   useEffect(() => {
//     if (!user) return setIsWishlisted(false);
//     setIsWishlisted(wishlist.some(item => item._id === id));
//   }, [id, user, wishlist]);

//   const handleAddToCart = () => {
//     if (!selectedVariant) return alert("Please select a size first.");
//     if (selectedVariant.countInStock <= 0) return alert("This size is out of stock.");
//     addToCart({ _id: product._id, name: product.name, images: product.images, selectedVariant });
//     alert(`${product.name} (size: ${selectedVariant.size}) added to cart!`);
//   };

//   const isVideo = url => [".mp4", ".mov", ".webm", ".ogg"].some(ext => url.endsWith(ext));
//   const nextImage = () => setActiveImageIndex((prev) => (prev + 1) % product.images.length);
//   const prevImage = () => setActiveImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
//   const toggleWishlist = async () => {
//     if (!user) return alert("Please login to use wishlist.");
//     try {
//       if (isWishlisted) await apiClient.delete(`/wishlist/${product._id}`);
//       else await apiClient.post(`/wishlist/${product._id}`);
//       await fetchWishlist();
//       setHeartAnimation(true);
//       setTimeout(() => setHeartAnimation(false), 1000);
//     } catch (err) {
//       console.error(err);
//     }
//   };
//   const handleShare = () => navigator.clipboard.writeText(window.location.href).then(() => alert("Link copied!"));

//   const handleMouseMove = e => {
//     if (!isZoomed) return;
//     const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
//     setMousePosition({ x: ((e.pageX - left) / width) * 100, y: ((e.pageY - top) / height) * 100 });
//   };

//   const handleTouchMove = e => {
//     if (!isTouchZoom) return;
//     const touch = e.touches[0];
//     const rect = e.currentTarget.getBoundingClientRect();
//     const x = ((touch.clientX - rect.left) / rect.width) * 100;
//     const y = ((touch.clientY - rect.top) / rect.height) * 100;
//     setTouchPosition({ x, y });
//   };

//   const toggleTouchZoom = () => setIsTouchZoom(!isTouchZoom);

//   if (loading) return <LoadingSpinner />;
//   if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;
//   if (!product) return null;

//   const productDescriptionParagraphs = product.description?.split("\n\n").map((p, i) => (
//     <p key={i} className="mt-4 first:mt-0 leading-relaxed text-gray-700">{p}</p>
//   ));

//   return (
//     <div className="container mx-auto px-4 py-8 md:py-16 bg-white font-sans antialiased">

//       <div className="flex flex-col md:flex-row gap-8 items-start justify-center">
//         {/* Gallery */}
//         <div className="w-full md:w-1/2 relative">
//           <div
//             className="relative w-full h-[500px] bg-gray-50 rounded-2xl shadow-xl overflow-hidden"
//             onMouseMove={handleMouseMove}
//             onMouseLeave={() => setIsZoomed(false)}
//             onTouchMove={handleTouchMove}
//           >
//             {isVideo(product.images[activeImageIndex]) ? (
//               <video src={product.images[activeImageIndex]} controls autoPlay loop muted className="w-full h-full object-contain p-4" />
//             ) : (
//               <img
//                 src={product.images[activeImageIndex]}
//                 alt={product.name}
//                 className={`w-full h-full object-contain p-4 transition-transform duration-200 ease-in-out`}
//                 style={{
//                   transform: isMobile
//                     ? isTouchZoom
//                       ? "scale(2)"
//                       : "scale(1)"
//                     : isZoomed
//                       ? "scale(1.5)"
//                       : "scale(1)",
//                   transformOrigin: isMobile
//                     ? `${touchPosition.x}% ${touchPosition.y}%`
//                     : `${mousePosition.x}% ${mousePosition.y}%`
//                 }}
//               />
//             )}

//             {/* Desktop zoom toggle */}
//             {!isVideo(product.images[activeImageIndex]) && !isMobile && (
//               <button
//                 onClick={() => setIsZoomed(!isZoomed)}
//                 className="hidden md:flex absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-md hover:bg-white transition z-30"
//               >
//                 {isZoomed ? <FaSearchMinus className="text-gray-700" /> : <FaSearchPlus className="text-gray-700" />}
//               </button>
//             )}

//             {/* Mobile touch zoom button */}
//             {!isVideo(product.images[activeImageIndex]) && isMobile && (
//               <button
//                 onClick={toggleTouchZoom}
//                 className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition z-30"
//               >
//                 <FaSearchPlus className="text-gray-700" />
//               </button>
//             )}

//             {/* Navigation arrows */}
//             {product.images.length > 1 && (
//               <>
//                 <button
//                   onClick={prevImage}
//                   className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 md:p-3 rounded-full shadow-md hover:bg-white transition z-40"
//                 >
//                   <FaChevronLeft className="text-gray-700" />
//                 </button>
//                 <button
//                   onClick={nextImage}
//                   className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 md:p-3 rounded-full shadow-md hover:bg-white transition z-40"
//                 >
//                   <FaChevronRight className="text-gray-700" />
//                 </button>
//               </>
//             )}
//           </div>

//           {/* Thumbnails */}
//           <div className="flex space-x-2 md:space-x-4 mt-4 overflow-x-auto pb-4">
//             {product.images.map((img, idx) => (
//               <div
//                 key={idx}
//                 className={`flex-shrink-0 w-16 h-16 md:w-24 md:h-24 overflow-hidden rounded-md cursor-pointer border-2 transition-all duration-300 ${activeImageIndex === idx ? "border-gray-900 shadow-md" : "border-transparent hover:border-gray-400"}`}
//                 onClick={() => setActiveImageIndex(idx)}
//               >
//                 {isVideo(img) ? <video src={img} className="w-full h-full object-cover" /> : <img src={img} alt={`thumb-${idx}`} className="w-full h-full object-cover" />}
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Product details */}
//         <div className="w-full md:w-1/2 flex flex-col p-4 md:p-0">
//           <h1 className="text-4xl font-extrabold text-gray-900 leading-tight tracking-tight mt-2">{product.name}</h1>
//           <p className="text-xl font-medium text-gray-500">{product.brand}</p>

//           {dynamicRating && (
//             <div className="flex items-center mt-3">
//               {[...Array(5)].map((_, i) => <FaStar key={i} className={`w-5 h-5 ${i < Math.floor(dynamicRating.rating) ? "text-yellow-400" : "text-gray-300"}`} />)}
//               <span className="ml-2 text-sm text-gray-500">({dynamicRating.reviews} Reviews)</span>
//             </div>
//           )}

//           <p className="mt-4 text-3xl font-bold text-gray-900">₹{selectedVariant ? selectedVariant.price : "N/A"}</p>

//           <div className="mt-6">
//             <h4 className="font-semibold text-gray-800 mb-2">Select Size:</h4>
//             <div className="grid grid-cols-4 md:grid-cols-5 gap-2">
//               {product.variants.map(v => (
//                 <button
//                   key={v.size}
//                   onClick={() => setSelectedVariant(v)}
//                   disabled={v.countInStock <= 0}
//                   className={`py-3 rounded-md font-medium transition-all duration-200 border border-gray-300 hover:border-gray-900
//                     ${selectedVariant?.size === v.size ? "bg-gray-900 text-white" : "bg-white text-gray-800"}
//                     ${v.countInStock <= 0 ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200" : ""}`}
//                 >
//                   {v.size}
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div className="mt-8">
//             {selectedVariant && selectedVariant.countInStock > 0 ? (
//               <button onClick={handleAddToCart} className="w-full bg-gray-900 text-white font-bold py-4 rounded-md text-lg hover:bg-gray-800 transition transform shadow-lg">
//                 Add to Cart
//               </button>
//             ) : (
//               <button disabled className="w-full bg-gray-400 text-white font-bold py-4 rounded-md text-lg cursor-not-allowed shadow-md">
//                 Out of Stock
//               </button>
//             )}
//           </div>

//           <div className="mt-6 text-gray-700">{productDescriptionParagraphs}</div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductPage;

// // src/pages/ProductPage.js


import React, { useState, useEffect } from "react";
import apiClient from '../services/apiClient';
import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import {
  FaHeart,
  FaShareAlt,
  FaStar,
  FaChevronLeft,
  FaChevronRight,
  FaSearchPlus,
  FaSearchMinus,
  FaRulerCombined, // New icon for Size Chart
  FaChevronDown, // New icon for collapsible section
  FaTag, // New icon for discount
} from "react-icons/fa";
import LoadingSpinner from "../components/LoadingSpinner";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";

// --- START: New Utility Component for Elegant Modal (Placeholder) ---
const LuxuryModal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-2xl font-serif font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-900 text-3xl transition">&times;</button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
};
// --- END: New Utility Component for Elegant Modal (Placeholder) ---


const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const { addToCart } = useCart();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { user, wishlist, fetchWishlist } = useAuth();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [heartAnimation, setHeartAnimation] = useState(false);
  const [dynamicRating, setDynamicRating] = useState(null);

  // New states for luxury theme features
  const [showDetails, setShowDetails] = useState(false); // For collapsible details
  const [isSizeChartModalOpen, setIsSizeChartModalOpen] = useState(false); // For Size Chart modal

  // Desktop hover zoom
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Mobile touch zoom
  const [isTouchZoom, setIsTouchZoom] = useState(false);
  const [touchPosition, setTouchPosition] = useState({ x: 50, y: 50 });

  const isMobile = window.matchMedia("(pointer: coarse)").matches;

  const reviewMap = { 6: 109, 7: 205, 8: 157, 9: 184, 10: 232, 11: 120, 12: 178, 13: 99 };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await apiClient.get(`/products/${id}`);
        const productData = response.data;
        setProduct(productData);

        if (productData.variants && productData.variants.length > 0) {
          const firstAvailableVariant = productData.variants.find(v => v.countInStock > 0);
          if (firstAvailableVariant) setSelectedVariant(firstAvailableVariant);

          // Use category/subcategory/etc. ID for a more consistent 'dynamic' rating
          const size = parseInt(firstAvailableVariant?.size || 6, 10); 
          setDynamicRating({
            rating: (Math.random() * (5 - 4) + 4).toFixed(1),
            reviews: reviewMap[size] || 150,
          });
        }
      } catch (err) {
        setError("Product not found.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (!user) return setIsWishlisted(false);
    setIsWishlisted(wishlist.some(item => item._id === id));
  }, [id, user, wishlist]);

  const handleAddToCart = () => {
    if (!selectedVariant) return alert("Please select a size first.");
    if (selectedVariant.countInStock <= 0) return alert("This size is out of stock.");
    
    // Calculate final price with discount
    const finalPrice = product.discountPercentage > 0
        ? selectedVariant.price * (1 - product.discountPercentage / 100)
        : selectedVariant.price;

    addToCart({ 
        _id: product._id, 
        name: product.name, 
        images: product.images, 
        selectedVariant: { 
            ...selectedVariant, 
            price: finalPrice.toFixed(2) // Save the discounted price to cart
        } 
    });
    alert(`${product.name} (size: ${selectedVariant.size}) added to cart!`);
  };

  const isVideo = url => [".mp4", ".mov", ".webm", ".ogg"].some(ext => url.endsWith(ext));
  const nextImage = () => setActiveImageIndex((prev) => (prev + 1) % product.images.length);
  const prevImage = () => setActiveImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  const toggleWishlist = async () => {
    if (!user) return alert("Please login to use wishlist.");
    try {
      if (isWishlisted) await apiClient.delete(`/wishlist/${product._id}`);
      else await apiClient.post(`/wishlist/${product._id}`);
      await fetchWishlist();
      setHeartAnimation(true);
      setTimeout(() => setHeartAnimation(false), 1000);
    } catch (err) {
      console.error(err);
    }
  };
  const handleShare = () => navigator.clipboard.writeText(window.location.href).then(() => alert("Link copied!"));

  const handleMouseMove = e => {
    if (!isZoomed) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    setMousePosition({ x: ((e.pageX - left) / width) * 100, y: ((e.pageY - top) / height) * 100 });
  };

  const handleTouchMove = e => {
    if (!isTouchZoom) return;
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((touch.clientX - rect.left) / rect.width) * 100;
    const y = ((touch.clientY - rect.top) / rect.height) * 100;
    setTouchPosition({ x, y });
  };

  const toggleTouchZoom = () => setIsTouchZoom(!isTouchZoom);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;
  if (!product) return null;

  // Calculate prices
  const originalPrice = selectedVariant ? selectedVariant.price : null;
  const discountPercentage = product.discountPercentage || 0;
  const hasDiscount = discountPercentage > 0;
  const discountedPrice = hasDiscount
    ? (originalPrice * (1 - discountPercentage / 100)).toFixed(2)
    : null;
  const displayPrice = discountedPrice || originalPrice || "N/A";

  // New detailed description (bullet points)
  const detailedDescriptionPoints = product.detailedDescription 
    ? (Array.isArray(product.detailedDescription) 
        ? product.detailedDescription 
        : product.detailedDescription.split(',').map(s => s.trim()).filter(Boolean)
      ) 
    : [];

  // New productDetails (More Information)
  const productDetails = product.productDetails || '';

  // Existing short description (original 'description' field)
  const productShortDescriptionParagraphs = product.description?.split("\n\n").map((p, i) => (
    <p key={i} className="mt-4 first:mt-0 leading-relaxed text-gray-700 font-light">{p}</p>
  ));


  return (
    <div className="container mx-auto px-4 py-8 md:py-12 bg-white font-serif antialiased">

      <div className="flex flex-col md:flex-row gap-10 items-start justify-center">
        {/* Gallery - Elegant Shadow and Rounded Corners */}
        <div className="w-full md:w-1/2 relative">
          {/* Main Image Container */}
          <div
            className="relative w-full h-[600px] bg-white border border-gray-100 rounded-xl shadow-2xl overflow-hidden cursor-crosshair"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setIsZoomed(false)}
            onTouchMove={handleTouchMove}
            onTouchStart={() => !isTouchZoom && !isMobile && setIsTouchZoom(true)} // Allow touch zoom on non-mobile if desired
            onTouchEnd={() => isMobile && setIsTouchZoom(false)} // Auto-unzoom on mobile tap end
          >
            <AnimatePresence>
                {isVideo(product.images[activeImageIndex]) ? (
                  <motion.video 
                    key={product.images[activeImageIndex]}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    src={product.images[activeImageIndex]} 
                    controls autoPlay loop muted 
                    className="w-full h-full object-contain p-4 transition-opacity duration-300" 
                  />
                ) : (
                  <motion.img
                    key={product.images[activeImageIndex]}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    src={product.images[activeImageIndex]}
                    alt={product.name}
                    className={`w-full h-full object-contain p-4 transition-transform duration-300 ease-in-out`}
                    style={{
                      transform: isMobile
                          ? isTouchZoom ? "scale(2.2)" : "scale(1)"
                          : isZoomed ? "scale(1.8)" : "scale(1)",
                      transformOrigin: isMobile
                          ? `${touchPosition.x}% ${touchPosition.y}%`
                          : `${mousePosition.x}% ${mousePosition.y}%`,
                    }}
                    onMouseEnter={() => !isMobile && setIsZoomed(true)}
                  />
                )}
            </AnimatePresence>
            
            {/* Discount Badge */}
            {hasDiscount && (
                <div className="absolute top-4 left-4 bg-red-600 text-white font-bold px-4 py-1 rounded-full text-sm tracking-wider shadow-xl">
                    SALE {discountPercentage}% OFF
                </div>
            )}

            {/* Zoom Toggle (Hidden on Mobile for touch interaction) */}
            {!isVideo(product.images[activeImageIndex]) && !isMobile && (
              <button
                onClick={() => setIsZoomed(!isZoomed)}
                className="hidden md:flex absolute bottom-4 right-4 bg-gray-900/80 text-white backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-gray-900 transition z-30"
              >
                {isZoomed ? <FaSearchMinus /> : <FaSearchPlus />}
              </button>
            )}

            {/* Mobile Touch Zoom Button */}
             {!isVideo(product.images[activeImageIndex]) && isMobile && (
              <button
                onClick={toggleTouchZoom}
                className="absolute bottom-4 right-4 bg-gray-900/80 text-white backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-gray-900 transition z-30"
              >
                {isTouchZoom ? <FaSearchMinus /> : <FaSearchPlus />}
              </button>
            )}

            {/* Navigation arrows - Subtle gold accent */}
            {product.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/50 backdrop-blur-sm p-3 rounded-full border border-gray-300 shadow-lg hover:bg-white transition z-40 group"
                >
                  <FaChevronLeft className="text-gray-900 group-hover:text-gold-500" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/50 backdrop-blur-sm p-3 rounded-full border border-gray-300 shadow-lg hover:bg-white transition z-40 group"
                >
                  <FaChevronRight className="text-gray-900 group-hover:text-gold-500" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails - Smaller and more refined */}
          <div className="flex space-x-3 mt-4 overflow-x-auto pb-2">
            {product.images.map((img, idx) => (
              <div
                key={idx}
                className={`flex-shrink-0 w-20 h-20 overflow-hidden rounded-lg cursor-pointer transition-all duration-300 shadow-md ${activeImageIndex === idx ? "border-2 border-gray-900 ring-2 ring-gold-500" : "border-2 border-gray-200 hover:border-gray-500"}`}
                onClick={() => setActiveImageIndex(idx)}
              >
                {isVideo(img) ? <video src={img} className="w-full h-full object-cover" /> : <img src={img} alt={`thumb-${idx}`} className="w-full h-full object-cover" />}
              </div>
            ))}
          </div>
        </div>

        {/* Product details */}
        <div className="w-full md:w-1/2 flex flex-col pt-4 md:pt-0">
          <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
            {product.brand} - {product.gender || 'Unisex'}
          </p>
          <h1 className="text-5xl font-extrabold text-gray-900 leading-tight tracking-tight mt-1">{product.name}</h1>
          <p className="text-lg font-light text-gray-500 mb-4">
            {product.subCategory?.name || product.category?.name || 'Luxury Collection'}
          </p>

          {/* Price and Rating */}
          <div className="flex items-center justify-between border-t border-b border-gray-100 py-4 mb-6">
            <div className="flex items-baseline space-x-3">
              <span className="text-4xl font-bold text-gray-900">
                ₹{displayPrice}
              </span>
              {hasDiscount && (
                <span className="text-xl font-medium text-red-500 line-through opacity-70">
                  ₹{originalPrice}
                </span>
              )}
            </div>

            {dynamicRating && (
              <div className="flex items-center">
                <div className="flex mr-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={`w-5 h-5 ${i < Math.floor(dynamicRating.rating) ? "text-gold-500" : "text-gray-300"}`} />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-500">
                  ({dynamicRating.rating} / {dynamicRating.reviews} Reviews)
                </span>
              </div>
            )}
          </div>

          {/* Size/Variant Selection */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-800 mb-3 text-lg">Select Size:</h4>
            <div className="grid grid-cols-4 md:grid-cols-5 gap-3">
              {product.variants.map(v => (
                <motion.button
                  key={v.size}
                  onClick={() => setSelectedVariant(v)}
                  disabled={v.countInStock <= 0}
                  className={`py-3 rounded-lg font-medium text-sm transition-all duration-200 border-2
                    ${selectedVariant?.size === v.size 
                        ? "bg-gray-900 text-white border-gray-900 shadow-md transform scale-105" 
                        : "bg-white text-gray-800 border-gray-300 hover:border-gray-900"}
                    ${v.countInStock <= 0 
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200 line-through opacity-70 transform-none" 
                        : ""}`}
                  whileHover={v.countInStock > 0 ? { scale: 1.05 } : {}}
                  whileTap={v.countInStock > 0 ? { scale: 0.95 } : {}}
                >
                  {v.size}
                </motion.button>
              ))}
            </div>
            {/* Size Chart Button */}
            {product.sizeChartImage && (
                <button 
                    onClick={() => setIsSizeChartModalOpen(true)} 
                    className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center transition"
                >
                    <FaRulerCombined className="mr-2" /> View Size Chart
                </button>
            )}
          </div>

          {/* Action Buttons: Add to Cart & Wishlist/Share */}
          <div className="mt-4 flex flex-col gap-4">
            {selectedVariant && selectedVariant.countInStock > 0 ? (
              <motion.button 
                onClick={handleAddToCart} 
                className="w-full bg-gray-900 text-white font-bold py-4 rounded-lg text-lg tracking-wider hover:bg-gray-800 transition transform shadow-xl border-2 border-gray-900"
                whileHover={{ scale: 1.01, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
                whileTap={{ scale: 0.99 }}
              >
                ADD TO BAG
              </motion.button>
            ) : (
              <button 
                disabled 
                className="w-full bg-gray-400 text-white font-bold py-4 rounded-lg text-lg cursor-not-allowed shadow-md"
              >
                SOLD OUT
              </button>
            )}

            <div className="flex space-x-4">
              <motion.button
                onClick={toggleWishlist}
                className={`flex-1 flex items-center justify-center p-3 rounded-lg border-2 ${isWishlisted ? "border-red-500 bg-red-50 text-red-600" : "border-gray-300 text-gray-600 hover:border-gray-500"} transition`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <AnimatePresence>
                  {heartAnimation ? (
                    <motion.div
                      key="heart-anim"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1.2, opacity: 1 }}
                      exit={{ scale: 1, opacity: 0 }}
                      transition={{ duration: 0.5, type: "spring", stiffness: 300, damping: 10 }}
                    >
                      <FaHeart className="w-5 h-5 mr-2 text-red-500" />
                    </motion.div>
                  ) : (
                    <FaHeart className={`w-5 h-5 mr-2 ${isWishlisted ? 'text-red-500' : 'text-gray-400'}`} />
                  )}
                </AnimatePresence>
                Wishlist
              </motion.button>
              <motion.button
                onClick={handleShare}
                className="flex-1 flex items-center justify-center p-3 rounded-lg border-2 border-gray-300 text-gray-600 hover:border-gray-500 transition"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaShareAlt className="w-5 h-5 mr-2" /> Share
              </motion.button>
            </div>
          </div>

          {/* Short Description */}
          <div className="mt-8">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Product Story</h3>
            {productShortDescriptionParagraphs}
          </div>

          {/* New Detailed Description (Bullet Points) */}
          {detailedDescriptionPoints.length > 0 && (
            <div className="mt-6">
              <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                <FaTag className="mr-2 text-gold-500" /> Key Features
              </h4>
              <ul className="list-disc list-inside space-y-1 pl-4 text-gray-700">
                {detailedDescriptionPoints.map((point, i) => (
                  <li key={i} className="text-sm font-light">{point}</li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Collapsible Details Section (Product Details / More Information) */}
          {(productDetails || product.category || product.subCategory) && (
            <div className="mt-8 border-t border-gray-200">
              <button 
                onClick={() => setShowDetails(!showDetails)}
                className="w-full flex justify-between items-center py-4 text-left font-semibold text-lg text-gray-900 hover:text-gray-700 transition"
              >
                More Details & Specifications
                <motion.span
                    animate={{ rotate: showDetails ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <FaChevronDown />
                </motion.span>
              </button>
              
              <AnimatePresence>
                {showDetails && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden pb-4"
                    >
                        <div className="space-y-4 text-gray-700 text-sm">
                            {/* Metadata */}
                            <div className="grid grid-cols-2 gap-2 p-2 bg-gray-50 rounded-lg">
                                <p className="font-medium">Category:</p>
                                <p className="font-light">{product.category?.name || 'N/A'}</p>
                                <p className="font-medium">SubCategory:</p>
                                <p className="font-light">{product.subCategory?.name || 'N/A'}</p>
                                <p className="font-medium">Gender:</p>
                                <p className="font-light">{product.gender || 'N/A'}</p>
                            </div>
                            
                            {/* Product Details (More Information) */}
                            {productDetails && (
                                <div className="p-2 border-l-4 border-gold-500 pl-4">
                                    <h4 className="font-medium text-gray-800 mb-2">Technical & Care Details:</h4>
                                    <p className="whitespace-pre-wrap font-light">{productDetails}</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

        </div>
      </div>
      
      {/* Size Chart Modal */}
      <LuxuryModal 
        isOpen={isSizeChartModalOpen} 
        onClose={() => setIsSizeChartModalOpen(false)} 
        title="Official Size Chart"
      >
        <p className="text-gray-600 mb-4">Refer to these measurements to find your perfect fit.</p>
        {product.sizeChartImage ? (
            <img src={product.sizeChartImage} alt="Size Chart" className="w-full h-auto object-contain max-h-[70vh] rounded-lg shadow-inner" />
        ) : (
            <p className="text-red-500">Size chart image not available.</p>
        )}
      </LuxuryModal>
      
    </div>
  );
};

export default ProductPage;