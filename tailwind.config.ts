import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
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
          DEFAULT: "#365F37", // основной зеленый цвет
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#f3f4f6", // gray-100
          foreground: "#1f2937", // gray-800
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "#f9fafb", // gray-50
          foreground: "#6b7280", // gray-500
        },
        accent: {
          DEFAULT: "#f3f4f6", // gray-100
          foreground: "#1f2937", // gray-800
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        emerald: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
          950: "#022c22",
        },
        gold: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },
        // Добавляем собственный зеленый цвет
        "custom-green": {
          DEFAULT: "#365F37",
          50: "#EBF1EB",
          100: "#D7E3D7",
          200: "#B0C6B0",
          300: "#88AA88",
          400: "#618D61",
          500: "#365F37",
          600: "#2E512F",
          700: "#254426",
          800: "#1C361D",
          900: "#142814",
          950: "#0A140A",
        },
        // Новый акцентный цвет
        "warm-gray": {
          DEFAULT: "#A29682",
          50: "#F5F3F0",
          100: "#EBE7E1",
          200: "#D7CFC3",
          300: "#C3B7A5",
          400: "#AF9F87",
          500: "#A29682",
          600: "#8B7B68",
          700: "#6D5F4E",
          800: "#4F4334",
          900: "#31271A",
          950: "#1A150D",
        },
        // Теплые нейтральные оттенки
        "warm-neutral": {
          50: "#FDFCFA",
          100: "#FAF8F5",
          200: "#F5F1EB",
          300: "#F0EAE1",
          400: "#EBE3D7",
          500: "#E6DCCD",
          600: "#D1C3A8",
          700: "#BCAA83",
          800: "#A7915E",
          900: "#927839",
        },
      },
      borderRadius: {
        lg: "1rem",
        md: "1rem",
        sm: "1rem",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"], // Inter для основного текста
        serif: ["Georgia", "Times New Roman", "serif"],
        rubik: ["var(--font-rubik)", "sans-serif"], // Rubik для заголовков
        inter: ["var(--font-inter)", "sans-serif"],
        "days-one": ["var(--font-days-one)", "sans-serif"],
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
        "fade-in-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        shimmer: {
          "0%": {
            backgroundPosition: "-200% 0",
          },
          "100%": {
            backgroundPosition: "200% 0",
          },
        },
        float: {
          "0%, 100%": {
            transform: "translateY(0px)",
          },
          "50%": {
            transform: "translateY(-10px)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in-up": "fade-in-up 0.5s ease-out",
        shimmer: "shimmer 2s linear infinite",
        float: "float 6s ease-in-out infinite",
      },
      boxShadow: {
        "3xl": "0 35px 60px -12px rgba(0, 0, 0, 0.25)",
        warm: "0 10px 25px -3px rgba(162, 150, 130, 0.1), 0 4px 6px -2px rgba(162, 150, 130, 0.05)",
        green: "0 10px 25px -3px rgba(54, 95, 55, 0.1), 0 4px 6px -2px rgba(54, 95, 55, 0.05)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "warm-texture":
          'url(\'data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23A29682" fill-opacity="0.03"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\')',
        "green-texture":
          'url(\'data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23365F37" fill-opacity="0.05" fill-rule="evenodd"%3E%3Cpath d="m0 40l40-40h-40v40zm40 0v-40h-40l40 40z"/%3E%3C/g%3E%3C/svg%3E\')',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
