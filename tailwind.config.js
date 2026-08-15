/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory: {
          DEFAULT: '#FFFDF8',
          50: '#FFFDF8',
          100: '#FDF9F0',
          200: '#F8F4EC',
          300: '#F2EAD8',
          400: '#EBD9B8',
        },
        coffee: {
          DEFAULT: '#7A4B2E',
          50: '#F5EDE6',
          100: '#E8D5C4',
          200: '#C9A888',
          300: '#A6845C',
          400: '#7A4B2E',
          500: '#5C3A24',
          600: '#4A2C17',
          700: '#3D2312',
          800: '#2E1A0E',
          900: '#1F1209',
        },
        gold: {
          DEFAULT: '#D4A24C',
          50: '#FBF7EE',
          100: '#F5ECD5',
          200: '#EAD8A8',
          300: '#DDC078',
          400: '#D4A24C',
          500: '#C99A3F',
          600: '#A87C33',
          700: '#855E2A',
          800: '#6B4A24',
          900: '#4A3418',
        },
        slate: {
          DEFAULT: '#6B7280',
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        script: ['"Great Vibes"', 'cursive'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(70, 44, 26, 0.08)',
        'card': '0 8px 30px -4px rgba(70, 44, 26, 0.12)',
        'glow': '0 0 40px -8px rgba(201, 154, 63, 0.4)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
    },
  },
  plugins: [],
};
