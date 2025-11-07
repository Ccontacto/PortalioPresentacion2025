import { FocusTrap } from 'focus-trap-react';
import { m } from 'framer-motion';
import { X } from 'lucide-react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { DIALOG_VARIANTS, PANEL_TRANSITION } from '../../constants/animation';

import type { QuickActionGroup } from './types';
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

  return (
    <div
      className="mobile-actions-backdrop"
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
          variants={shouldReduceMotion ? undefined : DIALOG_VARIANTS}
          initial={shouldReduceMotion ? undefined : 'hidden'}
          animate={shouldReduceMotion ? undefined : 'show'}
          exit={shouldReduceMotion ? undefined : 'exit'}
          transition={shouldReduceMotion ? undefined : PANEL_TRANSITION}
        >
          <header className="mobile-actions-modal__header">
            <h2 id="mobile-actions-title">Acciones y accesos rápidos</h2>
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

          <div className="mobile-actions-modal__content">
            {groups.map(group => (
              <div className="mobile-actions-modal__group" key={group.id}>
                <p className="mobile-actions-modal__group-label">{group.label}</p>
                <div className="mobile-actions-modal__group-items">
                  {group.items.map(item => (
                    <button
                      key={item.key}
                      type="button"
                      className="mobile-actions-modal__item"
                      onClick={() => {
                        onClose();
                        if (item.immediate) {
                          item.action();
                        } else {
                          window.setTimeout(() => {
                            item.action();
                          }, 180);
                        }
                      }}
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
        </m.div>
      </FocusTrap>
    </div>
  );
}
