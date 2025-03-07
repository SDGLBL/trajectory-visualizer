/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Add any custom colors here
      },
      animation: {
        'highlight': 'highlight-pulse 1.5s ease-in-out',
      },
      keyframes: {
        'highlight-pulse': {
          '0%': { boxShadow: '0 0 0 0 rgba(59, 130, 246, 0.5)' },
          '70%': { boxShadow: '0 0 0 6px rgba(59, 130, 246, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(59, 130, 246, 0)' },
        },
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar')({ nocompatible: true }),
    require('@tailwindcss/typography'),
  ],
  important: true,
  corePlugins: {
    preflight: true, // Enable Tailwind's base styles
  },
}
