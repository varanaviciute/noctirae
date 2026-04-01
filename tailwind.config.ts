import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dream: {
          50:  "#f5f3ff",
          100: "#ede9ff",
          200: "#ddd6ff",
          300: "#c4b8f5",
          400: "#a899e8",
          500: "#8b78d0",
          600: "#6437ff",
          700: "#4a0df7",
          800: "#3c0ace",
          900: "#2d0990",
          950: "#1a0560",
        },
        midnight: {
          DEFAULT: "#0a0614",
          50: "#0e0920",
          100: "#12102d",
          200: "#1a1640",
        },
      },
      backgroundImage: {
        "dream-gradient": "linear-gradient(135deg, #0a0614 0%, #12102d 50%, #1a0e3a 100%)",
        "card-gradient": "linear-gradient(135deg, rgba(100,55,255,0.1) 0%, rgba(180,100,255,0.05) 100%)",
        "glow-purple": "radial-gradient(ellipse at center, rgba(100,55,255,0.3) 0%, transparent 70%)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        glow: {
          "0%": { boxShadow: "0 0 20px rgba(100,55,255,0.3)" },
          "100%": { boxShadow: "0 0 40px rgba(100,55,255,0.6), 0 0 80px rgba(100,55,255,0.2)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
