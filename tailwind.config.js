export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        SAI: {
          primary: {
            400: "#FA502E",
            100: "#FFEEEA",
          },
          layout: {
            white: "#FFFFFF",
            black: "#191D1F",
            gray: "#CCD2D8",
          },
        },
      },
      fontFamily: {
        pre: ["Pretendard", "sans-serif"],
      },
    },
  },
  plugins: [],
};
