/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./script.js"
  ],
  theme: {
    extend: {
      colors: {
        cyberpunk: {
          background: '#0A1128',
          primary: '#1768AC',
          secondary: '#00FFD1',
          accent: '#5D3FD3',
          text: '#E6E6E6',
          highlight: '#00FFFF'
        }
      },
      fontFamily: {
        'cyber': ['Orbitron', 'sans-serif']
      },
      boxShadow: {
        'neon': '0 0 10px rgba(0, 255, 209, 0.5), 0 0 20px rgba(0, 255, 209, 0.3)',
        'cyber-glow': '0 0 15px rgba(87, 63, 211, 0.6)'
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s infinite',
        'flicker': 'flicker 0.1s infinite alternate'
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 }
        },
        'flicker': {
          '0%': { opacity: 0.9 },
          '100%': { opacity: 1 }
        }
      }
    },
  },
  plugins: [],
}
