/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "oklch(0.995 0.003 22)",
        surface: "oklch(0.962 0.009 22)",
        "surface-2": "oklch(0.981 0.005 22)",
        "surface-tint": "oklch(0.948 0.020 22)",
        border: "oklch(0.923 0.011 22)",
        fg: "oklch(0.265 0.024 20)",
        "fg-2": "oklch(0.40 0.02 20)",
        muted: "oklch(0.538 0.017 20)",
        accent: "oklch(0.60 0.098 12)",
        "accent-deep": "oklch(0.435 0.095 8)",
        "accent-press": "oklch(0.375 0.080 8)",
        "accent-soft": "oklch(0.955 0.030 12)",
        danger: "oklch(0.485 0.205 27)",
      },
      fontFamily: {
        display: [
          "'Jeonnam'",
          "'MBK Corporate'",
          "'Pretendard Variable'",
          "Pretendard",
          "-apple-system",
          "sans-serif",
        ],
        body: [
          "'Jeonnam'",
          "'Pretendard Variable'",
          "Pretendard",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "sans-serif",
        ],
        brand: [
          "'MBK Corporate'",
          "'Jeonnam'",
          "'Pretendard Variable'",
          "Pretendard",
          "-apple-system",
          "sans-serif",
        ],
      },
      borderRadius: {
        xl2: "18px",
      },
      /* 폰 목업 안에서 읽기 편하도록 기본 텍스트 스케일을 1px씩 키웠습니다. */
      fontSize: {
        xs: ["13px", { lineHeight: "1.45" }],
        sm: ["15px", { lineHeight: "1.55" }],
        base: ["17px", { lineHeight: "1.6" }],
        lg: ["19px", { lineHeight: "1.5" }],
        xl: ["21px", { lineHeight: "1.45" }],
      },
    },
  },
  plugins: [],
};
