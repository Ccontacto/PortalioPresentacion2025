import { X } from 'lucide-react';

import type { QuickAction } from './types';

type Props = {
  items: QuickAction[];
  onClose: () => void;
  panelRef: (node: HTMLDivElement | null) => void;
};

export function OverflowPanel({ items, onClose, panelRef }: Props) {
  return (
    <div
      id="header-panel-overflow"
      className="header-panel header-panel--overflow"
      role="menu"
      aria-label="Acciones rápidas"
      ref={panelRef}
      style={{
        background: 'var(--surface-panel)',
        border: '3px solid var(--border-strong)',
        borderRadius: '16px',
        boxShadow: 'var(--shadow-lg) var(--shadow-strong)'
      }}
    >
      <button
        type="button"
        className="header-panel-close icon-btn"
        onClick={onClose}
        aria-label="Cerrar menú de acciones"
        style={{ color: 'var(--error)' }}
      >
        <X size={24} aria-hidden="true" />
      </button>
      <div className="header-panel-list" role="menu">
        {items.map(item => (
          <button
            key={item.key}
            type="button"
            onClick={() => {
              item.action();
              onClose();
            }}
            className="header-panel-button"
            role="menuitem"
            disabled={item.disabled}
            aria-disabled={item.disabled ? 'true' : 'false'}
            data-retro-sfx
          >
            {item.icon ? <span className="header-panel-button__icon">{item.icon}</span> : null}
            <span className="header-panel-button__label">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
