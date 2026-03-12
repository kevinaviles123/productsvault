/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],

  darkMode: 'class',

  theme: {
    extend: {

      // ── Fuentes ──────────────────────────────────────────────
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        mono:    ['"DM Mono"', 'monospace'],
      },

      // ── Colores custom ────────────────────────────────────────
      colors: {
        bg:       '#09090f',
        surface:  '#0f0f1a',
        surface2: '#16162a',
        surface3: '#1c1c33',
        brand:    '#c8ff00',
        primary: {
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        success: {
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
        },
        warning: {
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
        },
        danger: {
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
        },
      },

      // ── Pantallas extra ───────────────────────────────────────
      screens: {
        xs: '475px',
      },

      // ── Espaciado ─────────────────────────────────────────────
      spacing: {
        18:  '4.5rem',
        88:  '22rem',
        128: '32rem',
      },

      // ── Bordes ────────────────────────────────────────────────
      borderRadius: {
        '4xl': '2rem',
      },

      // ── Sombras ───────────────────────────────────────────────
      boxShadow: {
        brand:  '0 0 40px rgba(200,255,0,.13)',
        card:   '0 4px 24px rgba(0,0,0,.45)',
        modal:  '0 24px 80px rgba(0,0,0,.7)',
        soft:   '0 2px 10px rgba(0,0,0,.05)',
        medium: '0 4px 20px rgba(0,0,0,.08)',
      },

      // ── Gradientes ────────────────────────────────────────────
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        'gradient-dark':    'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
      },

      // ── Z-index extra ─────────────────────────────────────────
      zIndex: {
        60:      '60',
        70:      '70',
        modal:   '1000',
        toast:   '1100',
        tooltip: '1200',
      },

      // ── Animaciones ───────────────────────────────────────────
      animation: {
        'fade-in':    'fadeIn .2s ease both',
        'fade-up':    'fadeUp .32s ease both',
        'fade-in-up': 'fadeInUp .4s ease-out',
        'slide-up':   'slideUp .3s ease-out',
        'slide-right':'slideRight .28s cubic-bezier(.22,.61,.36,1) both',
        'scale-in':   'scaleIn .2s ease-out',
        'toast-in':   'toastIn .3s ease-out',
        'modal-in':   'modalIn .3s ease-out',
        'shimmer':    'shimmer 2s infinite',
        'pulse-soft': 'pulseSoft 2s cubic-bezier(0.4,0,0.6,1) infinite',
        'pulse-dot':  'pulseDot 2.5s ease infinite',
        'spin-slow':  'spin 3s linear infinite',
        'bounce-soft':'bounceSoft 1s infinite',
        'slide-r':    'slideRight .26s cubic-bezier(.22,.61,.36,1) both',
      },

      // ── Keyframes ─────────────────────────────────────────────
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to:   { opacity: '1', transform: 'none' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          from: { transform: 'translateY(100%)' },
          to:   { transform: 'translateY(0)' },
        },
        slideRight: {
          from: { opacity: '0', transform: 'translateX(20px)' },
          to:   { opacity: '1', transform: 'none' },
        },
        scaleIn: {
          from: { transform: 'scale(0.9)', opacity: '0' },
          to:   { transform: 'scale(1)',   opacity: '1' },
        },
        toastIn: {
          from: { transform: 'translateX(100%)', opacity: '0' },
          to:   { transform: 'translateX(0)',    opacity: '1' },
        },
        modalIn: {
          from: { transform: 'scale(0.9)', opacity: '0' },
          to:   { transform: 'scale(1)',   opacity: '1' },
        },
        shimmer: {
          from: { backgroundPosition: '-1000px 0' },
          to:   { backgroundPosition:  '1000px 0' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1'   },
          '50%':      { opacity: '0.5' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '1',   transform: 'scale(1)'   },
          '50%':      { opacity: '0.3', transform: 'scale(1.7)' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)'     },
          '50%':      { transform: 'translateY(-10px)' },
        },
      },
    },
  },

  // ── Sin plugins externos para evitar conflictos ───────────────
  plugins: [],
};