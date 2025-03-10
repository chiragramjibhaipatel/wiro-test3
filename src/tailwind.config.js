/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: {
    preflight: false, // Disables all base styles
  },
  important: true,
  content: ["../**/*.liquid"],
  theme: {
    screens: {
      'sm': '640px',
      'tablet': '768px',
      'md': '868px',
    },
    extend: {},
  },
  plugins: [],
  prefix: "custom-",
};

