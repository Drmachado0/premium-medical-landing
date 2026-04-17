import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['"Instrument Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Instrument Serif"', '"Fraunces"', 'Georgia', 'serif'],
        display: ['"Instrument Serif"', 'Georgia', 'serif'],
      },
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
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        ochre: {
          50:  "hsl(34 55% 94%)",
          100: "hsl(33 60% 85%)",
          200: "hsl(33 62% 74%)",
          300: "hsl(32 64% 63%)",
          400: "hsl(32 65% 52%)",
          500: "hsl(32 65% 52%)",
          600: "hsl(30 62% 44%)",
          700: "hsl(28 58% 34%)",
          800: "hsl(26 52% 24%)",
          900: "hsl(24 45% 14%)",
          DEFAULT: "hsl(32 65% 52%)",
        },
        oxblood: {
          50:  "hsl(10 40% 92%)",
          100: "hsl(10 45% 80%)",
          200: "hsl(10 50% 66%)",
          300: "hsl(10 52% 54%)",
          400: "hsl(10 55% 44%)",
          500: "hsl(10 55% 40%)",
          600: "hsl(9 55% 32%)",
          700: "hsl(8 52% 25%)",
          800: "hsl(8 48% 18%)",
          900: "hsl(8 42% 12%)",
          DEFAULT: "hsl(10 55% 40%)",
        },
        graphite: {
          50:  "hsl(28 10% 22%)",
          100: "hsl(28 10% 19%)",
          200: "hsl(28 11% 16%)",
          300: "hsl(28 11% 14%)",
          400: "hsl(28 12% 12%)",
          500: "hsl(28 12% 10%)",
          600: "hsl(28 12% 8%)",
          700: "hsl(28 13% 6%)",
          800: "hsl(28 14% 4%)",
          900: "hsl(28 15% 3%)",
          DEFAULT: "hsl(28 12% 8%)",
        },
        /* Aliases for backward compat with existing components */
        gold: {
          50:  "hsl(34 55% 94%)",
          100: "hsl(33 60% 85%)",
          200: "hsl(33 62% 74%)",
          300: "hsl(32 64% 63%)",
          400: "hsl(32 65% 52%)",
          500: "hsl(32 65% 52%)",
          600: "hsl(30 62% 44%)",
          700: "hsl(28 58% 34%)",
          800: "hsl(26 52% 24%)",
          900: "hsl(24 45% 14%)",
          DEFAULT: "hsl(32 65% 52%)",
        },
        navy: {
          50:  "hsl(28 10% 22%)",
          100: "hsl(28 10% 19%)",
          200: "hsl(28 11% 16%)",
          300: "hsl(28 11% 14%)",
          400: "hsl(28 12% 12%)",
          500: "hsl(28 12% 10%)",
          600: "hsl(28 12% 8%)",
          700: "hsl(28 13% 6%)",
          800: "hsl(28 14% 4%)",
          900: "hsl(28 15% 3%)",
          DEFAULT: "hsl(28 12% 8%)",
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
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "confetti-fall": {
          "0%": { 
            transform: "translateY(0) rotate(0deg)",
            opacity: "1"
          },
          "100%": { 
            transform: "translateY(100vh) rotate(720deg)",
            opacity: "0"
          },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shimmer: "shimmer 2s infinite",
        "confetti-fall": "confetti-fall 3s ease-out forwards",
        "fade-in": "fade-in 0.4s ease-out forwards",
        "scale-in": "scale-in 0.5s ease-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;