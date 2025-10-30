import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Header from '../components/Header';
import { ToastProvider } from '../contexts/ToastContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { NavigationProvider } from '../contexts/NavigationContext';

describe('Header', () => {
  it('should render without errors', () => {
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
    expect(screen.getByText('JC')).toBeInTheDocument();
  });
});
