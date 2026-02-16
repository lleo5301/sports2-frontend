/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'gentle-pulse': 'gentlePulse 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 1.5s linear infinite'
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
        'neu-sm': '4px 4px 8px rgba(0, 0, 0, 0.1), -4px -4px 8px rgba(255, 255, 255, 0.9)',
        'neu-md': '6px 6px 12px rgba(0, 0, 0, 0.1), -6px -6px 12px rgba(255, 255, 255, 0.9)',
        'neu-lg': '10px 10px 20px rgba(0, 0, 0, 0.1), -10px -10px 20px rgba(255, 255, 255, 0.9)',
        'neu-inset': 'inset 4px 4px 8px rgba(0, 0, 0, 0.1), inset -4px -4px 8px rgba(255, 255, 255, 0.9)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.1)',
        'glass-lg': '0 12px 48px rgba(0, 0, 0, 0.12)',
        'elevated': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'elevated-lg': '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)'
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem'
      },
      backdropBlur: {
        'xs': '2px',
        '2xl': '40px',
        '3xl': '64px'
      }
    }
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      // Custom user-friendly themes
      {
        'ocean-breeze': {
          'primary': '#0ea5e9',
          'secondary': '#14b8a6',
          'accent': '#06b6d4',
          'neutral': '#64748b',
          'base-100': '#f8fafc',
          'base-200': '#e2e8f0',
          'base-300': '#cbd5e1',
          'base-content': '#1e293b',
          'info': '#0ea5e9',
          'success': '#10b981',
          'warning': '#f59e0b',
          'error': '#ef4444'
        }
      },
      {
        'sunset-glow': {
          'primary': '#f97316',
          'secondary': '#f59e0b',
          'accent': '#ea580c',
          'neutral': '#78716c',
          'base-100': '#fef7ed',
          'base-200': '#fed7aa',
          'base-300': '#fdba74',
          'base-content': '#451a03',
          'info': '#0ea5e9',
          'success': '#10b981',
          'warning': '#f59e0b',
          'error': '#ef4444'
        }
      },
      {
        'forest-mist': {
          'primary': '#16a34a',
          'secondary': '#22c55e',
          'accent': '#84cc16',
          'neutral': '#6b7280',
          'base-100': '#f0fdf4',
          'base-200': '#dcfce7',
          'base-300': '#bbf7d0',
          'base-content': '#14532d',
          'info': '#0ea5e9',
          'success': '#10b981',
          'warning': '#f59e0b',
          'error': '#ef4444'
        }
      },
      {
        'lavender-dreams': {
          'primary': '#8b5cf6',
          'secondary': '#a855f7',
          'accent': '#c084fc',
          'neutral': '#6b7280',
          'base-100': '#faf5ff',
          'base-200': '#f3e8ff',
          'base-300': '#e9d5ff',
          'base-content': '#581c87',
          'info': '#0ea5e9',
          'success': '#10b981',
          'warning': '#f59e0b',
          'error': '#ef4444'
        }
      },
      // Original tropical theme
      {
        tropical: {
          'primary': '#3b82f6',
          'secondary': '#f59e0b',
          'accent': '#10b981',
          'neutral': '#6b7280',
          'base-100': '#ffffff',
          'info': '#3abff8',
          'success': '#36d399',
          'warning': '#fbbd23',
          'error': '#f87272'
        }
      },
      'light',
      'dark'
    ]
  }
};
