import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import { ensureStorageVersion } from './utils/storage';
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
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
