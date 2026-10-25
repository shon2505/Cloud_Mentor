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
        // Light theme tokens
        light: {
          bg: "#FAF9F5",
          sidebar: "#F0EEE6",
          surface: "#FFFFFF",
          border: "#E5E2D8",
          primary: "#1F1E1D",
          muted: "#73726C",
          hover: "#EAE7DD",
        },
        // Dark theme tokens
        dark: {
          bg: "#262624",
          sidebar: "#1F1E1D",
          surface: "#30302E",
          border: "#3E3E3A",
          primary: "#F5F4EE",
          muted: "#9E9C96",
          hover: "#383835",
        },
        // Claude-style Terracotta Accent
        accent: {
          DEFAULT: "#C96442",
          hover: "#B5573A",
          light: "#FDF5F2",
          dark: "#3B221B",
          subtle: "#F4DDD4",
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
      },
    },
  },
  plugins: [],
};

export default config;
