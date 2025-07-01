/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Objeto añadido para registrar la nueva fuente
      fontFamily: {
        elegant: ['"Playfair Display"', 'serif'],
      },
    },
  },
  plugins: [],
}
