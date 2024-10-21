/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.vue',
  ],
  theme: {
    extend: {
      spacing: {
        '128': '40rem',
      }
    },
  },
  plugins: [],
}