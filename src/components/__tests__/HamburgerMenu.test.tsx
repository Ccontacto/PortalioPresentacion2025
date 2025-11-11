import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mockNavigate = vi.fn();
const mockAction = vi.fn();

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

  it('navigates to section and closes panel', () => {
    render(<HamburgerMenu />);
    const button = screen.getByRole('button', { name: /abrir menú de navegación/i });
    fireEvent.click(button);

    const navItem = screen.getByRole('button', { name: 'Inicio' });
    fireEvent.click(navItem);

    expect(mockNavigate).toHaveBeenCalledWith('home');
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('filtra acciones y ejecuta acción rápida', () => {
    render(<HamburgerMenu />);
    const button = screen.getByRole('button', { name: /abrir menú de navegación/i });
    fireEvent.click(button);

    const actionButton = screen.getByRole('button', { name: 'Modo oscuro' });
    expect(actionButton).toBeInTheDocument();

    fireEvent.change(screen.getByRole('searchbox', { name: /buscar en el menú/i }), {
      target: { value: 'modo' }
    });

    fireEvent.click(screen.getByRole('button', { name: 'Modo oscuro' }));
    expect(mockAction).toHaveBeenCalledTimes(1);
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });
});
