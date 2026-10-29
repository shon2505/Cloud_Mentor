import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Aurora Accent Palette
        aurora: {
          teal: "#17D6C5",
          cyan: "#38BDF8",
          blue: "#438AFF",
          violet: "#8557F7",
          magenta: "#E56BEF",
        },
        // Dark theme surfaces & text
        dark: {
          bg: "#080B18",
          secondary: "#10162A",
          elevated: "#171F35",
          surface: "#10162A",
          sidebar: "#0C1022",
          border: "rgba(255, 255, 255, 0.08)",
          primary: "#F4F7FF",
          muted: "#A5B0C8",
          hover: "#1A233D",
        },
        // Light theme surfaces & text
        light: {
          bg: "#F7F9FF",
          secondary: "#FFFFFF",
          elevated: "#EEF2FF",
          surface: "#FFFFFF",
          sidebar: "#F1F4FD",
          border: "rgba(0, 0, 0, 0.08)",
          primary: "#172033",
          muted: "#657089",
          hover: "#E8EDFC",
        },
        // Brand Accent
        accent: {
          DEFAULT: "#438AFF",
          hover: "#3376E6",
          teal: "#17D6C5",
          cyan: "#38BDF8",
          violet: "#8557F7",
          magenta: "#E56BEF",
          terracotta: "#C96442",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        soft: "0 2px 8px -2px rgba(0, 0, 0, 0.05), 0 1px 4px -1px rgba(0, 0, 0, 0.03)",
        card: "0 4px 20px -4px rgba(0, 0, 0, 0.05)",
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.25)",
        "aurora-glow": "0 0 40px -10px rgba(67, 138, 255, 0.35)",
        "aurora-teal": "0 0 30px -5px rgba(23, 214, 197, 0.3)",
      },
      animation: {
        "aurora-slow": "aurora-drift 24s ease-in-out infinite alternate",
        "aurora-reverse": "aurora-drift-reverse 28s ease-in-out infinite alternate",
        "pulse-subtle": "pulse-subtle 4s ease-in-out infinite",
      },
      keyframes: {
        "aurora-drift": {
          "0%": { transform: "translate(0%, 0%) scale(1) rotate(0deg)" },
          "50%": { transform: "translate(6%, 8%) scale(1.08) rotate(4deg)" },
          "100%": { transform: "translate(-5%, -4%) scale(0.96) rotate(-3deg)" },
        },
        "aurora-drift-reverse": {
          "0%": { transform: "translate(0%, 0%) scale(1.05) rotate(0deg)" },
          "50%": { transform: "translate(-8%, 5%) scale(0.95) rotate(-5deg)" },
          "100%": { transform: "translate(4%, -7%) scale(1.07) rotate(3deg)" },
        },
        "pulse-subtle": {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "0.9" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
