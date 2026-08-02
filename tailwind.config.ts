import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // --- Tokens historiques, encore utilises par l'admin (theme clair) ---
        bg: "#E7E9E1",
        surface: "#FFFFFF",
        ink: "#14171C",
        inksoft: "#55605A",
        line: "#C9CDBF",
        jade: "#0B8457",
        signal: "#00D26A",
        amber: "#FFB238",
        dark: "#14171C",

        // --- Nouveau design system du site public (theme sombre premium) ---
        night: "#0B0B0C", // fond de page
        panel: "#141416", // surface (header, sections)
        card: "#1A1A1D", // fond des cartes
        hairline: "rgba(255,255,255,0.08)", // bordures
        muted: "#9CA3AF" // texte secondaire
        // "signal" (#00D26A) reste l'accent, deja defini ci-dessus
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"]
      },
      borderRadius: {
        DEFAULT: "10px"
      }
    }
  },
  plugins: []
};

export default config;
