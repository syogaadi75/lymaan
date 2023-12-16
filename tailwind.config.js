/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  corePlugins: {},
  theme: {
    extend: {
      colors: {
        "primary-100": "#98AFC9",
        "primary-200": "#7A92AD",
        "primary-300": "#5B7490",
        "primary-400": "#3D5774",
        "primary-500": "#1E3957",
        "primary-600": "#182E46",
        "primary-700": "#122234",
        "primary-800": "#0C1723",
        "primary-900": "#060B11",
      },
    },
  },
  important: true,
  plugins: [],
};
