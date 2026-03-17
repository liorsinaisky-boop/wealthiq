import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gold: {
          50:  "#FFF9E6",
          100: "#FFF0BF",
          200: "#F8E4A8",
          300: "#E8C870",
          400: "#C8A24E",
          500: "#B8923E",
          600: "#8A6E32",
          700: "#6A5228",
          800: "#4A3A1E",
          900: "#2A2012",
        },
        dark: {
          50:  "#1A1A22",
          100: "#14141C",
          200: "#0E1015",
          300: "#0B0D12",
          400: "#08090E",
          500: "#06080C",
          600: "#040608",
          700: "#020406",
          800: "#010203",
          900: "#000102",
        },
      },
      fontFamily: {
        heebo:          ["Heebo", "sans-serif"],
        sora:           ["Sora", "sans-serif"],
        "dm-sans":      ["DM Sans", "sans-serif"],
        "jetbrains-mono": ["JetBrains Mono", "monospace"],
      },
      animation: {
        "score-fill":   "scoreFill 1.5s ease-out forwards",
        "fade-up":      "fadeUp 0.5s ease-out forwards",
        "slide-rtl":    "slideRTL 0.4s ease-out forwards",
        shimmer:        "shimmer 2s linear infinite",
      },
      keyframes: {
        scoreFill: {
          "0%":   { strokeDashoffset: "283" },
          "100%": { strokeDashoffset: "var(--score-offset)" },
        },
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideRTL: {
          "0%":   { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition:  "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
