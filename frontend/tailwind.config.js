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
      },
      colors: {
        customRed: '#b85042',
        customBlue: {
          300: '#34495e',
          button: '#1671D7',
          hover: '#1a82e2'
        },
        boxGrey: 'rgba(255, 255, 255, 0.7)'
      },
      borderWidth: {
        DEFAULT: '1px',
        '2e': '0.2em'
      }
    },
  },
  plugins: [],
}