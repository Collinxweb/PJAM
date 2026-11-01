/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Baloo 2'", "sans-serif"],
        body: ["'Nunito'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
