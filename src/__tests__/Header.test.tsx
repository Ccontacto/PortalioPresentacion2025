import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import Header from '../components/Header';
import { LanguageProvider } from '../contexts/LanguageContext';
import { NavigationProvider } from '../contexts/NavigationContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { ToastProvider } from '../contexts/ToastContext';

describe('Header', () => {
  const renderHeader = () =>
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

  it('should render header and actions without errors', () => {
    renderHeader();
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByLabelText('Abrir menú de acciones rápidas')).toBeInTheDocument();
  });

  it('toggles Konami quick action label when pressed', async () => {
    renderHeader();

    const [desktopActionsButton] = screen.getAllByLabelText('Abrir menú de acciones');
    fireEvent.click(desktopActionsButton);

    const menu = await screen.findByRole('menu', { name: 'Acciones rápidas' });
    const konamiAction = within(menu).getByRole('menuitem', { name: /activar modo (retro|konami)/i });
    fireEvent.click(konamiAction);

    fireEvent.click(desktopActionsButton);
    const updatedMenu = await screen.findByRole('menu', { name: 'Acciones rápidas' });

    expect(
      within(updatedMenu).getByRole('menuitem', { name: /salir de modo (retro|konami)/i })
    ).toBeInTheDocument();
  });
});
