import type { Config } from "tailwindcss";

// Ink & Teal — design SoT: docs/design/design-system.md §2-§4
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./features/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        "surface-subtle": "var(--surface-subtle)",
        border: "var(--border)",
        ink: "var(--ink)",
        "ink-muted": "var(--ink-muted)",
        primary: "var(--primary)",
        "primary-hover": "var(--primary-hover)",
        "primary-subtle": "var(--primary-subtle)",
        accent: "var(--accent)",
        "status-up": "var(--status-up)",
        "status-down": "var(--status-down)",
        "status-unknown": "var(--status-unknown)",
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "14px",
      },
    },
  },
  plugins: [],
};

export default config;
