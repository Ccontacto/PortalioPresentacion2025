import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { DevProvider } from '../../contexts/DevContext';
import { LanguageProvider } from '../../contexts/LanguageContext';
import { NavigationProvider } from '../../contexts/NavigationContext';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { ToastProvider } from '../../contexts/ToastContext';
import QuickActionsMenu from '../QuickActionsMenu';

vi.mock('focus-trap-react', () => ({
  FocusTrap: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

vi.mock('../../hooks/useConfettiCooldown', () => ({
  useConfettiCooldown: () => ({
    tryLaunch: () => ({ launched: true, remaining: 0 }),
    isOnCooldown: false,
    reset: vi.fn()
  })
}));

vi.mock('../../hooks/useCvDownload', () => ({
  useCvDownload: () => vi.fn()
}));

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

describe('QuickActionsMenu', () => {
  it('opens the modal and lists preference actions', async () => {
    render(
      <Providers>
        <QuickActionsMenu />
      </Providers>
    );

    fireEvent.click(screen.getByRole('button', { name: /abrir menú de acciones/i }));

    const dialog = await screen.findByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(screen.getByText(/Preferencias/)).toBeInTheDocument();
  });
});
