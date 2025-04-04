/** @type {import('tailwindcss').Config} */
module.exports = {
  // Indicate dark mode is controlled via class (can be toggled by apps)
  darkMode: ["class"],
  // Glob pattern to scan for Tailwind classes within the ui package's source
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
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
         // Colores basados en la app de delivery
         primary: {
           DEFAULT: "#F07167", // Color Acento Principal
           foreground: "#FFFFFF", // Texto sobre el color primario
           50: "#FEF2F1",
           100: "#FDE6E2",
           200: "#FACCCA",
           300: "#F7B3B0",
           400: "#F38984",
           500: "#F07167", // Base
           600: "#D64E45",
           700: "#B33A33",
           800: "#8F2B26",
           900: "#6C241D",
         },
         secondary: {
           DEFAULT: "#00AFB9", // Color complementario
           foreground: "#FFFFFF",
           50: "#E0F7F8",
           100: "#B3EFF2",
           200: "#80E5E9",
           300: "#4DDBE1",
           400: "#26CADB",
           500: "#00AFB9",
           600: "#008F97",
           700: "#006F76",
           800: "#005054",
           900: "#003033",
         },
         background: "#FFFFFF",
         foreground: "#0F172A",
         muted: {
           DEFAULT: "#F1F5F9",
           foreground: "#64748B",
         },
         accent: {
           DEFAULT: "#FEDBA8", // Acento suave (color complementario)
           foreground: "#804C00",
         },
         destructive: {
           DEFAULT: "#EF4444",
           foreground: "#FFFFFF",
         },
         success: {
           DEFAULT: "#10B981",
           foreground: "#FFFFFF",
         },
         warning: {
           DEFAULT: "#F59E0B",
           foreground: "#FFFFFF",
         },
         border: "hsl(var(--border))",
         input: "hsl(var(--input))",
         ring: "hsl(var(--ring))",
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} 