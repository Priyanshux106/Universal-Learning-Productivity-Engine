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
        aura: {
          bg: "#08090c",
          surface: "#0f1117",
          card: "#13151f",
          border: "#1e2130",
          primary: "#7c6af7",
          secondary: "#5b5af0",
          accent: "#a78bfa",
          glow: "#6d5dfc",
          text: "#e2e8f0",
          muted: "#64748b",
          success: "#22c55e",
          warning: "#f59e0b",
          danger: "#ef4444",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      backgroundImage: {
        "aura-gradient": "linear-gradient(135deg, #08090c 0%, #0d0e1a 50%, #08090c 100%)",
        "card-gradient": "linear-gradient(145deg, #13151f, #0f1117)",
        "primary-gradient": "linear-gradient(135deg, #7c6af7, #5b5af0)",
        "glow-gradient": "radial-gradient(circle at 50% 0%, rgba(124,106,247,0.15) 0%, transparent 70%)",
      },
      boxShadow: {
        "aura": "0 0 30px rgba(124,106,247,0.15), 0 4px 30px rgba(0,0,0,0.5)",
        "aura-lg": "0 0 60px rgba(124,106,247,0.2), 0 8px 60px rgba(0,0,0,0.6)",
        "card": "0 2px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.03)",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "shimmer": "shimmer 2s linear infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        glow: {
          from: { boxShadow: "0 0 10px rgba(124,106,247,0.3)" },
          to: { boxShadow: "0 0 30px rgba(124,106,247,0.8)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
