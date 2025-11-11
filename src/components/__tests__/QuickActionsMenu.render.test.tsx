import { render, screen, fireEvent, within, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

// Mock de ícono para evitar dependencias de renderizado
vi.mock('lucide-react', () => ({
  Menu: () => <svg data-testid="icon-menu" />,
  Loader2: () => <svg data-testid="icon-loader" />
}));

// Mock del modal para inspeccionar props y estado
vi.mock('../QuickActionsModal', () => ({
  QuickActionsModal: ({ open, groups, onClose }: any) => (
    <div data-testid="qa-modal" data-open={open ? 'true' : 'false'}>
      <button type="button" onClick={onClose}>mock-close</button>
      <ul aria-label="groups">
        {groups.map((g: any) => (
          <li key={g.id} data-group-id={g.id} data-items={g.items.length} />
        ))}
      </ul>
      {/* Verificación directa del flag immediate del primer item de nav */}
      <div
        data-testid="first-nav-immediate"
        data-value={String(
          (() => {
            const nav = groups.find((g: any) => g.id === 'nav');
            return !!nav && !!nav.items[0] && nav.items[0].immediate === true;
          })()
        )}
      />
    </div>
  )
}));

// Proveedores reales; contienen datos de navegación/preferencias válidos
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

describe('QuickActionsMenu: render y comportamiento básico', () => {
  it('renderiza el botón con atributos ARIA y abre/cierra el modal', async () => {
    const { container } = render(
      <Providers>
        <QuickActionsMenu />
      </Providers>
    );

    const btn = within(container).getByRole('button', { name: /abrir menú de acciones/i });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAttribute('aria-haspopup', 'dialog');
    // aria-controls se publica sólo cuando está abierto (paridad con SearchBar)
    expect(btn).not.toHaveAttribute('aria-controls');
    expect(btn).toHaveAttribute('aria-expanded', 'false');

    // Abre (hay un pequeño delay de loading)
    fireEvent.click(btn);
    const modal = await within(container).findByTestId('qa-modal');
    // Puede haber un pequeño delay por loading; esperar a que abra
    await waitFor(() => expect(modal).toHaveAttribute('data-open', 'true'));
    expect(btn).toHaveAttribute('aria-expanded', 'true');

    // Cierra
    fireEvent.click(within(container).getByText('mock-close'));
    expect(within(container).getByTestId('qa-modal')).toHaveAttribute('data-open', 'false');
    expect(btn).toHaveAttribute('aria-expanded', 'false');
  });

  it('expone grupos nav y preferences, y nav[*].immediate === true al menos para el primero', async () => {
    const { container } = render(
      <Providers>
        <QuickActionsMenu />
      </Providers>
    );

    const btn = within(container).getByRole('button', { name: /abrir menú de acciones/i });
    fireEvent.click(btn);
    const modal = await within(container).findByTestId('qa-modal');
    expect(modal).toBeInTheDocument();

    const groupsList = within(container).getByRole('list', { name: /groups/i });
    // Verifica presencia de grupos por data-attrs del mock
    const items = groupsList.querySelectorAll('li');
    expect(items.length).toBeGreaterThan(0);
    const hasNav = Array.from(items).some(li => li.getAttribute('data-group-id') === 'nav');
    const hasPreferences = Array.from(items).some(li => li.getAttribute('data-group-id') === 'preferences');
    expect(hasNav).toBe(true);
    expect(hasPreferences).toBe(true);

    const firstNavImmediate = within(container).getByTestId('first-nav-immediate').getAttribute('data-value');
    expect(firstNavImmediate).toBe('true');
  });
});
