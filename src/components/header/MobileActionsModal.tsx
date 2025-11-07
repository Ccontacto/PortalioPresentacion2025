import { FocusTrap } from 'focus-trap-react';
import { createPortal } from 'react-dom';
import { m } from 'framer-motion';
import { useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useToast } from '../../contexts/ToastContext';
import { KONAMI_ENABLE_MESSAGE } from '../../constants/konami';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { DIALOG_VARIANTS, PANEL_TRANSITION } from '../../constants/animation';

import type { QuickAction, QuickActionGroup } from './types';
import type { RefObject } from 'react';

type Props = {
  open: boolean;
  groups: QuickActionGroup[];
  onClose: () => void;
  menuRef: RefObject<HTMLDivElement | null>;
};

export function MobileActionsModal({ open, groups, onClose, menuRef }: Props) {
  if (!open) return null;
  const shouldReduceMotion = useReducedMotion();
  const [query, setQuery] = useState('');
  const { activateKonami, isKonami } = useTheme();
  const { showToast } = useToast();

  const itemsByKey = useMemo(() => {
    const map = new Map<string, QuickAction>();
    groups.forEach(g => g.items.forEach(it => map.set(it.key, it)));
    return map;
  }, [groups]);

  const run = (key: string) => {
    const it = itemsByKey.get(key);
    if (!it || it.disabled) return;
    onClose();
    if (it.immediate) it.action();
    else window.setTimeout(() => it.action(), 160);
  };

  // Konami: U U D D L R L R B A
  const [, setKonami] = useState<string>('');
  const KONAMI_SEQ = 'UUDDLRLRBA';
  const pushKonami = (ch: 'U'|'D'|'L'|'R'|'A'|'B') => {
    setKonami(prev => {
      const next = (prev + ch).slice(-KONAMI_SEQ.length);
      if (next === KONAMI_SEQ && !isKonami) {
        activateKonami();
        showToast(KONAMI_ENABLE_MESSAGE, 'success');
      }
      return next;
    });
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return groups;
    return groups
      .map(g => ({
        ...g,
        items: g.items.filter(it => it.label.toLowerCase().includes(q))
      }))
      .filter(g => g.items.length > 0);
  }, [groups, query]);

  const content = (
    <div
      className="mobile-actions-backdrop"
    >
      <FocusTrap
        active={open}
        focusTrapOptions={{
          allowOutsideClick: true,
          clickOutsideDeactivates: false,
          initialFocus: () =>
            menuRef.current?.querySelector('[data-focus-default]') ?? menuRef.current ?? undefined,
          onDeactivate: onClose
        }}
      >
        <m.div
          className="mobile-actions-modal remote-modal"
          id="mobile-quick-actions"
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-actions-title"
          data-dev-id="7001"
          variants={shouldReduceMotion ? undefined : DIALOG_VARIANTS}
          initial={shouldReduceMotion ? undefined : 'hidden'}
          animate={shouldReduceMotion ? undefined : 'show'}
          exit={shouldReduceMotion ? undefined : 'exit'}
          transition={shouldReduceMotion ? undefined : PANEL_TRANSITION}
        >
          <header className="mobile-actions-modal__header">
            <h2 id="mobile-actions-title">Control</h2>
            <button
              type="button"
              className="mobile-actions-modal__close"
              onClick={onClose}
              aria-label="Cerrar menú"
              data-focus-default
            >
              <X size={22} aria-hidden="true" />
            </button>
          </header>

          {/* Control remoto + buscador (no cierra el modal; solo registra entradas para Konami) */}
          <div className="remote-ctrl" role="group" aria-label="Control remoto">
            <div className="remote-sensor" aria-hidden="true"></div>
            <div className="remote-grid">
              <button className="remote-btn" aria-label="Arriba" onClick={() => pushKonami('U')}>▲</button>
              <div />
              <button className="remote-btn" aria-label="Derecha" onClick={() => pushKonami('R')}>▶</button>
              <button className="remote-btn" aria-label="Izquierda" onClick={() => pushKonami('L')}>◀</button>
              <div className="remote-center" aria-hidden="true">●</div>
              <div />
              <div />
              <button className="remote-btn" aria-label="Abajo" onClick={() => pushKonami('D')}>▼</button>
              <div />
            </div>
            <div className="remote-ab">
              <button className="remote-btn remote-a" aria-label="A" onClick={() => pushKonami('A')}>A</button>
              <button className="remote-btn remote-b" aria-label="B" onClick={() => pushKonami('B')}>B</button>
            </div>
            <div className="remote-start-select" aria-hidden="true">
              <span className="remote-pill">Select</span>
              <span className="remote-pill">Start</span>
            </div>
            <div className="remote-search">
              <input
                type="search"
                placeholder="Buscar…"
                value={query}
                onChange={e => setQuery(e.target.value)}
                aria-label="Buscar opciones"
              />
            </div>
          </div>

          {query.trim() ? (
            <div className="mobile-actions-modal__content">
              {filtered.map(group => (
                <div className="mobile-actions-modal__group" key={group.id}>
                  <p className="mobile-actions-modal__group-label">{group.label}</p>
                  <div className="mobile-actions-modal__group-items">
                    {group.items.map(item => (
                      <button
                        key={item.key}
                        type="button"
                        className="mobile-actions-modal__item"
                        onClick={() => run(item.key)}
                        disabled={item.disabled}
                        aria-disabled={item.disabled ? 'true' : 'false'}
                        data-retro-sfx
                      >
                        {item.icon ? <span className="mobile-actions-modal__icon">{item.icon}</span> : null}
                        <span className="mobile-actions-modal__label">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </m.div>
      </FocusTrap>
    </div>
  );

  return createPortal(content, document.body);
}
