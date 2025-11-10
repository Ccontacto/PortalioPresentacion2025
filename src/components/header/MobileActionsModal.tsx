import { FocusTrap } from 'focus-trap-react';
import { m } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

import { DIALOG_VARIANTS, PANEL_TRANSITION } from '../../constants/animation';
import { KONAMI_ENABLE_MESSAGE } from '../../constants/konami';
import { useTheme } from '../../contexts/ThemeContext';
import { useToast } from '../../contexts/ToastContext';
import { useReducedMotion } from '../../hooks/useReducedMotion';

import type { QuickAction, QuickActionGroup } from './types';
import type { KeyboardEvent, RefObject } from 'react';

type Props = {
  open: boolean;
  groups: QuickActionGroup[];
  onClose: () => void;
  menuRef: RefObject<HTMLDivElement | null>;
};

export function MobileActionsModal({ open, groups, onClose, menuRef }: Props) {
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

  const KONAMI_SEQ = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'] as const;
  const [konamiIndex, setKonamiIndex] = useState(0);
  const handleKonamiKey = (key: string) => {
    const expected = KONAMI_SEQ[konamiIndex];
    if (key === expected) {
      const nextIndex = konamiIndex + 1;
      if (nextIndex === KONAMI_SEQ.length && !isKonami) {
        activateKonami();
        showToast(KONAMI_ENABLE_MESSAGE, 'success');
        setKonamiIndex(0);
      } else {
        setKonamiIndex(nextIndex % KONAMI_SEQ.length);
      }
      return;
    }
    setKonamiIndex(key === KONAMI_SEQ[0] ? 1 : 0);
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

  if (!open) {
    return null;
  }

  const content = (
    <div
      className="mobile-actions-backdrop"
      role="presentation"
      onClick={onClose}
    >
      <FocusTrap
        active={open}
        focusTrapOptions={{
          allowOutsideClick: true,
          clickOutsideDeactivates: true,
          initialFocus: () =>
            menuRef.current?.querySelector('[data-focus-default]') ?? menuRef.current ?? undefined,
          onDeactivate: onClose
        }}
      >
        <m.div
          className="mobile-actions-modal"
          id="mobile-quick-actions"
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-actions-title"
          onClick={event => event.stopPropagation()}
          data-dev-id="7001"
          variants={shouldReduceMotion ? undefined : DIALOG_VARIANTS}
          initial={shouldReduceMotion ? undefined : 'hidden'}
          animate={shouldReduceMotion ? undefined : 'show'}
          exit={shouldReduceMotion ? undefined : 'exit'}
          transition={shouldReduceMotion ? undefined : PANEL_TRANSITION}
        >
          <header className="mobile-actions-modal__header">
            <h2 id="mobile-actions-title">Acciones rápidas</h2>
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

          <div className="remote-search" aria-label="Buscar accesos rápidos">
            <Search size={18} aria-hidden="true" />
            <input
              type="search"
              placeholder="Buscar…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => handleKonamiKey(event.key)}
              aria-label="Buscar opciones"
            />
          </div>

          <div className="mobile-actions-modal__content">
            {filtered.length ? (
              filtered.map(group => (
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
              ))
            ) : (
              <div className="command-modal__empty" role="status">
                <p className="command-modal__empty-title">Sin coincidencias</p>
                <p className="command-modal__empty-subtitle">Ajusta la búsqueda o explora otras acciones.</p>
              </div>
            )}
          </div>
        </m.div>
      </FocusTrap>
    </div>
  );

  return createPortal(content, document.body);
}
