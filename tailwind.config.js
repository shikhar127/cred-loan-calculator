/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cred-bg': '#f5f0e8',
        'cred-orange': '#d4834f',
        'cred-orange-dark': '#b8704a',
        'cred-brown': '#8b5a3c',
        'cred-brown-dark': '#5c3d28',
        'cred-tan': '#f9f6f1',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
