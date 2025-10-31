const plugin = require('tailwindcss/plugin');

module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // Habilita el modo oscuro basado en clases
  theme: {
    extend: {
      // =======================================================================
      // TOKENS DE DISEÑO SEMÁNTICOS (Basado en DTCG)
      // =======================================================================
      colors: {
        // --- Grupo: Texto ---
        'text-primary': 'var(--color-text-primary)',
        'text-muted': 'var(--color-text-muted)',
        'text-inverse': 'var(--color-text-inverse)',

        // --- Grupo: Superficie (Backgrounds) ---
        'surface-base': 'var(--color-surface-base)',
        'surface-alt': 'var(--color-surface-alt)',
        'surface-raised': 'var(--color-surface-raised)',

        // --- Grupo: Marca (Brand) ---
        'brand-primary': 'var(--color-brand-primary)',
        'brand-hover': 'var(--color-brand-hover)',
        'brand-active': 'var(--color-brand-active)',

        // --- Grupo: Estado (State) ---
        'state-success': 'var(--color-state-success)',
        'state-warning': 'var(--color-state-warning)',
        'state-danger': 'var(--color-state-danger)',
        'state-info': 'var(--color-state-info)',

        // --- Grupo: Borde (Border) ---
        'border-default': 'var(--color-border-default)',
        'border-subtle': 'var(--color-border-subtle)',

        // --- Grupo: Foco (Focus) ---
        'focus-ring': 'var(--color-focus-ring)',
      },
      fontFamily: {
        // --- Grupo: Tipografía ---
        sans: ['Inter', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif'],
      },
      fontSize: {
        'xs': '0.75rem',   // 12px
        'sm': '0.875rem',  // 14px
        'base': '1rem',      // 16px
        'lg': '1.125rem', // 18px
        'xl': '1.25rem',  // 20px
        '2xl': '1.5rem',   // 24px
        '3xl': '1.875rem', // 30px
        '4xl': '2.25rem',  // 36px
        '5xl': '3rem',     // 48px
      },
      fontWeight: {
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
      },
      borderRadius: {
        // --- Grupo: Radio ---
        'sm': '0.25rem',
        'md': '0.5rem',
        'lg': '0.75rem',
        'xl': '1rem',
        'pill': '9999px',
      },
      boxShadow: {
        // --- Grupo: Sombra ---
        'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      },
      transitionDuration: {
        // --- Grupo: Movimiento ---
        fast: '120ms',
        base: '200ms',
        slow: '320ms',
      },
      transitionTimingFunction: {
        // --- Grupo: Movimiento ---
        out: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [
    plugin(function({ addBase }) {
      addBase({
        // =======================================================================
        // DEFINICIÓN DE VARIABLES CSS PARA TEMATIZACIÓN (Light, Dark, High-Contrast)
        // =======================================================================
        ':root': {
          // --- MODO CLARO (Por defecto) ---
          '--color-text-primary': '#111827', // Gray 900
          '--color-text-muted': '#6B7280',   // Gray 500
          '--color-text-inverse': '#F9FAFB',  // Gray 50
          '--color-surface-base': '#FFFFFF',
          '--color-surface-alt': '#F9FAFB',  // Gray 50
          '--color-surface-raised': '#FFFFFF',
          '--color-brand-primary': '#2563EB', // Blue 600
          '--color-brand-hover': '#1D4ED8',   // Blue 700
          '--color-brand-active': '#1E40AF',  // Blue 800
          '--color-state-success': '#16A34A', // Green 600
          '--color-state-warning': '#F59E0B', // Amber 500
          '--color-state-danger': '#DC2626',  // Red 600
          '--color-state-info': '#3B82F6',    // Blue 500
          '--color-border-default': '#D1D5DB',// Gray 300
          '--color-border-subtle': '#E5E7EB', // Gray 200
          '--color-focus-ring': '#3B82F6',
        },
        '.dark': {
          // --- MODO OSCURO ---
          '--color-text-primary': '#F9FAFB',
          '--color-text-muted': '#9CA3AF',
          '--color-text-inverse': '#111827',
          '--color-surface-base': '#121212',
          '--color-surface-alt': '#1F2937',
          '--color-surface-raised': '#374151',
          '--color-brand-primary': '#3B82F6',
          '--color-brand-hover': '#60A5FA',
          '--color-brand-active': '#93C5FD',
          '--color-state-success': '#22C55E',
          '--color-state-warning': '#FBBF24',
          '--color-state-danger': '#F87171',
          '--color-state-info': '#60A5FA',
          '--color-border-default': '#4B5563',
          '--color-border-subtle': '#374151',
          '--color-focus-ring': '#60A5FA',
        },
        // Opcional: Modo de alto contraste
        '[data-theme="high-contrast"]': {
          '--color-text-primary': '#000000',
          '--color-text-muted': '#000000',
          '--color-surface-base': '#FFFFFF',
          '--color-border-default': '#000000',
          // etc.
        }
      });
    }),
  ],
};
