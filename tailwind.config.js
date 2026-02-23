/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.{md,mdx,json}',
  ],
  theme: {
    extend: {},
    container: {
      center: true,
      padding: '1.25rem',
      screens: {
        xl: '1200px',
        '2xl': '1200px',
      },
    },
  },
  plugins: [],
};
