/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          wine: '#8B2E2E',
          whiskey: '#B8860B',
          cocktails: '#2C5F3F',
          spirits: '#4A90A4',
          champagne: '#D4AF37',
          beer: '#C17C28',
          cream: '#FAF9F7',
          stone: '#E8E6E3',
          charcoal: '#2A2A2A',
          slate: '#6B6B6B'
        },
        fontFamily: {
          sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
          serif: ['Georgia', 'Times New Roman', 'serif']
        }
      },
    },
    plugins: [],
  }