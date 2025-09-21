/** @type {import('tailwindcss').Config} */
import tailwindAnimate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx,js,jsx}",
    "./public/**/*.html",
    "./backend/resources/views/**/*.php",
  ],
  theme: {
    extend: {
      colors: {
        border: '#f2aa38',
      },
    },
  },
  plugins: [tailwindAnimate],
};

