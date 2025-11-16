/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Tema Café Limón - Paleta profesional y minimalista
        primary: {
          DEFAULT: '#8B4513', // Marrón café
          50: '#F5EBE6',
          100: '#E8D4C8',
          200: '#D1A991',
          300: '#BA7F5A',
          400: '#A35F38',
          500: '#8B4513',
          600: '#6F370F',
          700: '#53290B',
          800: '#371A07',
          900: '#1B0D04',
        },
        secondary: {
          DEFAULT: '#DAA520', // Dorado limón
          50: '#FCF7E8',
          100: '#F8ECD0',
          200: '#F1D9A1',
          300: '#EAC672',
          400: '#E3B343',
          500: '#DAA520',
          600: '#AF841A',
          700: '#836313',
          800: '#58420D',
          900: '#2C2106',
        },
        accent: {
          DEFAULT: '#F4A460', // Sandy brown
          50: '#FEF5EF',
          100: '#FCEADF',
          200: '#F9D5BE',
          300: '#F7C09E',
          400: '#F5AF7D',
          500: '#F4A460',
          600: '#F18A35',
          700: '#DD6A0D',
          800: '#A34F09',
          900: '#6A3406',
        },
        neutral: {
          50: '#FEFEFE',  // Blanco suave
          100: '#F8F8F8',
          200: '#E8E8E8',
          300: '#D1D1D1',
          400: '#9B9B9B',
          500: '#6B6B6B', // Gris medio
          600: '#4A4A4A',
          700: '#2C2C2C', // Gris oscuro
          800: '#1A1A1A',
          900: '#0A0A0A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 16px rgba(0, 0, 0, 0.08)',
        'strong': '0 8px 24px rgba(0, 0, 0, 0.12)',
      },
      borderRadius: {
        'DEFAULT': '8px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-soft': 'pulseSoft 2s infinite',
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
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
}
