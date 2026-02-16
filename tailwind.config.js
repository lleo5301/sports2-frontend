const { heroui } = require('@heroui/react');

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        segoe: ['Segoe UI', 'system-ui', 'sans-serif']
      },
      colors: {
        brand: {
          DEFAULT: '#3b82f6',
          hover: '#2563eb',
          light: '#60a5fa',
          subtle: 'rgba(59, 130, 246, 0.1)'
        },
        'neutral-bg': {
          bg1: 'var(--page-bg, hsl(240, 6%, 10%))',
          bg2: 'var(--page-bg-secondary, hsl(240, 5%, 12%))',
          bg3: 'var(--page-bg-elevated, hsl(240, 5%, 14%))',
          bg4: 'hsl(240, 4%, 18%)',
          bg5: 'hsl(240, 4%, 22%)',
          bg6: 'hsl(240, 4%, 26%)'
        },
        ui: {
          primary: 'var(--color-text-primary, #FFFFFF)',
          secondary: 'var(--color-text-secondary, #A1A1AA)',
          muted: 'var(--color-text-muted, #71717A)'
        },
        'ui-border': {
          subtle: 'var(--border-subtle, hsla(0, 0%, 100%, 0.08))',
          DEFAULT: 'var(--border-default, hsla(0, 0%, 100%, 0.12))',
          strong: 'var(--border-strong, hsla(0, 0%, 100%, 0.20))'
        },
        status: {
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          info: '#3B82F6'
        },
        dataviz: {
          purple: '#8251EE',
          blue: '#3B82F6',
          green: '#10B981',
          yellow: '#F59E0B',
          red: '#EF4444',
          pink: '#EC4899',
          cyan: '#06B6D4'
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'gentle-pulse': 'gentlePulse 2s ease-in-out infinite',
        float: 'float 3s ease-in-out infinite',
        shimmer: 'shimmer 1.5s linear infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        gentlePulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        }
      },
      boxShadow: {
        'neu-sm':
          '4px 4px 8px rgba(0, 0, 0, 0.1), -4px -4px 8px rgba(255, 255, 255, 0.9)',
        'neu-md':
          '6px 6px 12px rgba(0, 0, 0, 0.1), -6px -6px 12px rgba(255, 255, 255, 0.9)',
        'neu-lg':
          '10px 10px 20px rgba(0, 0, 0, 0.1), -10px -10px 20px rgba(255, 255, 255, 0.9)',
        'neu-inset':
          'inset 4px 4px 8px rgba(0, 0, 0, 0.1), inset -4px -4px 8px rgba(255, 255, 255, 0.9)',
        glass: '0 8px 32px rgba(0, 0, 0, 0.1)',
        'glass-lg': '0 12px 48px rgba(0, 0, 0, 0.12)',
        elevated:
          '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'elevated-lg':
          '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
        glow: '0 0 20px rgba(59, 130, 246, 0.3)',
        'glow-lg': '0 0 40px rgba(59, 130, 246, 0.4)'
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem'
      },
      backdropBlur: {
        xs: '2px',
        '2xl': '40px',
        '3xl': '64px'
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
        touch: '44px'
      },
      fontSize: {
        'fluid-display': [
          'clamp(2.25rem, 5vw + 1rem, 4.5rem)',
          { lineHeight: '1.05', letterSpacing: '-0.04em' }
        ],
        'fluid-h2': [
          'clamp(1.5rem, 3vw + 0.5rem, 2.75rem)',
          { lineHeight: '1.1', letterSpacing: '-0.02em' }
        ],
        'fluid-h3': [
          'clamp(1.25rem, 2vw + 0.25rem, 1.75rem)',
          { lineHeight: '1.2' }
        ],
        'fluid-lead': [
          'clamp(1.125rem, 1.5vw + 0.5rem, 1.375rem)',
          { lineHeight: '1.6' }
        ],
        'fluid-body': [
          'clamp(0.9375rem, 0.5vw + 0.75rem, 1rem)',
          { lineHeight: '1.6' }
        ]
      }
    }
  },
  darkMode: 'class',
  plugins: [heroui()]
};
