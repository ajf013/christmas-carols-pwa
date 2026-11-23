/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        christmas: {
          gold: '#FFD700',
          amber: '#F59E0B',
          red: '#DC2626',
          darkred: '#991B1B',
          green: '#15803D',
          darkgreen: '#064E3B',
          night: '#0B0F19',
          card: '#161F30',
          border: '#2A364F'
        }
      }
    },
  },
  plugins: [],
}
