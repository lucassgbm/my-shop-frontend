/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body:    ['var(--font-body)',    'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#fff1f1',
          100: '#ffe1e1',
          200: '#ffc7c7',
          400: '#ff6b6b',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
        },
        dark: {
          50:  '#f8f8f8',
          100: '#e8e8e8',
          800: '#1c1c1e',
          900: '#111111',
          950: '#0a0a0a',
        },
      },
      animation: {
        'fade-in':    'fadeIn .4s ease forwards',
        'slide-up':   'slideUp .4s ease forwards',
        'slide-down': 'slideDown .3s ease forwards',
        'shimmer':    'shimmer 1.5s infinite',
        'float':      'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'marquee':    'marquee 25s linear infinite',
      },
      keyframes: {
        fadeIn:    { from: { opacity: '0' },                  to: { opacity: '1' } },
        slideUp:   { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideDown: { from: { opacity: '0', transform: 'translateY(-8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        shimmer:   { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        float:     { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-12px)' } },
        marquee:   { '0%': { transform: 'translateX(0%)' }, '100%': { transform: 'translateX(-50%)' } },
      },
    },
  },
  plugins: [],
};
