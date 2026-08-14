/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "oklch(0.995 0.003 22)",
        surface: "oklch(0.962 0.009 22)",
        "surface-2": "oklch(0.981 0.005 22)",
        fg: "oklch(0.265 0.024 20)",
        "fg-2": "oklch(0.40 0.02 20)",
        muted: "oklch(0.538 0.017 20)",
        accent: "oklch(0.60 0.098 12)",
        "accent-deep": "oklch(0.435 0.095 8)",
        "accent-press": "oklch(0.375 0.080 8)",
        "accent-soft": "oklch(0.955 0.030 12)",
        danger: "oklch(0.485 0.205 27)",
      },
    },
  },
  plugins: [],
};
