import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { NavigationProvider } from '../../contexts/NavigationContext';
import { ThemeProvider } from '../../contexts/ThemeContext';
// Forzar reduce motion en pruebas para evitar estados intermedios animados
vi.mock('../../hooks/useReducedMotion', () => ({ useReducedMotion: () => true }));
import Dock from '../Dock';
import '@testing-library/jest-dom/vitest';

// Mock the language data
const mockData = {
  nav: [
    { id: 'home', label: 'Home' },
    { id: 'experience', label: 'Experience' },
    { id: 'skills', label: 'Skills' },
  ],
  // Add other necessary mock data if components need it
};

// Mock useLanguage hook
vi.mock('../../contexts/LanguageContext', async () => {
    const actual = await vi.importActual('../../contexts/LanguageContext');
    return {
        ...actual as object,
        useLanguage: () => ({
            data: mockData,
            currentLang: 'es',
            toggleLanguage: () => {},
        }),
    };
});

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider>
        <NavigationProvider>
            {ui}
        </NavigationProvider>
    </ThemeProvider>
  );
};

describe('Dock Component', () => {
  it('focuses first list item when expanded and restores focus on close', async () => {
    renderWithProviders(<Dock />);
    const toggle = screen.getAllByLabelText('Abrir navegación flotante')[0];
    fireEvent.click(toggle);
    const nav = await screen.findByRole('navigation', { name: 'Navegación flotante' });
    const buttons = within(nav).getAllByRole('button');
    const listButtons = buttons.filter(btn => !btn.getAttribute('aria-current'));
    await waitFor(() => expect(listButtons[0]).toHaveFocus());

    // cerrar con Escape y verificar retorno de foco al toggle
    fireEvent.keyDown(window, { key: 'Escape' });
    await waitFor(() => expect(screen.getByLabelText('Abrir navegación flotante')).toHaveFocus());
  });

  it('supports Home/End to jump first/last', async () => {
    renderWithProviders(<Dock />);
    fireEvent.click(screen.getAllByLabelText('Abrir navegación flotante')[0]);
    const nav = await screen.findByRole('navigation', { name: 'Navegación flotante' });
    const buttons = within(nav).getAllByRole('button');
    const listButtons = buttons.filter(btn => !btn.getAttribute('aria-current'));

    // Move focus somewhere in the middle
    listButtons[1].focus();
    expect(listButtons[1]).toHaveFocus();

    fireEvent.keyDown(listButtons[1], { key: 'Home' });
    expect(listButtons[0]).toHaveFocus();

    fireEvent.keyDown(listButtons[0], { key: 'End' });
    expect(listButtons[listButtons.length - 1]).toHaveFocus();
  });

  it('toggle controls nav (aria-controls) and opens navigation', async () => {
    renderWithProviders(<Dock />);
    const toggle = screen.getAllByRole('button', { name: 'Abrir navegación flotante' })[0];
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(toggle).toHaveAttribute('aria-controls', 'floating-dock-nav');
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-controls', 'floating-dock-nav');
    const navs = await screen.findAllByRole('navigation', { name: 'Navegación flotante' });
    expect(navs.length).toBeGreaterThan(0);
  });
  it('should move focus to the right when ArrowRight is pressed', async () => {
    renderWithProviders(<Dock />);
    // Expand dock to enable keyboard navigation over items
    fireEvent.click(screen.getAllByLabelText('Abrir navegación flotante')[0]);
    const navs = await screen.findAllByRole('navigation', { name: 'Navegación flotante' });
    const nav = navs[navs.length - 1];
    const buttons = within(nav).getAllByRole('button');
    const listButtons = buttons.filter(btn => !btn.getAttribute('aria-current'));
    const firstButton = listButtons[0];
    const secondButton = listButtons[1];

    firstButton.focus();
    expect(firstButton).toHaveFocus();

    fireEvent.keyDown(firstButton, { key: 'ArrowRight' });
    expect(secondButton).toHaveFocus();
  });

  it('should move focus to the left when ArrowLeft is pressed', async () => {
    renderWithProviders(<Dock />);
    fireEvent.click(screen.getAllByLabelText('Abrir navegación flotante')[0]);
    const navs = await screen.findAllByRole('navigation', { name: 'Navegación flotante' });
    const nav = navs[navs.length - 1];
    const buttons = within(nav).getAllByRole('button');
    const listButtons = buttons.filter(btn => !btn.getAttribute('aria-current'));
    const firstButton = listButtons[0];
    const secondButton = listButtons[1];

    secondButton.focus();
    expect(secondButton).toHaveFocus();

    fireEvent.keyDown(secondButton, { key: 'ArrowLeft' });
    expect(firstButton).toHaveFocus();
  });

  it('should wrap focus from the last item to the first when ArrowRight is pressed', async () => {
    renderWithProviders(<Dock />);
    fireEvent.click(screen.getAllByLabelText('Abrir navegación flotante')[0]);
    const navs = await screen.findAllByRole('navigation', { name: 'Navegación flotante' });
    const nav = navs[navs.length - 1];
    const buttons = within(nav).getAllByRole('button');
    const listButtons = buttons.filter(btn => !btn.getAttribute('aria-current'));
    const lastButton = listButtons[listButtons.length - 1];

    lastButton.focus();
    expect(lastButton).toHaveFocus();

    fireEvent.keyDown(lastButton, { key: 'ArrowRight' });
    await waitFor(() => {
      expect(document.activeElement).toHaveAttribute('aria-label', 'Experience');
    });
  });

  it('should wrap focus from the first item to the last when ArrowLeft is pressed', async () => {
    renderWithProviders(<Dock />);
    fireEvent.click(screen.getAllByLabelText('Abrir navegación flotante')[0]);
    const navs = await screen.findAllByRole('navigation', { name: 'Navegación flotante' });
    const nav = navs[navs.length - 1];
    const buttons = within(nav).getAllByRole('button');
    const listButtons = buttons.filter(btn => !btn.getAttribute('aria-current'));
    const firstButton = listButtons[0];

    firstButton.focus();
    expect(firstButton).toHaveFocus();

    fireEvent.keyDown(firstButton, { key: 'ArrowLeft' });
    await waitFor(() => {
      expect(document.activeElement).toHaveAttribute('aria-label', 'Skills');
    });
  });
});
