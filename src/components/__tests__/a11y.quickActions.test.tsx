import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';

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

import { DevProvider } from '../../contexts/DevContext';
import { LanguageProvider } from '../../contexts/LanguageContext';
import { NavigationProvider } from '../../contexts/NavigationContext';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { ToastProvider } from '../../contexts/ToastContext';
import HamburgerMenu from '../HamburgerMenu';

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

describe('A11y: HamburgerMenu', () => {
  it('does not introduce obvious accessibility regressions when open', async () => {
    const { container } = render(
      <Providers>
        <HamburgerMenu />
      </Providers>
    );

    fireEvent.click(screen.getByRole('button', { name: /abrir menú de navegación/i }));
    await screen.findByRole('navigation', { name: /secciones del sitio/i });

    const results = await axe(container, {
      rules: {
        'color-contrast': { enabled: false }
      }
    });

    expect(results).toHaveNoViolations();
  });
});
