/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        "xxs-m": "275px",
        "xs-m": "320px",
        "sm-m": "375px",
        "md-m": "425px",
        "lg-m": "490px",
      },
      colors: {
        background: "#001219",
        primary: "#19212e",
        secondary: "#334756",
        accent: "#295270",
        box: "#1d2d44",
      },
    },
  },
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
  plugins: [require("daisyui")],
};
