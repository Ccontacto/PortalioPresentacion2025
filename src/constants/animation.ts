import type { Variants, Transition } from 'framer-motion';

// Unificación de tiempos y easings para coherencia de motion
export const MOTION = {
  fast: 0.12,
  normal: 0.2,
  slow: 0.32,
  ease: [0.2, 0, 0, 1] as [number, number, number, number]
} as const;

export const SPRING = {
  stiffness: 280,
  damping: 28
} as const;

export const PANEL_TRANSITION: Transition = { duration: MOTION.normal, ease: MOTION.ease };

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

// Variantes genéricas reutilizables
export const FADE: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
  exit: { opacity: 0 }
};

export const SLIDE_Y: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 24 }
};

export const DIALOG_VARIANTS: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 20 },
  show: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.96, y: 20 }
};
