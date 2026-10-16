import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        ink: {
          DEFAULT: "#1d1d1f",
          secondary: "#6e6e73",
          tertiary: "#86868b",
        },
        canvas: {
          gray: "#f5f5f7",
          dark: "#000000",
          darkgray: "#161617",
        },
        accent: {
          DEFAULT: "#0071e3",
          hover: "#0077ed",
          link: "#0066cc",
          linkdark: "#2997ff",
        },
      },
      maxWidth: {
        content: "1920px",
        wide: "1920px",
      },
    },
  },
  plugins: [],
};
export default config;
