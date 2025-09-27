

// module.exports = {
//   content: [
//     "./src/**/*.{js,jsx,ts,tsx}",
//   ],
//   theme: {
//     extend: {
//       fontFamily: {
//         poppins: ['Poppins', 'sans-serif'], // Define a custom font family
//       },
//       keyframes: {
//         fadeIn: {
//           '0%': { opacity: '0' },
//           '100%': { opacity: '1' },
//         },
//       },
//       animation: {
//         fadeIn: 'fadeIn 1.5s ease-in-out',
//       },
//     },
//   },
//   plugins: [],
// }

// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'], // Sleek body font
        montserrat: ['"Montserrat Alternates"', 'sans-serif'], // Premium bold headings
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 1.5s ease-in-out',
      },
    },
  },
  plugins: [],
}
