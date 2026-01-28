import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Nokia 1100 Palette (Dark Mode Remix)
        nokia: {
          bg: "#050a04",       // Deep olive-black (Body)
          screen: "#101f0e",   // Screen BG (unlit pixels)
          primary: "#78e02f",  // Nokia Backlight Green (Active)
          dim: "#3a5c20",      // Dimmed olive
          highlight: "#253b16", // Selection background
        },
      },
      borderRadius: {
        lg: "4px",
        md: "3px",
        sm: "2px",
      },
      fontFamily: {
        mono: ["var(--font-vt323)", "monospace"],
        sans: ["var(--font-vt323)", "monospace"], // Enforce mono everywhere
      },
      keyframes: {
        "blink": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        "scanline": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        }
      },
      animation: {
        "blink": "blink 1s step-end infinite",
        "scanline": "scanline 8s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
