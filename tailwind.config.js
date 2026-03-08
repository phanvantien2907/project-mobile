/** @type {import('tailwindcss').Config} */
module.exports = {
<<<<<<< HEAD
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#FFF8F2",
          100: "#FFEEDD",
          200: "#FFD9B5",
          300: "#FFC088",
          400: "#F49D4C",
          500: "#F47C20",
          600: "#D96A15",
          700: "#B85610",
          800: "#6B3A12",
          900: "#1F1A17",
        },
      },
    },
=======
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
>>>>>>> 03c3663 (update 08/03/2026)
  },
  plugins: [],
};
