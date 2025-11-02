import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/postcss';

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss()]
    }
  },
  build: {
    sourcemap: false,
    target: 'es2022',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'framer-motion']
        }
      }
    }
  },
  optimizeDeps: {
    // Avoid prebundling modules that can cause sourcemap or CJS interop issues
    exclude: [
      'lucide-react',
      'core-js',
      'canvg',
      'jspdf',
      'html2canvas',
      'dompurify'
    ],
    esbuildOptions: {
      sourcemap: false,
      legalComments: 'none'
    }
  },
  resolve: {
    dedupe: ['react', 'react-dom']
  },
  test: {
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    clearMocks: true,
    css: true
  }
});
