

import React from "react";
import { IoLocationOutline } from "react-icons/io5"; // For the store icon
import storeImage from "../assets/place.jpg"; // Make sure this path is correct

const VisitInStoreSection = () => {
  return (
    <section className="w-full bg-gradient-to-br from-white to-gray-50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Left Section: Image */}
          <div className="w-full md:w-1/2 h-80 md:h-[450px] relative">
            <img
              src={storeImage}
              alt="Neeman's physical store interior"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          </div>

          {/* Right Section: Content */}
          <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 text-center md:text-left flex flex-col justify-center items-center md:items-start">
            <div className="mb-6">
              <IoLocationOutline className="text-5xl text-gray-700 mx-auto md:mx-0 mb-4" />
              <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
                Experience Us Live: <br /> Visit Our Showrooms!
              </h2>
            </div>

            <p className="text-lg text-gray-600 mb-8 max-w-lg">
              Discover our exquisite collections firsthand. We're also available
              at our physical locations. Find a store near you and step into
              comfort and style!
            </p>

            <div>
              <a
                href="https://www.google.com/search?q=ssj+ecommerce"
                target="_blank"
                rel="noopener noreferrer"
                className="relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold
                           bg-gray-800 text-white rounded-full shadow-lg hover:shadow-xl
                           transition-all duration-300 transform hover:-translate-y-1 group
                           focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span className="relative z-10">Find Nearest Stores</span>
                <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300 animate-shimmer"></span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisitInStoreSection;
