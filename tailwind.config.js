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
        mytheme2: {
          primary: "#000000",

          secondary: "#17c4aa",

          accent: "#a736db",

          neutral: "#1a1a1a",

          "base-100": "#ffffff",
          "base-200": "#f7e8d3",

          info: "#3863eb",
          "info-content": "#d1e0ff",

          success: "#21a249",
          "success-content": "#bdffd5",

          warning: "#9D5407",

          error: "#F3305D",
        },
        mytheme: {
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

          warning: "#9D5407",

          error: "#F3305D",
        },
      },
      "light",
      "dark",
      "cupcake",
      "bumblebee",
      "emerald",
      "corporate",
      "synthwave",
      "retro",
      "cyberpunk",
      "valentine",
      "halloween",
      "garden",
      "forest",
      "aqua",
      "lofi",
      "pastel",
      "fantasy",
      "wireframe",
      "black",
      "luxury",
      "dracula",
      "cmyk",
      "autumn",
      "business",
      "acid",
      "lemonade",
      "night",
      "coffee",
      "winter",
    ],
  },
};
