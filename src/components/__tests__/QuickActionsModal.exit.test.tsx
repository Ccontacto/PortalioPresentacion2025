import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

vi.mock('focus-trap-react', () => ({
  FocusTrap: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

import { ThemeProvider } from '../../contexts/ThemeContext';
import { ToastProvider } from '../../contexts/ToastContext';
import { QuickActionsModal } from '../QuickActionsModal';

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </ToastProvider>
  );
}

describe('QuickActionsModal: ejecuta acción tras animación de salida', () => {
  beforeEach(() => {
    // Forzar reduced motion para que la salida no tenga delay perceptible
    const orig = window.matchMedia;
    // @ts-expect-error test override
    window.matchMedia = (q: string) => ({
      matches: q.includes('prefers-reduced-motion') ? true : false,
      media: q,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      onchange: null,
      dispatchEvent: () => false
    });
    return () => {
      window.matchMedia = orig;
    };
  });

  it('defer action until after close (onExitComplete)', async () => {
    const action = vi.fn();
    function Test() {
      const [open, setOpen] = React.useState(true);
      return (
        <QuickActionsModal
          open={open}
          onClose={() => setOpen(false)}
          groups={[
            {
              id: 'nav',
              label: 'Secciones',
              items: [
                { key: 'go', label: 'Ir', action, immediate: false },
              ]
            }
          ]}
        />
      );
    }

    render(
      <Wrapper>
        <Test />
      </Wrapper>
    );

    // Click en el único ítem
    const btn = await screen.findByRole('button', { name: 'Ir' });
    fireEvent.click(btn);

    // Espera a que el cierre complete y la acción se ejecute
    await waitFor(() => expect(action).toHaveBeenCalledTimes(1));
  });
});
