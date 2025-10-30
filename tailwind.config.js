export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'pastel-pink': '#FFB7DD',
        'pastel-pink-text': '#C4006B',
        'pastel-blue': '#A0E7E5',
        'pastel-blue-text': '#006B66',
        'pastel-green': '#B5EAD7',
        'pastel-green-text': '#0D5E3F',
        'pastel-lavender': '#D7E3FC',
        'neon-green': '#39FF14',
        'pastel-coral': '#FFDAC1',
        'marca-primaria': '#7B002C',
        'marca-secundaria': '#1E4DD8',
        'exito': '#166534',
        'advertencia': '#92400E',
        'error': '#B91C1C'
      },
      fontFamily: {
        heading: ['Montserrat', 'sans-serif'],
        body: ['Inter', 'sans-serif']
      },
      borderWidth: {
        '3': '3px'
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'pulse-dot': 'pulse 2s ease-in-out infinite',
        shake: 'shake 200ms ease-in-out',
        shimmer: 'shimmer 1.5s infinite'
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        pulse: {
          '0%,100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.3', transform: 'scale(0.7)' }
        },
        shake: {
          '0%,100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        }
      }
    }
  },
  plugins: []
};
