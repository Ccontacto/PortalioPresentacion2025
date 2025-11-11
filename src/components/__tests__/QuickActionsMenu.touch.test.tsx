import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('focus-trap-react', () => ({
  FocusTrap: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

vi.mock('lucide-react', () => ({
  Menu: () => <svg data-testid="icon-menu" />,
  Loader2: () => <svg data-testid="icon-loader" />,
  X: () => <svg data-testid="icon-x" />,
  Search: () => <svg data-testid="icon-search" />
}));

import { DevProvider } from '../../contexts/DevContext';
import { LanguageProvider } from '../../contexts/LanguageContext';
import { NavigationProvider } from '../../contexts/NavigationContext';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { ToastProvider } from '../../contexts/ToastContext';
import QuickActionsMenu from '../QuickActionsMenu';

const Providers = ({ children }: { children: React.ReactNode }) => (
  <ToastProvider>
    <LanguageProvider>
      <ThemeProvider>
        <NavigationProvider>
          <DevProvider>{children}</DevProvider>
        </NavigationProvider>
      </ThemeProvider>
    </LanguageProvider>
  </ToastProvider>
);

describe('QuickActionsMenu touch behavior', () => {
  it('opens on touchend (single tap)', async () => {
    render(
      <Providers>
        <QuickActionsMenu />
      </Providers>
    );

    const btn = screen.getByRole('button', { name: /abrir menú de acciones/i });
    fireEvent.touchEnd(btn);

    // Debe aparecer el diálogo
    const dialog = await screen.findByRole('dialog');
    expect(dialog).toBeInTheDocument();
  });
});

