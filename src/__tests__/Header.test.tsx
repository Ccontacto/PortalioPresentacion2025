import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
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

it('should display retro exit action when retro mode is active', async () => {
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

  const [desktopActionsButton] = screen.getAllByLabelText('Abrir menú de acciones');
  fireEvent.click(desktopActionsButton);
  const menu = await screen.findByRole('menu', { name: 'Acciones rápidas' });
  const itemLabels = within(menu)
    .getAllByRole('menuitem')
    .map(element => element.textContent?.trim());
  // eslint-disable-next-line no-console
  console.log('menu items:', itemLabels);
  expect(itemLabels).toContain('Salir de modo retro');
  const retroActionButton = within(menu).getByRole('menuitem', { name: /salir de modo retro/i });
  fireEvent.click(retroActionButton);
  expect(onExitRetro).toHaveBeenCalledTimes(1);
});
