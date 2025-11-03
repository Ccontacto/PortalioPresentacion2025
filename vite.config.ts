import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss(), autoprefixer()]
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
    exclude: ['jspdf'],
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
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      thresholds: {
        statements: 65,
        branches: 40,
        functions: 55,
        lines: 65
      }
    }
  }
});
