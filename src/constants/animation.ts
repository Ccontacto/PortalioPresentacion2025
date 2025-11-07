import type { Variants, Transition } from 'framer-motion';

export const PANEL_TRANSITION: Transition = { duration: 0.2, ease: 'easeOut' };

export const PANEL_VARIANTS: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 12 },
  show: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.96, y: 12 }
};

export const OVERLAY_FADE: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
  exit: { opacity: 0 }
};

