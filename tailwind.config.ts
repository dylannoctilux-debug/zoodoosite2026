import type { Config } from "tailwindcss";

const config: Config = {
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
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        // === ZooDoo Unified Brand System ===
        // Primary web palette (from stitch redesign)
        green: {
          default: "var(--zd-primary)", // Forest Green — primary web
          light: "var(--zd-primary-hover)", // Hover / interactive green
          pale: "var(--zd-surface)", // Mint surface / page bg
          low: "var(--zd-card-bg)", // Card background
          high: "var(--zd-border)", // Divider / border
        },
        // Brand originals (kept for footer, print-adjacent, warm sections)
        brown: {
          default: "var(--zd-brown)", // ZD Brown — footer bg, section headers
          light: "#8b6345", // Lighter brown
        },
        gold: {
          default: "var(--zd-gold)", // Warm Gold — accent, dividers, labels
          light: "#e8d5b0", // Light gold for hover
        },
        // CTA — Amber (web-optimized, WCAG AA pass on light bg)
        amber: {
          default: "var(--zd-amber)", // CTA button background
          dark: "var(--zd-amber-text)", // Text on amber CTA
          light: "#fff3c4", // Light amber surface
        },
        // Legacy orange kept for backward compat (maps to amber)
        orange: {
          default: "var(--zd-amber)",
          light: "#f5bf00",
        },
        gray: {
          default: "var(--zd-border)",
          light: "var(--zd-surface)",
        },
        text: {
          default: "var(--zd-text)", // Dark forest — body text
          title: "var(--zd-primary)", // Primary green — headings
          description: "var(--zd-text-muted)", // Subtle text
          gray: "var(--zd-text-muted)", // Placeholder / muted
        },
        // Cream surface (warm sections — testimonials, info blocks)
        cream: {
          default: "var(--zd-cream)",
          dark: "#f0ebe4",
        },
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
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
