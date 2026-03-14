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
        background: "var(--background)",
        foreground: "var(--foreground)",
        electric: "#00BFFF",
        gold: "#F5C400",
        navy: "#0d1b2a",
        "navy-dark": "#080f18",
        chrome: "#C0C0C0",
        "chrome-light": "#E8E8E8",
      },
      fontFamily: {
        orbitron: ["Orbitron", "sans-serif"],
        exo: ["Exo 2", "sans-serif"],
      },
      backgroundImage: {
        "electric-glow": "radial-gradient(ellipse at center, rgba(0,191,255,0.15) 0%, transparent 70%)",
        "gold-glow": "radial-gradient(ellipse at center, rgba(245,196,0,0.15) 0%, transparent 70%)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 20s linear infinite",
        "float": "float 6s ease-in-out infinite",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(0,191,255,0.4), 0 0 40px rgba(0,191,255,0.2)" },
          "50%": { boxShadow: "0 0 40px rgba(0,191,255,0.8), 0 0 80px rgba(0,191,255,0.4)" },
        },
      },
      boxShadow: {
        "electric": "0 0 20px rgba(0,191,255,0.4), 0 0 40px rgba(0,191,255,0.2)",
        "electric-lg": "0 0 40px rgba(0,191,255,0.6), 0 0 80px rgba(0,191,255,0.3)",
        "gold": "0 0 20px rgba(245,196,0,0.4), 0 0 40px rgba(245,196,0,0.2)",
        "gold-lg": "0 0 40px rgba(245,196,0,0.6), 0 0 80px rgba(245,196,0,0.3)",
      },
    },
  },
  plugins: [],
};
export default config;
