// tailwind.config.js

module.exports = {
  darkMode:'class',
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Include all JS/JSX/TS/TSX files inside src
    './public/index.html', // Include the HTML template in public
  ],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out forwards',
      },
      colors: {
        // Add your custom colors here if needed
        primary: '#1E40AF',  // Example primary color
        secondary: '#64748B',  // Example secondary color
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],  // Example font family
      },
    },
  },
  plugins: [],
};