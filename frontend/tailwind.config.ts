import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "hsl(var(--primary))",
        accent: "hsl(var(--accent))",
        foreground: "hsl(var(--foreground))",
        background: "hsl(var(--background))",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
