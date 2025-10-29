import type { Config } from "tailwindcss";
const config: Config = {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          25: "#f1f6f4",
          50: "#e7f1ee",
          100: "#d8ebe5",
          200: "#b9ddd3",
          300: "#8fcab8",
          400: "#58b497",
          500: "#006a4e", // CCU Green
          600: "#005741",
          700: "#004636",
          800: "#00352a",
          900: "#0b1443" // CCU Blue as deep accent
        },
        ccu: {
          green: "#006a4e",
          blue: "#0b1443"
        },
        ink: {
          900: "#0f172a"
        }
      },
      borderRadius: {
        xl: "0.9rem"
      },
      boxShadow: {
        soft: "0 1px 3px rgba(16, 24, 40, 0.06), 0 1px 2px rgba(16, 24, 40, 0.04)"
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: {
          from: { transform: "translateY(6px)", opacity: 0 },
          to: { transform: "translateY(0)", opacity: 1 }
        },
        pop: { from: { transform: "scale(0.98)" }, to: { transform: "scale(1)" } }
      },
      animation: {
        "fade-in": "fadeIn 300ms ease-out",
        "slide-up": "slideUp 300ms ease-out",
        pop: "pop 120ms ease-out"
      }
    }
  },
  plugins: []
};
export default config;
