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
        aura: { // Keeping the object name 'aura' to avoid massive find-replace in classes, but changing values to light theme
          bg: "#ffffff",
          surface: "#ffffff",
          card: "#ffffff",
          border: "#e2e8f0",
          primary: "#1d4ed8",
          secondary: "#3b82f6",
          accent: "#60a5fa",
          glow: "#93c5fd",
          text: "#0f172a",
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
        "aura-gradient": "linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #f8fafc 100%)",
        "card-gradient": "linear-gradient(145deg, #ffffff, #f8fafc)",
        "primary-gradient": "linear-gradient(135deg, #2563eb, #1d4ed8)",
        "glow-gradient": "radial-gradient(circle at 50% 0%, rgba(37,99,235,0.05) 0%, transparent 70%)",
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
