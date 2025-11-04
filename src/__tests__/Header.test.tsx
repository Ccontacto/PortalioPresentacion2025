import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

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

it('should display retro exit action when retro mode is active', () => {
  const onExitRetro = vi.fn();
  render(
    <ToastProvider>
      <LanguageProvider>
        <ThemeProvider>
          <NavigationProvider>
            <Header retroModeEnabled onExitRetroMode={onExitRetro} />
          </NavigationProvider>
        </ThemeProvider>
      </LanguageProvider>
    </ToastProvider>
  );

  fireEvent.click(screen.getByLabelText('Abrir menú de acciones'));
  const retroAction = screen.getByRole('menuitem', { name: 'Salir de modo retro' });
  fireEvent.click(retroAction);
  expect(onExitRetro).toHaveBeenCalledTimes(1);
});
