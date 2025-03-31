/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      skew: {
        "-10": "-10deg",
      },
    },
  },
  plugins: [],
};