import type { Variants, Transition } from 'framer-motion';

export const PANEL_TRANSITION: Transition = { duration: 0.2, ease: [0.2, 0, 0, 1] };

export const OVERLAY_FADE: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
  exit: { opacity: 0 }
};

export const DIALOG_VARIANTS: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 20 },
  show: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.96, y: 20 }
};
