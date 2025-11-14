import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

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

describe('QuickActionsModal backdrop click guard', () => {
  it('ignores immediate backdrop click after opening, allows later click to close', async () => {
    const onClose = vi.fn();
    const groups = [
      { id: 'preferences', label: 'Preferencias', items: [{ key: 'x', label: 'X', action: () => {} }] }
    ];

    // Controlar el tiempo para probar la ventana anti-ruido (250ms)
    const base = 1_000_000;
    const nowSpy = vi.spyOn(performance, 'now');
    nowSpy.mockReturnValue(base as unknown as number);

    render(
      <Wrapper>
        <QuickActionsModal open groups={groups} onClose={onClose} />
      </Wrapper>
    );

    // Backdrop presente
    const backdrop = screen.getByRole('presentation');

    // Click inmediato: NO debe cerrar
    fireEvent.click(backdrop);
    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // Avanza el tiempo más allá del umbral
    nowSpy.mockReturnValue((base + 300) as unknown as number);

    // Click tardío: ahora sí debe cerrar
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalledTimes(1);

    nowSpy.mockRestore();
  });
});
