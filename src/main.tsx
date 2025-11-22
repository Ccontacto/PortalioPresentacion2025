
import App from '@app/App';
import ErrorBoundary from '@components/ErrorBoundary';
import LandingPlaceholder from '@components/LandingPlaceholder';
import { PortfolioSpecProvider } from '@contexts/PortfolioSpecContext';
import { logger } from '@utils/logger';
import { ensureStorageVersion } from '@utils/storage';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './styles/themes.css';
import './styles/global.css';

const normalizeMountPath = (value?: string | null) => {
  if (!value || value === '/') return '/';
  let next = value.trim();
  if (!next.startsWith('/')) {
    next = `/${next}`;
  }
  return next.replace(/\/+$/, '') || '/';
};

const portfolioMountPath = normalizeMountPath(import.meta.env.VITE_PORTFOLIO_MOUNT);

const isPortfolioRoute = (mountPath: string) => {
  if (mountPath === '/') return true;
  const current = window.location.pathname.replace(/\/+$/, '');
  return current === mountPath || current.startsWith(`${mountPath}/`);
};

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found. Ensure that <div id="root"></div> is present in index.html.');
}

ensureStorageVersion(1, [
  'portfolio_theme',
  'portfolio_theme_konami',
  'portfolio_lang',
  'portfolio_availability',
  'portfolio_dev_ids'
]);

const shouldRenderPortfolio = isPortfolioRoute(portfolioMountPath);

const tree = shouldRenderPortfolio ? (
    <PortfolioSpecProvider>
      <App />
    </PortfolioSpecProvider>
  ) : (
    <LandingPlaceholder portfolioPath={portfolioMountPath} />
  );

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ErrorBoundary>{tree}</ErrorBoundary>
  </React.StrictMode>
);

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(error => {
      logger.warn('Service worker registration failed', error);
    });
  });
}
