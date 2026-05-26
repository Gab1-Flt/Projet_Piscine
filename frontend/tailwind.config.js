/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Premium JDM-inspired performance tuning colors
        carbon: {
          950: '#0A0A0B',
          900: '#121214',
          800: '#1A1A1E',
          700: '#2A2A30',
          300: '#A1A1AA',
          100: '#F4F4F5'
        },
        redline: {
          DEFAULT: '#E53E3E', // Classic high-rev redline accent
          hover: '#C53030'
        },
        driftgold: {
          DEFAULT: '#D69E2E', // Anodized wheel bronze/gold accent
          hover: '#B7791F'
        }
      },
      fontFamily: {
        // High-end racing aesthetics fonts
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
