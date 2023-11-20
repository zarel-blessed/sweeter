/**
 * @format
 * @type {import('tailwindcss').Config}
 */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dark_soul: "var(--clr-dark--soul)",
        pure_soul: "var(--clr-pure--soul)",
        custom_gray: "var(--clr-custom--gray)",
        essence01: "var(--clr-essence--01)",
        essence02: "var(--clr-essence--02)",
        essence02_dark: "var(--clr-essence--02__dark)",
      },
      fontFamily: {
        inter: "Inter, sans-serif",
      },
    },
  },
  plugins: [],
};
