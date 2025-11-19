export type CssVariableToken = {
  variable: `--${string}`;
  fallback: string;
};

const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

export const ACCENT_COLOR_TOKENS = {
  auroraPink: { variable: '--color-accent-aurora-pink', fallback: '#FFB7DD' },
  electricTeal: { variable: '--color-accent-electric-teal', fallback: '#A0E7E5' },
  mintPulse: { variable: '--color-accent-mint-pulse', fallback: '#B5EAD7' },
  neonBurst: { variable: '--color-accent-neon-burst', fallback: '#39FF14' },
  solarDawn: { variable: '--color-accent-solar-dawn', fallback: '#FFF3B0' }
} as const satisfies Record<string, CssVariableToken>;

const getDocumentStyles = () => {
  if (!isBrowser) return null;
  return window.getComputedStyle(document.documentElement);
};

export const readCssVariable = ({ variable, fallback }: CssVariableToken) => {
  const styles = getDocumentStyles();
  if (!styles) return fallback;
  const value = styles.getPropertyValue(variable);
  return value?.trim() || fallback;
};

export const getAccentColorPalette = () =>
  Object.values(ACCENT_COLOR_TOKENS).map(token => readCssVariable(token));

export const cssVar = ({ variable, fallback }: CssVariableToken) => `var(${variable}, ${fallback})`;
