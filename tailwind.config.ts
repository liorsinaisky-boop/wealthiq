import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        tangerine: {
          50:  "#FFF3F0",
          100: "#FFE4D6",
          200: "#FFC299",
          300: "#FFA05C",
          400: "#FF8533",
          500: "#FF6B00",
          600: "#CC5600",
          700: "#994000",
          800: "#662B00",
          900: "#331500",
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
        serif:          ["Playfair Display", "Frank Ruhl Libre", "serif"],
        "jetbrains-mono": ["JetBrains Mono", "monospace"],
      },
      animation: {
        "score-fill":   "scoreFill 1.5s ease-out forwards",
        "fade-up":      "fadeUp 0.5s ease-out forwards",
        "slide-rtl":    "slideRTL 0.4s ease-out forwards",
        shimmer:        "shimmer 2s linear infinite",
        "pulse-glow":   "pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shake:          "shake 0.4s ease-in-out",
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
        pulseGlow: {
          "0%, 100%": { opacity: "1", boxShadow: "0 0 24px rgba(255,107,0,0.15)" },
          "50%": { opacity: "0.85", boxShadow: "0 0 48px rgba(255,107,0,0.4)" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%, 60%": { transform: "translateX(-4px)" },
          "40%, 80%": { transform: "translateX(4px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
