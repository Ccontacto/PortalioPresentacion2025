import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import Header from '../components/organisms/Header'; // Ruta corregida
import { LanguageProvider } from '../contexts/LanguageContext';
import { NavigationProvider } from '../contexts/NavigationContext';
import { ThemeProvider } from '../contexts/ThemeContext';

describe('Header', () => {
  it('should render without errors', () => {
    render(
      <LanguageProvider>
        <ThemeProvider>
          <NavigationProvider>
            <Header />
          </NavigationProvider>
        </ThemeProvider>
      </LanguageProvider>
    );
    expect(screen.getByText('JC')).toBeInTheDocument();
  });
});
