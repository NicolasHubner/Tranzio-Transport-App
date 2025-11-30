/** @type {import("tailwindcss").Config} */
module.exports = {
  content: ["./src/**/*.tsx", "./App.tsx"],
  theme: {
    extend: {
      colors: {
        "blue-light": "#F2F9FF",
        "regal-blue": "#034881",
        "gray-neutral": "#717171",
      },
      borderWidth: {
        3: "3px",
      },
    },
  },
  plugins: [],
};
