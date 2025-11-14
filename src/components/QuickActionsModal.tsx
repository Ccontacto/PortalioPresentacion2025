import { FocusTrap } from 'focus-trap-react';
import { AnimatePresence, m } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';

import { DIALOG_VARIANTS, OVERLAY_FADE, PANEL_TRANSITION } from '../constants/animation';
import { KONAMI_ENABLE_MESSAGE } from '../constants/konami';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../contexts/ToastContext';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
import { useDeferredExitAction } from '../hooks/useDeferredExitAction';

import type { QuickAction, QuickActionGroup } from './quick-actions/types';

type Props = {
  open: boolean;
  groups: QuickActionGroup[];
  onClose: () => void;
};

export function QuickActionsModal({ open, groups, onClose }: Props) {
  const shouldReduceMotion = useReducedMotion();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [query, setQuery] = useState('');
  const { activateKonami, isKonami } = useTheme();
  const { showToast } = useToast();
  const openedAtRef = useRef(0);
  // Ventana anti-ruido para evitar cierres inmediatos
  const BACKDROP_CLICK_GUARD_MS = 300;

  // Registrar el instante de apertura antes del paint para que el primer click del overlay
  // (ghost click o propagación inmediata) sea descartado de forma fiable.
  useLayoutEffect(() => {
    if (open) {
      openedAtRef.current = typeof performance !== 'undefined' ? performance.now() : Date.now();
    }
  }, [open]);

  // Paridad con SearchBar: bloquear scroll de fondo cuando está abierto
  useBodyScrollLock(open);

  const itemsByKey = useMemo(() => {
    const map = new Map<string, QuickAction>();
    groups.forEach(group => {
      group.items.forEach(item => map.set(item.key, item));
    });
    return map;
  }, [groups]);

  const { queue, onExitComplete } = useDeferredExitAction();

  const run = (key: string) => {
    const action = itemsByKey.get(key);
    if (!action || action.disabled) return;
    const enqueued = queue(() => action.action());
    if (enqueued) onClose();
  };

  const KONAMI_SEQ = [
    'ArrowUp',
    'ArrowUp',
    'ArrowDown',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'ArrowLeft',
    'ArrowRight',
    'b',
    'a'
  ] as const;

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
    const normalized = query.trim().toLowerCase();
    if (!normalized) return groups;
    return groups
      .map(group => ({
        ...group,
        items: group.items.filter(item => item.label.toLowerCase().includes(normalized))
      }))
      .filter(group => group.items.length > 0);
  }, [groups, query]);

  const content = (
    <AnimatePresence
      initial={false}
      onExitComplete={onExitComplete}
    >
      {open ? (
        <m.div
          className="mobile-actions-backdrop"
          role="presentation"
          onClick={() => {
            const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
            if (now - openedAtRef.current < BACKDROP_CLICK_GUARD_MS) return;
            onClose();
          }}
          variants={shouldReduceMotion ? undefined : OVERLAY_FADE}
          initial={shouldReduceMotion ? undefined : 'hidden'}
          animate={shouldReduceMotion ? undefined : 'show'}
          exit={shouldReduceMotion ? undefined : 'exit'}
          transition={shouldReduceMotion ? undefined : PANEL_TRANSITION}
        >
          <FocusTrap
            active={open}
            focusTrapOptions={{
              allowOutsideClick: true,
              // Evita que el primer click fuera desactive el trap automáticamente; delegamos al overlay
              clickOutsideDeactivates: false,
              initialFocus: () => inputRef.current ?? panelRef.current ?? undefined,
              fallbackFocus: () => panelRef.current ?? inputRef.current ?? document.body,
              onDeactivate: onClose
            }}
          >
            <m.div
              className="mobile-actions-modal"
              id="quick-actions-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="quick-actions-title"
              tabIndex={-1}
              ref={panelRef}
              onClick={event => event.stopPropagation()}
              data-dev-id="7001"
              variants={shouldReduceMotion ? undefined : DIALOG_VARIANTS}
              initial={shouldReduceMotion ? undefined : 'hidden'}
              animate={shouldReduceMotion ? undefined : 'show'}
              exit={shouldReduceMotion ? undefined : 'exit'}
              transition={shouldReduceMotion ? undefined : PANEL_TRANSITION}
            >
              <header className="mobile-actions-modal__header">
                <h2 id="quick-actions-title">Acciones rápidas</h2>
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
                  ref={inputRef}
                  type="search"
                  placeholder="Buscar…"
                  value={query}
                  onChange={event => setQuery(event.target.value)}
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
        </m.div>
      ) : null}
    </AnimatePresence>
  );

  return createPortal(content, document.body);
}
