

// import React from 'react';
// import HeroSection from '../components/HeroSection';
// import FeaturedProducts from "../components/FeaturedProducts"
// import CategorySlider from '../components/CategorySlider';
// import ShopByGender from '../components/ShopByGender'; 
// import RecentProducts from '../components/RecentProducts';
// import VisitInStoreSection from "../components/VisitInStoreSection"
// import TestimonialSlider from '../components/TestimonialSlider';
// import apiClient from '../services/apiClient';



// const HomePage = () => {
//   return (
//     <div>
//       <HeroSection />
//       <CategorySlider/>
//       <FeaturedProducts/>
//       <ShopByGender/>
//       <RecentProducts/>
     
//       <TestimonialSlider/>
//        <VisitInStoreSection/>
//       {/* You can add other components for products, categories, etc. below the hero section */}
//       {/* <section className="p-8">
      
        
//       </section> */}
//     </div>
//   );
// };

// export default HomePage;

// src/pages/HomePage.js (FULL FILE)

import React from 'react';
import HeroSection from '../components/HeroSection';
import FeaturedProducts from "../components/FeaturedProducts"
import CategorySlider from '../components/CategorySlider';
import ShopByGender from '../components/ShopByGender'; 
import RecentProducts from '../components/RecentProducts';
import VisitInStoreSection from "../components/VisitInStoreSection"
import TestimonialSlider from '../components/TestimonialSlider';
import apiClient from '../services/apiClient'; // Not used, but kept for context

const HomePage = () => {
  return (
    <> 
      <HeroSection />
      <CategorySlider/>
      <FeaturedProducts/>
      <ShopByGender/>
      <RecentProducts/>
     
      <TestimonialSlider/>
      <VisitInStoreSection/>
    </>
  );
};

export default HomePage;