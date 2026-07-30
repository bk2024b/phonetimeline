import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#E7E9E1",
        surface: "#FFFFFF",
        ink: "#14171C",
        inksoft: "#55605A",
        line: "#C9CDBF",
        jade: "#0B8457",
        signal: "#00D26A",
        amber: "#FFB238",
        dark: "#14171C"
      },
      borderRadius: {
        DEFAULT: "10px"
      }
    }
  },
  plugins: []
};

export default config;
