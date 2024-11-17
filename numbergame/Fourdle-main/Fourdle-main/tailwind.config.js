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
          text: '#E6E6E6',
          primary: '#1768AC',
          secondary: '#00FFD1'
        }
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s infinite',
        'slide-up': 'slide-up 0.7s ease-out',
        'cyber-glitch': 'cyber-glitch 2s infinite'
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 }
        },
        'slide-up': {
          'from': { 
            opacity: 0, 
            transform: 'translateY(20px)' 
          },
          'to': { 
            opacity: 1, 
            transform: 'translateY(0)' 
          }
        },
        'cyber-glitch': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '25%': { transform: 'translate(-2px, 2px) scale(1.02)' },
          '50%': { transform: 'translate(2px, -2px) scale(0.98)' },
          '75%': { transform: 'translate(-1px, 1px) scale(1.01)' }
        }
      }
    }
  },
  plugins: []
};
