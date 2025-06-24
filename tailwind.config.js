/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        danger: {
          green: '#10b981',
          orange: '#f59e0b',
          red: '#ef4444'
        }
      }
    },
  },
  plugins: [],
}