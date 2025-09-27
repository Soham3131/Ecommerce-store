

// import React, { useEffect } from 'react'; 
// import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
// import HomePage from './pages/HomePage';
// import ProductPage from './pages/ProductPage';
// import CartPage from './pages/CartPage';

// import AdminDashboard from './pages/AdminDashboard';
// import DeliveryDashboard from './pages/DeliveryDashboard';
// import Header from './components/Header';
// import Footer from './components/Footer';
// import MyOrdersPage from './pages/MyOrdersPage';
// import CategoryProductsPage from "./pages/CategoryProductsPage";
// import AllFeaturedProductsPage from './pages/AllFeaturedProductsPage';
// import GenderProductsPage from './pages/GenderProductsPage';
// import AllRecentProductsPage from "./pages/AllRecentProductsPage";
// import ContactPage from "./pages/ContactPage";
// import AllProductsPage from "./pages/AllProductsPage";
// import SearchResultsPage from "./pages/SearchResultsPage";
// import WishlistPage from "./pages/WishlistPage"
// import LoginRegisterPage from "./pages/LoginRegisterPage";
// import PremiumShowcase from "./pages/PremiumShowcase"
// import CategorySubCategoriesPage from './pages/CategorySubCategoriesPage';
// import SubCategoryProductsPage from './pages/SubCategoryProductsPage'; // Import the new page

// // Define the ScrollToTop component
// const ScrollToTop = () => {
//   const { pathname } = useLocation();

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, [pathname]);

//   return null;
// };

// function AppLayout() {
//   const location = useLocation();

//   // Hide header only on homepage
//   const hideHeader = location.pathname === "/";

//   return (
//     <div className="flex flex-col min-h-screen">
//       <ScrollToTop />
//       {!hideHeader && <Header />}
//       <main 
//         className={`flex-grow ${hideHeader ? 'pt-0' : ''}`} // Keep this change
//       >
//         <Routes>
//           <Route path="/" element={<HomePage />} />
//           <Route path="/products" element={<AllProductsPage />} />
//           <Route path="/product/:id" element={<ProductPage />} /> {/* Product Detail Page */}
//           <Route path="/cart" element={<CartPage />} />
//           <Route path="/login" element={<LoginRegisterPage />} />
//           <Route path="/admin" element={<AdminDashboard />} />
//           <Route path="/myorders" element={<MyOrdersPage />} />
//           <Route path="/delivery" element={<DeliveryDashboard />} />
//           
//             {/* 1. MAIN CATEGORY CLICK: Show SubCategories */}
//           <Route 
//                 path="/categories/:categoryId" 
//                 element={<CategorySubCategoriesPage />} 
//             />

//             {/* 2. SUBCATEGORY CLICK: Show Products of that subcategory */}
//           <Route 
//                 path="/subcategories/:subCategoryId" 
//                 element={<SubCategoryProductsPage />} 
//             />

//             {/* ⚠️ CORRECTION/NOTE: You had this route, which looks like it should point 
//             to the new SubCategoryProductsPage or a different component.
//             I'm assuming you will replace this with the new SubCategoryProductsPage later 
//             if you aren't using AllFeaturedProductsPage for subcategory products. 
//             For now, the new route above covers the requirement. */}
//           <Route path="/products/subcategory/:subCategory" element={<AllFeaturedProductsPage />} /> 
//             
//           <Route path="/gender/:gender" element={<GenderProductsPage />} />
//           <Route path="/products/recent" element={<AllRecentProductsPage />} />
//           <Route path="/contact" element={<ContactPage />} />
//           <Route path="/search" element={<SearchResultsPage />} />
//           <Route path="/wishlist" element={<WishlistPage />} />
//           <Route path="/blog" element={<PremiumShowcase />} />

//         </Routes>
//       </main>
//       <Footer />
//     </div>
//   );
// }

// function App() {
//   return (
//     <Router>
//       <AppLayout />
//     </Router>
//   );
// }

// export default App;

// App.js

// App.js
import React, { useEffect } from 'react'; 
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';

import AdminDashboard from './pages/AdminDashboard';
import DeliveryDashboard from './pages/DeliveryDashboard';
import Header from './components/Header';
import Footer from './components/Footer';
import MyOrdersPage from './pages/MyOrdersPage';
import CategoryProductsPage from "./pages/CategoryProductsPage";
import AllFeaturedProductsPage from './pages/AllFeaturedProductsPage';
import GenderProductsPage from './pages/GenderProductsPage';
import AllRecentProductsPage from "./pages/AllRecentProductsPage";
import ContactPage from "./pages/ContactPage";
import AllProductsPage from "./pages/AllProductsPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import WishlistPage from "./pages/WishlistPage"
import LoginRegisterPage from "./pages/LoginRegisterPage";
import PremiumShowcase from "./pages/PremiumShowcase"
import CategorySubCategoriesPage from './pages/CategorySubCategoriesPage';
import SubCategoryProductsPage from './pages/SubCategoryProductsPage';

// ✅ ScrollToTop component
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function AppLayout() {
  const location = useLocation();

  // Hide header only on homepage
  const hideHeader = location.pathname === "/";

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      {!hideHeader && <Header />}

      {/* ✅ Remove ALL extra spacing on homepage */}
      <main className={`flex-grow ${hideHeader ? 'p-0 m-0' : 'pt-4'}`}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<AllProductsPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginRegisterPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/myorders" element={<MyOrdersPage />} />
          <Route path="/delivery" element={<DeliveryDashboard />} />

          {/* Category routes */}
          <Route path="/categories/:categoryId" element={<CategorySubCategoriesPage />} />
          <Route path="/categories/:categoryId/products" element={<CategoryProductsPage />} />
          <Route path="/subcategories/:subCategoryId" element={<SubCategoryProductsPage />} />

          {/* Old route */}
          <Route path="/products/subcategory/:subCategory" element={<AllFeaturedProductsPage />} /> 
          
          <Route path="/gender/:gender" element={<GenderProductsPage />} />
          <Route path="/products/recent" element={<AllRecentProductsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/blog" element={<PremiumShowcase />} />
        </Routes>
      </main>

      {/* ✅ Footer always visible */}
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
