/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        surface: {
          50: '#f8f9ff',
          100: '#e8eaff',
          200: '#c5c8e8',
          300: '#8e93b8',
          400: '#5a5f85',
          500: '#363b5e',
          600: '#282d4a',
          700: '#1e2240',
          800: '#161a33',
          900: '#0f1228',
          950: '#0a0d1e',
        },
        accent: {
          red: '#ef4444',
          blue: '#3b82f6',
          green: '#22c55e',
          yellow: '#eab308',
          purple: '#a855f7',
          pink: '#ec4899',
          cyan: '#06b6d4',
          orange: '#f97316',
        },
        type: {
          normal: '#A8A77A', fighting: '#C22E28', flying: '#A98FF3',
          poison: '#A33EA1', ground: '#E2BF65', rock: '#B6A136',
          bug: '#A6B91A', ghost: '#735797', steel: '#B7B7CE',
          fire: '#EE8130', water: '#6390F0', grass: '#7AC74C',
          electric: '#F7D02C', psychic: '#F95587', ice: '#96D9D6',
          dragon: '#6F35FC', dark: '#705746', fairy: '#D685AD',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        /** Page titles / tooling headers (ui-ux-pro-max + design-system/pkhex-web) */
        display: ['Fira Code', 'JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'pulse-glow': 'pulseGlow 2s infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(10px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideInRight: { '0%': { opacity: '0', transform: 'translateX(20px)' }, '100%': { opacity: '1', transform: 'translateX(0)' } },
        pulseGlow: { '0%, 100%': { boxShadow: '0 0 5px rgba(99,102,241,0.3)' }, '50%': { boxShadow: '0 0 20px rgba(99,102,241,0.6)' } },
        float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
