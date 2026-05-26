/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Premium JDM-inspired performance tuning colors from Stitch Design System
        primary: {
          DEFAULT: '#bb86fc', // Electric Violet
          glow: 'rgba(187, 134, 252, 0.3)',
          dark: '#7743b5'
        },
        secondary: {
          DEFAULT: '#ffb2bc', // Racing Red / Pink
          glow: 'rgba(255, 178, 188, 0.3)',
          dark: '#7e273b'
        },
        tertiary: {
          DEFAULT: '#17deca', // Tokyo Neon Cyan
          glow: 'rgba(23, 222, 202, 0.3)',
          dark: '#00b2a1'
        },
        carbon: {
          950: '#131313', // Matches Stitch surface background
          900: '#1c1b1b', // surface-container-low
          800: '#201f1f', // surface-container
          700: '#2a2a2a', // surface-container-high
          600: '#353534', // surface-container-highest
          300: '#cdc3d4', // on-surface-variant
          100: '#e5e2e1'  // on-surface
        },
        redline: {
          DEFAULT: '#E53E3E',
          hover: '#C53030'
        },
        driftgold: {
          DEFAULT: '#D69E2E',
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
