import type {Config} from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        muted: "hsl(var(--muted))",
        border: "hsl(var(--border))",
        ink: "hsl(var(--ink))",
        clay: "hsl(var(--clay))",
        mist: "hsl(var(--mist))",
        sage: "hsl(var(--sage))",
        line: "hsl(var(--line))"
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"]
      },
      boxShadow: {
        soft: "0 24px 70px rgba(43, 42, 38, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
