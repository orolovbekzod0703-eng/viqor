/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#0B1B3B',
          50:  '#F2F4F9',
          100: '#E4E8F1',
          200: '#C3CCDF',
          300: '#8E9CBE',
          400: '#586C9A',
          500: '#2F467A',
          600: '#1A2D5B',
          700: '#0B1B3B',
          800: '#08152E',
          900: '#050E1F'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif']
      },
      boxShadow: {
        soft: '0 4px 20px -6px rgba(15, 23, 42, 0.08)',
        card: '0 2px 10px -4px rgba(15, 23, 42, 0.06)'
      },
      borderRadius: { xl2: '1.25rem' }
    }
  },
  plugins: []
}
