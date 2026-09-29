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
        paper: {
          DEFAULT: "#F4EFE6",
          light: "#FCFAF6",
          dark: "#E8E2D5",
          border: "#D8D0C0",
          borderDark: "#C5BCAB",
        },
        ink: {
          DEFAULT: "#1B2621",
          light: "#34443C",
          muted: "#5B6770",
          faint: "#889590",
        },
        forest: {
          DEFAULT: "#1F4D3A",
          hover: "#2A644C",
          dark: "#143527",
          faint: "#EBF3EF",
        },
        surveyRed: {
          DEFAULT: "#B3372A",
          hover: "#CA3E30",
          faint: "#FDF0EE",
          border: "#E89B92",
        },
        ochre: {
          DEFAULT: "#C9922E",
          hover: "#DC9F33",
          faint: "#FEF7EA",
          border: "#E9C88C",
        },
        slate: {
          DEFAULT: "#5B6770",
          faint: "#EFF2F4",
        },
        night: {
          DEFAULT: "#101A15",
          surface: "#17231E",
          card: "#1E2D27",
          border: "#283C34",
          borderLight: "#354E44",
        },
      },
      fontFamily: {
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-ibm-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-ibm-mono)", "monospace"],
        hindi: ["var(--font-noto-hindi)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "2px",
        sm: "2px",
        md: "4px",
        lg: "4px",
        none: "0px",
      },
      boxShadow: {
        hairline: "0 0 0 1px var(--hairline-color, rgba(27, 38, 33, 0.15))",
        stamp: "0 0 0 2px #B3372A, inset 0 0 0 1px #B3372A",
      },
    },
  },
  plugins: [],
};

export default config;
