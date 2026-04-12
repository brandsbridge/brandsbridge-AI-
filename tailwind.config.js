/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Syne', 'Inter', 'sans-serif'],
        heading: ['Syne', 'sans-serif'],
      },
      colors: {
        // ═══ BRANDS BRIDGE AI - PREMIUM COLORS ═══
        border: '#1E2D45',
        input: '#1E2D45',
        ring: '#D4AF37',
        background: '#0A0F1E',
        foreground: '#F8FAFC',

        // Brand Colors
        brand: {
          midnight: '#020817',
          navy: '#0A0F1E',
          card: '#0D1526',
          cardHover: '#111827',
          border: '#1E2D45',
          borderLight: '#243447',
        },

        // Gold (Primary Accent)
        gold: {
          DEFAULT: '#D4AF37',
          light: '#F0C842',
          dark: '#A8892A',
          glow: 'rgba(212,175,55,0.15)',
        },

        // Teal (Action Color)
        teal: {
          DEFAULT: '#0B6E8C',
          light: '#0EA5C9',
          glow: 'rgba(11,110,140,0.2)',
        },

        // Status Colors
        emerald: '#10B981',
        red: '#EF4444',
        purple: '#7C3AED',
        orange: '#F59E0B',

        // Text Colors
        text: {
          primary: '#F8FAFC',
          secondary: '#94A3B8',
          muted: '#475569',
        },
      },
      borderRadius: {
        lg: '12px',
        md: '10px',
        sm: '8px',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
        'pulse-gold': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(212, 175, 55, 0.4)' },
          '50%': { boxShadow: '0 0 0 12px rgba(212, 175, 55, 0)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        'glow': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.6 },
        },
        'typing': {
          '0%': { width: '0' },
          '100%': { width: '100%' },
        },
        'blink': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0 },
        },
        'live-pulse': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.4 },
        },
        'fadeInUp': {
          from: { opacity: 0, transform: 'translateY(24px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        'fadeIn': {
          from: { opacity: 0, transform: 'translateY(8px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        'gradient-shift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'pulse-gold': 'pulse-gold 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'typing': 'typing 2s steps(40) infinite',
        'blink': 'blink 1s step-end infinite',
        'live-pulse': 'live-pulse 1.5s ease-in-out infinite',
        'fadeInUp': 'fadeInUp 0.4s ease forwards',
        'fadeIn': 'fadeIn 0.3s ease-in',
        'gradient-shift': 'gradient-shift 4s infinite',
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, #BF953F 0%, #FCF6BA 25%, #B38728 50%, #FBF5B7 75%, #AA771C 100%)',
        'gradient-hero': 'linear-gradient(135deg, #020817 0%, #0A0F1E 40%, #0D1A2D 70%, #020817 100%)',
        'gradient-card': 'linear-gradient(145deg, #0D1526 0%, #111827 100%)',
        'gradient-teal': 'linear-gradient(135deg, #0B6E8C 0%, #0EA5C9 100%)',
        'gradient-cta': 'linear-gradient(135deg, #0B6E8C 0%, #0A0F1E 50%, #D4AF37 100%)',
        'gradient-announcement': 'linear-gradient(90deg, #7C3AED, #0B6E8C, #7C3AED)',
      },
      boxShadow: {
        'gold': '0 0 30px rgba(212,175,55,0.2), 0 0 60px rgba(212,175,55,0.1)',
        'gold-hover': '0 0 40px rgba(212,175,55,0.3), 0 0 80px rgba(212,175,55,0.15)',
        'teal': '0 0 30px rgba(11,110,140,0.3), 8px 8px 32px rgba(11,110,140,0.2)',
        'card': '0 4px 24px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.05)',
        'glass': '0 8px 32px rgba(0,0,0,0.3)',
        'panel': '0 40px 80px rgba(0,0,0,0.6)',
      },
      backdropBlur: {
        'glass': '16px',
        'panel': '40px',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
