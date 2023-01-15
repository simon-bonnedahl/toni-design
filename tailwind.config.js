/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          primary: "#000000",

          secondary: "#66666E",

          accent: "#a736db",

          neutral: "#9999a1",

          "base-100": "#f4f4f6",
          "base-200": "#e6e6e9",

          info: "#3863eb",
          "info-content": "#d1e0ff",

          success: "#21a249",
          "success-content": "#bdffd5",

          warning: "#daad59",

          error: "#F3305D",
        },
      },

      "business",
    ],
  },
};
