
import React from 'react';
import { Link } from 'react-router-dom';
import { BsArrowRight } from 'react-icons/bs';
import { motion } from 'framer-motion';

// Import your gender-specific images
// Make sure to add these images to your src/assets folder
import maleImage from '../assets/male.jpg';
import femaleImage from '../assets/female.jpg';
import unisexImage from '../assets/unisex.jpg';
import boysImage from '../assets/boys.jpg';
import girlsImage from '../assets/girls.jpg';

const genderOptions = [
    { name: 'Male', image: maleImage, path: 'male' },
    { name: 'Female', image: femaleImage, path: 'female' },
    { name: 'Unisex', image: unisexImage, path: 'unisex' },
    { name: 'Boys', image: boysImage, path: 'boys' },
    { name: 'Girls', image: girlsImage, path: 'girls' },
];

const ShopByGender = () => {
    // Framer Motion variants for staggered animations
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 100,
            },
        },
    };

    return (
        <section className="py-20 bg-gradient-to-br from-purple-50 via-white to-indigo-50">
            <div className="container mx-auto px-4">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-5xl font-extrabold text-center text-gray-900 mb-12"
                >
                    Shop by Gender
                </motion.h2>
                <motion.div
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    {genderOptions.map((gender, index) => (
                        <motion.div
                            key={gender.name}
                            variants={itemVariants}
                        >
                            <Link 
                                to={`/gender/${gender.path}`}
                                className="group relative block overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                            >
                                <motion.img
                                    src={gender.image}
                                    alt={gender.name}
                                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                                    whileHover={{ scale: 1.1 }}
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-end justify-start p-6 transition-all duration-300 group-hover:bg-black/60">
                                    <div className="flex justify-between w-full items-center">
                                        <h3 className="text-2xl font-bold text-white uppercase drop-shadow-md">
                                            {gender.name}
                                        </h3>
                                        <BsArrowRight className="text-white text-3xl transform translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default ShopByGender;