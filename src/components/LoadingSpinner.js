

import React from "react";
import loaderGif from "../assets/loader.gif";
import load from "../assets/load.gif"

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full p-4">
      {/* Loader Icon */}
      <img
        src={load}
        alt="Loading..."
        className="w-28 h-28 md:w-36 md:h-36 animate-pulse mb-4 drop-shadow-md"
      />

      {/* Loading Text */}
      <p className="font-serif text-lg sm:text-xl md:text-2xl text-center leading-snug">
        <span className="block font-semibold bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-transparent bg-clip-text">
          Good things take time
        </span>
        <span className="block mt-1 text-gray-600 text-sm sm:text-base">
          Please wait...
        </span>
      </p>
    </div>
  );
};

export default LoadingSpinner;
