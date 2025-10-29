/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: [
        'Pretendard',
        'ui-sans-serif',
        'system-ui',
        '-apple-system',
        'Segoe UI',
        'Roboto',
        'Noto Sans KR',
        'Apple SD Gothic Neo',
        'Malgun Gothic',
        'Helvetica Neue',
        'Arial',
        'sans-serif',
      ],
    },
    extend: {},
  },
  plugins: [],
};
