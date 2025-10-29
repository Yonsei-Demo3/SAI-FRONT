export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        pre: ["Pretendard", "sans-serif"], // 🔹 Tailwind에서 font-pre로 쓸 수 있음
      },
    },
  },
  plugins: [],
};
