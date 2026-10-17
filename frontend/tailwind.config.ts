import type { Config } from "tailwindcss";

// 色・角丸はすべて CSS 変数で指定し、globals.css の [data-theme] ごとに値を切り替える（Apple 風 / NVIDIA 風）
const v = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

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
          DEFAULT: v("ink"),
          secondary: v("ink-2"),
          tertiary: v("ink-3"),
        },
        "on-ink": v("on-ink"),
        surface: v("surface"),
        line: v("line"),
        hairline: v("hairline"),
        canvas: {
          gray: v("canvas"),
          deep: v("canvas-deep"),
          dark: "#000000",
          darkgray: "#161617",
        },
        accent: {
          DEFAULT: v("accent"),
          hover: v("accent-hover"),
          link: v("accent-link"),
          linkdark: v("accent-linkdark"),
        },
        "on-accent": v("on-accent"),
      },
      borderRadius: {
        card: "var(--r-card)",
        tile: "var(--r-tile)",
        panel: "var(--r-panel)",
        chip: "var(--r-chip)",
        ctl: "var(--r-ctl)",
        btn: "var(--r-btn)",
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
