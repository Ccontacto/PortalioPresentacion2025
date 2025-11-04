import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { AvailabilityBadge } from '../AvailabilityBadge';
import { MobileActionsModal } from '../MobileActionsModal';
import { OverflowPanel } from '../OverflowPanel';

import type { QuickAction, QuickActionGroup } from '../types';

vi.mock('focus-trap-react', () => ({
  FocusTrap: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

vi.mock('framer-motion', () => {
  const MockMotionDiv = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ children, ...rest }, ref) => (
      <div ref={ref} {...rest}>
        {children}
      </div>
    )
  );
  MockMotionDiv.displayName = 'MockMotionDiv';

  return {
    motion: {
      div: MockMotionDiv
    }
  };
});

describe('AvailabilityBadge', () => {
  it('renders availability info and toggles on click', () => {
    const handleToggle = vi.fn();
    render(
      <AvailabilityBadge
        availability="available"
        badgeClass="availability-available"
        icon={<span data-testid="icon">icon</span>}
        label="Disponible"
        toggleLabel="Cambiar disponibilidad"
        onToggle={handleToggle}
      />
    );

    expect(screen.getByText('Disponible')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /cambiar disponibilidad/i }));
    expect(handleToggle).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });
});

describe('OverflowPanel', () => {
  const actions: QuickAction[] = [
    { key: 'a', label: 'Acción A', action: vi.fn(), icon: <span>🧪</span> },
    { key: 'b', label: 'Acción B', action: vi.fn(), disabled: true }
  ];
  const onClose = vi.fn();

  beforeEach(() => {
    actions.forEach(action => (action.action as ReturnType<typeof vi.fn>).mockClear());
    onClose.mockClear();
  });

  it('executes action and close handlers on item click', () => {
    render(<OverflowPanel items={actions} onClose={onClose} panelRef={() => undefined} />);

    const [firstButton, secondButton] = screen.getAllByRole('menuitem');
    fireEvent.click(firstButton);

    expect(actions[0].action).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);

    expect(secondButton).toBeDisabled();
  });
});

describe('MobileActionsModal', () => {
  const onClose = vi.fn();
  const immediateAction = vi.fn();
  const groups: QuickActionGroup[] = [
    {
      id: 'g1',
      label: 'Grupo',
      items: [
        { key: 'immediate', label: 'Acción inmediata', action: immediateAction, immediate: true },
        { key: 'delayed', label: 'Acción diferida', action: vi.fn() }
      ]
    }
  ];

  beforeEach(() => {
    onClose.mockClear();
    immediateAction.mockClear();
  });

  it('does not render when closed', () => {
    const { container } = render(
      <MobileActionsModal open={false} groups={groups} onClose={onClose} menuRef={React.createRef()} />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('renders groups and triggers handlers', () => {
    const ref = React.createRef<HTMLDivElement | null>();
    render(<MobileActionsModal open groups={groups} onClose={onClose} menuRef={ref} />);

    expect(screen.getByText('Grupo')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Cerrar menú' }));
    expect(onClose).toHaveBeenCalledTimes(1);
    onClose.mockClear();

    fireEvent.click(screen.getByRole('button', { name: 'Acción inmediata' }));
    expect(immediateAction).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
