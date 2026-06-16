import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#07111f",
        night: "#081527",
        steel: "#90a4c7",
        cyan: "#6dd3ff",
        mint: "#7dffb3",
        lime: "#d6ff56",
        coral: "#ff8a66"
      },
      boxShadow: {
        glow: "0 18px 55px rgba(109, 211, 255, 0.18)",
        card: "0 24px 80px rgba(2, 8, 23, 0.55)"
      },
      backgroundImage: {
        "hub-grid":
          "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
};

export default config;
