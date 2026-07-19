/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#fdfbf7',
          100: '#faf6ee',
          200: '#f3ebd9',
          300: '#e8d9b8',
          400: '#d9c394',
          500: '#c9a96e',
        },
        gold: {
          50: '#fbf7ee',
          100: '#f5ecd5',
          200: '#ead8a8',
          300: '#ddbf78',
          400: '#d4a857',
          500: '#c99a3f',
          600: '#a87c33',
          700: '#855e2a',
          800: '#6b4a24',
        },
        brown: {
          50: '#f7f4f1',
          100: '#e8ddd4',
          200: '#cbb6a4',
          300: '#a8856b',
          400: '#8b6543',
          500: '#6f4a2c',
          600: '#5a3a22',
          700: '#462c1a',
          800: '#331e12',
          900: '#1f1209',
        },
        navy: {
          50: '#eef2f8',
          100: '#d5deeb',
          200: '#a9bdd6',
          300: '#6f8cb8',
          400: '#456a9a',
          500: '#2d5079',
          600: '#1f3d61',
          700: '#152e4d',
          800: '#0e2040',
          900: '#08142e',
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
