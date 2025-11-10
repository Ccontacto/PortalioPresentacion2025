import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';

import FloatingQuick from '../FloatingQuick';
import { DevProvider } from '../../contexts/DevContext';
import { LanguageProvider } from '../../contexts/LanguageContext';
import { NavigationProvider } from '../../contexts/NavigationContext';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { ToastProvider } from '../../contexts/ToastContext';

describe('FloatingQuick', () => {
  const renderWithProviders = (ui: React.ReactElement) =>
    render(
      <ToastProvider>
        <LanguageProvider>
          <ThemeProvider>
            <NavigationProvider>
              <DevProvider>{ui}</DevProvider>
            </NavigationProvider>
          </ThemeProvider>
        </LanguageProvider>
      </ToastProvider>
    );

  it('exposes aria-controls to mobile-quick-actions', () => {
    renderWithProviders(<FloatingQuick />);
    const btn = screen.getByLabelText('Abrir acciones');
    expect(btn).toHaveAttribute('aria-controls', 'mobile-quick-actions');
  });
});
