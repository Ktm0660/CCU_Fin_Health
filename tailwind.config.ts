import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#eefaf7",
          100: "#d8f3ea",
          200: "#b4e6d6",
          300: "#84d3bd",
          400: "#4eb99b",   // soft teal
          500: "#299a7f",   // primary teal
          600: "#207a64",
          700: "#1a6353",
          800: "#154f44",
          900: "#103e36"
        },
        ink: {
          900: "#0f2240"    // deep blue for headings
        }
      }
    }
  },
  plugins: []
};
export default config;
