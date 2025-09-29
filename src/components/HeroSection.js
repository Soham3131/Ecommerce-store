

import React, { useState, useEffect, Suspense } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";
import { motion } from "framer-motion";
import ShoeModel from "./ShoeModel";
import LoadingSpinner from "./LoadingSpinner";

import { HiOutlineSearch } from "react-icons/hi";
import { FaShoppingCart, FaFire } from "react-icons/fa";
import { HiOutlineUser } from "react-icons/hi";

import product5 from "../assets/product5.jpg";
import product4 from "../assets/demo2.jpg";
import product3 from "../assets/ring.webp";
import product2 from "../assets/product2.jpg";
import product1 from "../assets/iphone.webp";
import logo from "../assets/logo.png";

// preload 3D models
const shoeData = [
  {
    path: "/phone.glb",
    title: "THE ULTIMATE MOBILE EXPERIENCE",
    quote:
      "Seamless power and innovative design, integrating your digital life with unparalleled performance and beautiful display.",
    productName: "iPhone",
    productPrice: "₹12399",
    productImage: product1,
  },
  {
    path: "/airpods.glb",
    title: "IMMERSIVE AUDIO, UNWIRE YOUR SOUND",
    quote:
      "Experience crystal-clear sound, effortless setup, and all-day comfort with Active Noise Cancellation and Spatial Audio.",
    productName: "Headphones",
    productPrice: "₹2199",
    productImage: product2,
  },
  {
    path: "/ring.glb",
    title: "ETERNAL ELEGANCE, INFINITE SPARKLE",
    quote:
      "Handcrafted with precision and featuring brilliant cut gemstones, a timeless piece to cherish forever.",
    productName: "Timeless Solitaire Ring",
    productPrice: "₹4599",
    productImage: product3,
  },
  {
    path: "/skate_shoes.glb",
    title: "MASTER THE STREETS, DEFY GRAVITY",
    quote:
      "Built for durability and unparalleled board feel with a design that keeps you moving.",
    productName: "Urban Glide",
    productPrice: "₹2199",
    productImage: product5,
  },
];
shoeData.forEach((item) => useGLTF.preload(item.path));

// ✅ helper to highlight keywords in quotes
const highlightKeywords = (text, keywords) => {
  let result = text;
  keywords.forEach((word) => {
    const regex = new RegExp(`(${word})`, "gi");
    result = result.replace(
      regex,
      `<span style="
        font-weight:700;
        background: linear-gradient(90deg,#00ccff,#0066ff);
        -webkit-background-clip:text;
        -webkit-text-fill-color:transparent;
      ">$1</span>`
    );
  });
  return result;
};

const HeroSection = () => {
  const [currentShoeIndex, setCurrentShoeIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentShoeIndex((prev) => (prev + 1) % shoeData.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const currentContent = shoeData[currentShoeIndex];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery.trim()}`);
      setSearchQuery("");
      setIsSearchVisible(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const navLinks = [
    { name: "New Release", path: "/products/recent" },
    { name: "Best Seller", path: "/products/subcategory/featured" },
    { name: "Shop", path: "/products" },
    { name: "Blog", path: "/blog" },
    { name: "Contact", path: "/contact" },
  ];

  const isMobile = window.innerWidth < 768;
  const cameraPosition = isMobile ? [0, 0, 5] : [0, 0, 3.5];

  return (
    <div
      className="relative min-h-screen flex flex-col text-white overflow-hidden"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* Gradient Background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #001F3F 0%, #004080 45%, #f5f5f0 100%)",
        }}
      />

      {/* Promo bar */}
      <div className="bg-black/50 text-center py-2 text-sm relative z-20">
        SHOP NOW TO GET FREE SHIPPING AND DISCOUNT 30% ON ALL ORDERS TODAY!
      </div>

      {/* Navbar */}
      <nav className="relative z-30 w-full flex items-center justify-between px-6 py-4">
        {/* ✅ Logo + Brand */}
        {/* <div className="flex items-center space-x-3">
          <img
            src={logo}
            alt="Brand Logo"
            className="w-10 h-10 object-contain rounded-full"
          />
          <span
            className="text-2xl font-extrabold tracking-wide"
            style={{
              background: "linear-gradient(90deg, #0066ff 0%, #00ccff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontFamily: "'Montserrat', sans-serif",
            }}
          >
            SSJ Ecomm.
          </span>
        </div> */}

<div className="flex items-center space-x-3">
  <img
    src={logo}
    alt="Brand Logo"
    className="w-10 h-10 object-contain rounded-full"
  />
  {/* <span
    className="text-2xl md:text-3xl font-extrabold tracking-wide"
    style={{
      fontFamily: "'Montserrat', sans-serif",
      fontWeight: 800,
      letterSpacing: '0.05em',

      // Premium white/light gradient inside letters
      background: "linear-gradient(90deg, #ffffff 0%, #e0f2ff 50%, #cce8ff 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",

      // Subtle glow/shadow for depth
      textShadow: '0 1px 2px rgba(0,0,0,0.2)',

      // Smooth appearance
      fontSmooth: 'antialiased',
    }}
  >
    SSJ Ecomm.
  </span> */}

  <span
  className="text-2xl md:text-3xl font-bold tracking-wide"
  style={{
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: 700, // less thick but still strong
    letterSpacing: "0.05em",

    // Premium white/light gradient inside letters
    background: "linear-gradient(90deg, #ffffff 0%, #e0f2ff 50%, #cce8ff 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",

    // Subtle glow/shadow for depth
    textShadow: "0 1px 2px rgba(0,0,0,0.2)",

    fontSmooth: "antialiased",
  }}
>
  SSJ Ecomm.
</span>

</div>


        {/* Links */}
        <div className="hidden md:flex space-x-8 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="hover:text-gray-300 transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center space-x-6">
          <form
            onSubmit={handleSearch}
            className="flex items-center bg-white/10 px-3 py-1 rounded-full backdrop-blur-md"
          >
            <HiOutlineSearch className="text-gray-300 mr-2" />
            <input
              type="text"
              placeholder="Search your style"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm outline-none placeholder-gray-400 w-40 text-white"
            />
          </form>
          {user ? (
            <>
              <Link
                to={
                  user.role === "admin"
                    ? "/admin"
                    : user.role === "delivery"
                    ? "/delivery"
                    : "/myorders"
                }
              >
                <HiOutlineUser size={18} />
              </Link>
              <button
                onClick={handleLogout}
                className="hover:text-gray-300 text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="hover:text-gray-300 text-sm">
              Login
            </Link>
          )}
          <Link to="/cart">
            <FaShoppingCart size={18} />
          </Link>
        </div>

        {/* Mobile */}
        <div className="md:hidden flex items-center space-x-5">
          <button onClick={() => setIsSearchVisible((p) => !p)}>
            <HiOutlineSearch className="w-6 h-6" />
          </button>
          <Link to="/cart">
            <FaShoppingCart className="w-5 h-5" />
          </Link>
          {user ? (
            <Link
              to={
                user.role === "admin"
                  ? "/admin"
                  : user.role === "delivery"
                  ? "/delivery"
                  : "/myorders"
              }
            >
              <HiOutlineUser className="w-5 h-5" />
            </Link>
          ) : (
            <Link to="/login">
              <HiOutlineUser className="w-5 h-5" />
            </Link>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col md:flex-row flex-1 items-center justify-between px-8 md:px-20 relative z-10">
        <motion.div
          key={currentContent.title}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-xl text-center md:text-left"
        >
          <h1
            className="text-4xl md:text-6xl font-bold leading-tight mb-6"
            style={{
              color: "#ffffff",
              textShadow: "2px 4px 10px rgba(0,0,0,0.5)",
              fontFamily: "'Montserrat', sans-serif",
              letterSpacing: "1px",
            }}
          >
            {currentContent.title}
          </h1>
          <p
            className="text-lg font-medium"
            style={{
              color: "#f5f5f5",
              opacity: 0.95,
              textShadow: "1px 2px 6px rgba(0,0,0,0.4)",
              fontFamily: "'Poppins', sans-serif",
            }}
            dangerouslySetInnerHTML={{
              __html: highlightKeywords(currentContent.quote, [
                "digital life",
                "performance",
                "innovative",
                "durability",
                "elegance",
              ]),
            }}
          />
        </motion.div>

        {/* 3D Model */}
        <div className="w-full md:w-[550px] flex-1 flex items-center justify-center mt-8 md:mt-0">
          <div className="w-full h-[350px] md:h-[550px] flex items-center justify-center">
            <Suspense fallback={<LoadingSpinner />}>
              <Canvas
                camera={{ position: cameraPosition, fov: 45 }}
                className="w-full h-full"
              >
                <ambientLight intensity={1.2} />
                <directionalLight position={[5, 5, 5]} intensity={1} />
                <ShoeModel path={currentContent.path} />
                <OrbitControls
                  enableZoom={false}
                  autoRotate
                  autoRotateSpeed={2}
                />
                <Environment preset="studio" />
              </Canvas>
            </Suspense>
          </div>
        </div>
      </div>

      {/* Hot Search */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 
        backdrop-blur-xl w-[95%] md:w-3/4 rounded-t-2xl 
        p-3 md:p-4 flex items-center justify-between space-x-4 
        overflow-x-auto z-20 shadow-xl"
        style={{
          background:
            "linear-gradient(90deg, rgba(0,51,102,0.9) 0%, rgba(0,119,204,0.85) 50%, rgba(245,245,240,0.8) 100%)",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        <div className="flex items-center space-x-2 flex-shrink-0">
          <FaFire className="text-yellow-400 animate-pulseHot" />
          <span className="font-bold tracking-wide text-yellow-300">
            HOT SEARCH
          </span>
        </div>

        <div className="flex space-x-4 md:space-x-6 text-sm text-white overflow-x-auto scrollbar-hide">
          {shoeData.map((item, idx) => {
            if (!item.productImage || !item.productName || !item.productPrice)
              return null;

            return (
              <div
                key={idx}
                className="flex items-center space-x-2 min-w-[130px] max-w-[140px] 
                bg-white/15 border border-white/10 rounded-xl px-3 py-2 shadow-md 
                hover:bg-white/25 transition"
              >
                <img
                  src={item.productImage}
                  alt={item.productName}
                  className="w-[40px] h-[40px] object-contain drop-shadow-md flex-shrink-0"
                />
                <div className="overflow-hidden">
                  <p
                    className="font-medium truncate max-w-[90px]"
                    title={item.productName}
                  >
                    {item.productName}
                  </p>
                  <p className="text-gray-200">{item.productPrice}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
