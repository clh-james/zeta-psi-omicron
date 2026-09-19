import type { Config } from "tailwindcss";

// Design tokens — Zeta Psi Omicron National Member Information System
// Palette drawn from fraternity regalia: an engraved-medal look, not a SaaS theme.
//   Onyx            #0B0B0D   — primary dark ground (chapter halls, formalwear)
//   Onyx Raised     #16161A   — card/panel surface on Onyx
//   Regalia Gold    #C9A227   — the metal of pins, seals, cords
//   Regalia Gold Lt #E4C765   — hover/highlight state of gold
//   Brotherhood Maroon #7A1330 — the cord/sash accent, used sparingly for alerts/status
//   Parchment       #F3EFE6   — light-mode ground / certificate paper
//   Parchment Ink   #1E1B16   — light-mode text
//   Steel Line      #2B2B30   — hairline dividers on Onyx

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        onyx: {
          DEFAULT: "hsl(var(--onyx))",
          raised: "hsl(var(--onyx-raised))",
          line: "hsl(var(--onyx-line))",
        },
        gold: {
          DEFAULT: "hsl(var(--gold))",
          light: "hsl(var(--gold-light))",
          dim: "hsl(var(--gold-dim))",
        },
        maroon: {
          DEFAULT: "hsl(var(--maroon))",
          light: "hsl(var(--maroon-light))",
          dim: "hsl(var(--maroon-dim))",
        },
        parchment: {
          DEFAULT: "hsl(var(--parchment))",
          ink: "hsl(var(--parchment-ink))",
          muted: "hsl(var(--parchment-muted))",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "seal-radial":
          "radial-gradient(circle at center, rgba(201,162,39,0.14) 0%, rgba(201,162,39,0) 70%)",
        "engrave-line":
          "linear-gradient(90deg, transparent, rgba(201,162,39,0.6), transparent)",
      },
      borderRadius: {
        card: "0.375rem",
      },
      boxShadow: {
        emboss: "inset 0 1px 0 0 rgba(255,255,255,0.04), 0 1px 3px rgba(0,0,0,0.6)",
        "gold-ring": "0 0 0 1px rgba(201,162,39,0.4)",
      },
      keyframes: {
        "seal-in": {
          "0%": { opacity: "0", transform: "scale(0.9) rotate(-4deg)" },
          "100%": { opacity: "1", transform: "scale(1) rotate(0deg)" },
        },
      },
      animation: {
        "seal-in": "seal-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
