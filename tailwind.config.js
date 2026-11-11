/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#fff4ed', 100: '#ffe6d4', 200: '#ffc9a8', 300: '#ffa371',
          400: '#ff7338', 500: '#fe5011', 600: '#ef3607', 700: '#c62508',
          800: '#9d1f0f', 900: '#7e1d10',
        },
        ink: { 900: '#0b0f19', 800: '#111827', 700: '#1a2133', 600: '#252e44' },
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(254,80,17,.15), 0 10px 40px -10px rgba(254,80,17,.45)',
        card: '0 1px 2px rgba(16,24,40,.04), 0 4px 16px -4px rgba(16,24,40,.08)',
      },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        pulseRing: { '0%': { transform: 'scale(.8)', opacity: 1 }, '100%': { transform: 'scale(2.2)', opacity: 0 } },
        slideIn: { '0%': { transform: 'translateY(8px)', opacity: 0 }, '100%': { transform: 'translateY(0)', opacity: 1 } },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        pulseRing: 'pulseRing 1.6s ease-out infinite',
        slideIn: 'slideIn .35s ease-out both',
      },
    },
  },
  plugins: [],
}
