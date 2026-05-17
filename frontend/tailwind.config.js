/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        'syne': ['Syne', 'sans-serif'],
        'dm-sans': ['DM Sans', 'sans-serif'],
      },
      colors: {
        'primary': '#1a1a2e',
        'secondary': '#666',
        'accent': '#667eea',
        'accent-light': '#8b83ff',
      },
      boxShadow: {
        'card': '0 4px 6px rgba(0,0,0,0.1)',
        'card-hover': '0 8px 25px rgba(0,0,0,0.15)',
      },
    },
  },
  plugins: [],
}
