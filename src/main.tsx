
import App from '@app/App';
import ErrorBoundary from '@components/ErrorBoundary';
import { PortfolioSpecProvider } from '@contexts/PortfolioSpecContext';
import { logger } from '@utils/logger';
import { ensureStorageVersion } from '@utils/storage';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

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

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <PortfolioSpecProvider>
        <App />
      </PortfolioSpecProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(error => {
      logger.warn('Service worker registration failed', error);
    });
  });
}
