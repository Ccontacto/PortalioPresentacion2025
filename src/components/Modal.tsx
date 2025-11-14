
import { FocusTrap } from 'focus-trap-react';
import { AnimatePresence, m } from 'framer-motion';
import { createPortal } from 'react-dom';

import { DIALOG_VARIANTS, OVERLAY_FADE, PANEL_TRANSITION } from '../constants/animation';
import { useReducedMotion } from '../hooks/useReducedMotion';

type ModalProps = {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  onExitComplete?: () => void;
  titleId: string;
  descriptionId: string;
  panelId: string;
  className?: string;
  initialFocusRef?: React.RefObject<HTMLElement>;
};

export default function Modal({
  children,
  isOpen,
  onClose,
  onExitComplete,
  titleId,
  descriptionId,
  panelId,
  className,
  initialFocusRef,
}: ModalProps) {
  const shouldReduceMotion = useReducedMotion();

  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <AnimatePresence initial={false} onExitComplete={onExitComplete}>
      {isOpen ? (
        <m.div
          className={`search-modal ${className || ''}`}
          variants={shouldReduceMotion ? undefined : OVERLAY_FADE}
          initial={shouldReduceMotion ? undefined : 'hidden'}
          animate={shouldReduceMotion ? undefined : 'show'}
          exit={shouldReduceMotion ? undefined : 'exit'}
          transition={shouldReduceMotion ? undefined : PANEL_TRANSITION}
          role="presentation"
        >
          <div
            className="search-modal__backdrop"
            role="presentation"
            aria-hidden="true"
            onClick={onClose}
          />
          <FocusTrap
            active
            focusTrapOptions={{
              initialFocus: () => initialFocusRef?.current ?? false,
              allowOutsideClick: true,
              clickOutsideDeactivates: true,
              returnFocusOnDeactivate: true,
            }}
          >
            <m.div
              className="search-modal__panel"
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              aria-describedby={descriptionId}
              id={panelId}
              variants={shouldReduceMotion ? undefined : DIALOG_VARIANTS}
              initial={shouldReduceMotion ? undefined : 'hidden'}
              animate={shouldReduceMotion ? undefined : 'show'}
              exit={shouldReduceMotion ? undefined : 'exit'}
              transition={shouldReduceMotion ? undefined : PANEL_TRANSITION}
              onClick={event => event.stopPropagation()}
            >
              {children}
            </m.div>
          </FocusTrap>
        </m.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}
