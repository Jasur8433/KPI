/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        excellent: '#22c55e',
        good: '#3b82f6',
        average: '#eab308',
        poor: '#ef4444'
      }
    }
  },
  plugins: []
};
