import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  plugins: [react()],
  // Integración de la configuración de PostCSS
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
  build: {
    sourcemap: false,
    target: 'es222',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'framer-motion']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['framer-motion', 'lucide-react']
  },
  test: {
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    clearMocks: true,
    css: true
  }
});
