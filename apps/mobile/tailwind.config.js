/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,tsx,ts,jsx}', './src/**/*.{js,tsx,ts,jsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        surface: {
          50: '#f8f9ff', 100: '#e8eaff', 200: '#c5c8e8',
          300: '#8e93b8', 400: '#5a5f85', 500: '#363b5e',
          600: '#282d4a', 700: '#1e2240', 800: '#161a33',
          900: '#0f1228', 950: '#0a0d1e',
        },
      },
    },
  },
  plugins: [],
};
