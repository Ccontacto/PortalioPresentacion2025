import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mockNavigate = vi.fn();
const mockAction = vi.fn();

vi.mock('../../contexts/LanguageContext', () => ({
  useLanguage: () => ({
    data: { lang: 'es' },
    currentLang: 'es',
    toggleLanguage: vi.fn()
  })
}));
vi.mock('../../contexts/NavigationContext', () => ({
  useNavigation: () => ({ navigateTo: mockNavigate })
}));

vi.mock('../../hooks/useReducedMotion', () => ({
  useReducedMotion: () => true
}));

vi.mock('../quick-actions/useQuickActionsData', () => ({
  useQuickActionsData: () => ({
    navItems: [
      { id: 'home', label: 'Inicio' },
      { id: 'projects', label: 'Proyectos' }
    ],
    preferenceItems: [
      { key: 'theme', label: 'Modo oscuro', action: mockAction },
      { key: 'language', label: 'Switch to English', action: vi.fn() }
    ]
  })
}));

import HamburgerMenu from '../HamburgerMenu';

describe('HamburgerMenu', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    mockAction.mockReset();
  });

  afterEach(() => {
    cleanup();
  });

  it('toggle open/close state and aria attributes', () => {
    render(<HamburgerMenu />);
    const button = screen.getByRole('button', { name: /abrir menú de navegación/i });
    expect(button).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');

    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('navigates to section and closes panel', async () => {
    render(<HamburgerMenu />);
    const button = screen.getByRole('button', { name: /abrir menú de navegación/i });
    fireEvent.click(button);
    const navItems = await screen.findAllByRole('button', { name: /inicio/i });
    fireEvent.click(navItems[0]);

    expect(mockNavigate).toHaveBeenCalledWith('home');
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('filtra acciones y ejecuta acción rápida', async () => {
    render(<HamburgerMenu />);
    const button = screen.getByRole('button', { name: /abrir menú de navegación/i });
    fireEvent.click(button);

    const [actionButton] = screen.getAllByRole('button', { name: /modo oscuro/i });
    expect(actionButton).toBeInTheDocument();

    fireEvent.change(screen.getByRole('searchbox'), {
      target: { value: 'modo' }
    });

    fireEvent.click(screen.getAllByRole('button', { name: /modo oscuro/i })[0]);
    expect(mockAction).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });
  });

  it('permite navegar las páginas del panel con el teclado', async () => {
    render(<HamburgerMenu />);
    const button = screen.getByRole('button', { name: /abrir menú de navegación/i });
    fireEvent.click(button);

    const region = await screen.findByRole('region', { name: /páginas del menú/i });
    region.focus();
    const initialPage = region.getAttribute('data-current-page');

    fireEvent.keyDown(region, { key: 'ArrowRight' });
    await waitFor(() => {
      expect(region.getAttribute('data-current-page')).not.toBe(initialPage);
    });

    fireEvent.keyDown(region, { key: 'Home' });
    await waitFor(() => {
      expect(region.getAttribute('data-current-page')).toBe('0');
    });
  });
});
