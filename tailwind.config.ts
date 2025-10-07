import type { Config } from "tailwindcss";
import { heroui } from "@heroui/theme";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/components/(accordion|alert|autocomplete|avatar|badge|breadcrumbs|button|calendar|card|checkbox|chip|code|date-input|date-picker|divider|drawer|dropdown|form|input|input-otp|kbd|link|listbox|menu|modal|navbar|number-input|pagination|popover|progress|radio|scroll-shadow|select|skeleton|slider|snippet|spacer|spinner|switch|table|tabs|toast|tooltip|user|ripple).js",
  ],
  theme: {
    extend: {
      colors: {
        // Primary: 에너제틱한 주황색
        primary: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          DEFAULT: '#f97316',
          foreground: '#ffffff',
        },
        // Secondary: 보조 다크 블루
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          DEFAULT: '#64748b',
          foreground: '#ffffff',
        },
        // Success: 초록
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          DEFAULT: '#22c55e',
          foreground: '#ffffff',
        },
        // Danger: 빨강
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          DEFAULT: '#ef4444',
          foreground: '#ffffff',
        },
        // Warning: 노랑
        warning: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
          DEFAULT: '#eab308',
          foreground: '#000000',
        },
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            primary: {
              DEFAULT: "#f97316",
              foreground: "#ffffff",
            },
            secondary: {
              DEFAULT: "#64748b",
              foreground: "#ffffff",
            },
            success: {
              DEFAULT: "#22c55e",
              foreground: "#ffffff",
            },
            danger: {
              DEFAULT: "#ef4444",
              foreground: "#ffffff",
            },
            warning: {
              DEFAULT: "#eab308",
              foreground: "#000000",
            },
          },
        },
        dark: {
          colors: {
            primary: {
              DEFAULT: "#fb923c",
              foreground: "#ffffff",
            },
            secondary: {
              DEFAULT: "#475569",
              foreground: "#ffffff",
            },
            success: {
              DEFAULT: "#4ade80",
              foreground: "#000000",
            },
            danger: {
              DEFAULT: "#f87171",
              foreground: "#ffffff",
            },
            warning: {
              DEFAULT: "#facc15",
              foreground: "#000000",
            },
          },
        },
      },
    }),
  ],
};

export default config;
// export default tailwindConfig;