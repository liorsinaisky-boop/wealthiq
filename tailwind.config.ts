import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gold: {
          50: "#FFF9E6", 100: "#FFF0BF", 200: "#FFE799", 300: "#FFDB66",
          400: "#D4A843", 500: "#C49A38", 600: "#A67C1E", 700: "#8A6518",
          800: "#6E4F12", 900: "#52390C",
        },
        dark: {
          50: "#1A1A2E", 100: "#16162A", 200: "#121226", 300: "#0E0E22",
          400: "#0A0A1E", 500: "#0A0A0F", 600: "#080810", 700: "#06060C",
          800: "#040408", 900: "#020204",
        },
      },
      fontFamily: { heebo: ["Heebo", "sans-serif"] },
      animation: {
        "score-fill": "scoreFill 1.5s ease-out forwards",
        "fade-up": "fadeUp 0.5s ease-out forwards",
        "slide-rtl": "slideRTL 0.4s ease-out forwards",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        scoreFill: {
          "0%": { strokeDashoffset: "283" },
          "100%": { strokeDashoffset: "var(--score-offset)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideRTL: {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
