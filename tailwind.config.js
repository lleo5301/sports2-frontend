/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      // Custom user-friendly themes
      {
        "ocean-breeze": {
          "primary": "#0ea5e9",
          "secondary": "#14b8a6", 
          "accent": "#06b6d4",
          "neutral": "#64748b",
          "base-100": "#f8fafc",
          "base-200": "#e2e8f0",
          "base-300": "#cbd5e1",
          "base-content": "#1e293b",
          "info": "#0ea5e9",
          "success": "#10b981",
          "warning": "#f59e0b",
          "error": "#ef4444",
        },
      },
      {
        "sunset-glow": {
          "primary": "#f97316",
          "secondary": "#f59e0b",
          "accent": "#ea580c",
          "neutral": "#78716c",
          "base-100": "#fef7ed",
          "base-200": "#fed7aa",
          "base-300": "#fdba74",
          "base-content": "#451a03",
          "info": "#0ea5e9",
          "success": "#10b981",
          "warning": "#f59e0b",
          "error": "#ef4444",
        },
      },
      {
        "forest-mist": {
          "primary": "#16a34a",
          "secondary": "#22c55e",
          "accent": "#84cc16",
          "neutral": "#6b7280",
          "base-100": "#f0fdf4",
          "base-200": "#dcfce7",
          "base-300": "#bbf7d0",
          "base-content": "#14532d",
          "info": "#0ea5e9",
          "success": "#10b981",
          "warning": "#f59e0b",
          "error": "#ef4444",
        },
      },
      {
        "lavender-dreams": {
          "primary": "#8b5cf6",
          "secondary": "#a855f7",
          "accent": "#c084fc",
          "neutral": "#6b7280",
          "base-100": "#faf5ff",
          "base-200": "#f3e8ff",
          "base-300": "#e9d5ff",
          "base-content": "#581c87",
          "info": "#0ea5e9",
          "success": "#10b981",
          "warning": "#f59e0b",
          "error": "#ef4444",
        },
      },
      // Original tropical theme
      {
        tropical: {
          "primary": "#3b82f6",
          "secondary": "#f59e0b",
          "accent": "#10b981",
          "neutral": "#6b7280",
          "base-100": "#ffffff",
          "info": "#3abff8",
          "success": "#36d399",
          "warning": "#fbbd23",
          "error": "#f87272",
        },
      },
      "light",
      "dark",
    ],
  },
} 