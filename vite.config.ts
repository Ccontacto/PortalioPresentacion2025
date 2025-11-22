import path from 'node:path';

import tailwindcss from '@tailwindcss/postcss';
import react from '@vitejs/plugin-react';
import autoprefixer from 'autoprefixer';
import { defineConfig } from 'vite';

const normalizeBasePath = (value?: string | null) => {
  if (!value || value === '/') {
    return '/';
  }
  let next = value.trim();
  if (!next.startsWith('/')) {
    next = `/${next}`;
  }
  if (!next.endsWith('/')) {
    next = `${next}/`;
  }
  return next;
};

const basePath = normalizeBasePath(process.env.PORTFOLIO_BASE_PATH ?? process.env.VITE_PORTFOLIO_MOUNT ?? '/');

export default defineConfig({
  base: basePath,
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
    alias: {
      '@app': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@contexts': path.resolve(__dirname, 'src/contexts'),
      '@constants': path.resolve(__dirname, 'src/constants'),
      '@content': path.resolve(__dirname, 'src/content'),
      '@data': path.resolve(__dirname, 'src/data'),
      '@design-system': path.resolve(__dirname, 'src/design-system'),
      '@i18n': path.resolve(__dirname, 'src/i18n'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@sections': path.resolve(__dirname, 'src/sections'),
      '@telemetry': path.resolve(__dirname, 'src/telemetry'),
      '@portfolio-types': path.resolve(__dirname, 'src/types/portfolio.ts'),
      '@utils': path.resolve(__dirname, 'src/utils')
    },
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
