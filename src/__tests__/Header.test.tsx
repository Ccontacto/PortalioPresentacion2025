import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import Header from '../components/Header';
import { LanguageProvider } from '../contexts/LanguageContext';
import { NavigationProvider } from '../contexts/NavigationContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { ToastProvider } from '../contexts/ToastContext';

describe('Header', () => {
  it('should render header and actions without errors', () => {
    render(
      <ToastProvider>
        <LanguageProvider>
          <ThemeProvider>
            <NavigationProvider>
              <Header />
            </NavigationProvider>
          </ThemeProvider>
        </LanguageProvider>
      </ToastProvider>
    );
    // Header landmark exists
    expect(screen.getByRole('banner')).toBeInTheDocument();
    // Mobile quick actions button is present (unique label)
    expect(screen.getByLabelText('Abrir menú de acciones rápidas')).toBeInTheDocument();
  });
});
