import { AnimatePresence, m } from 'framer-motion';
import { useEffect, useId, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';

import { THEME_META, getThemeDescription, getThemeLabel } from '../constants/themeMeta';
import { useLanguage } from '../contexts/LanguageContext';
import { BASE_THEME_ORDER, type BaseTheme, useTheme } from '../contexts/ThemeContext';
import { useReducedMotion } from '../hooks/useReducedMotion';

export default function ThemeSwitcher() {
  const { baseTheme, setBaseTheme } = useTheme();
  const { data } = useLanguage();
  const shouldReduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const labelId = useId();
  const menuId = useId();

  const lang = data?.lang === 'en' ? 'en' : 'es';

  const triggerLabel =
    data?.ui?.themeSwitcherLabel ??
    (lang === 'en' ? 'Theme' : 'Tema');
  const triggerSubtitle =
    data?.ui?.themeSwitcherSubtitle ??
    (lang === 'en' ? 'Visual modes' : 'Modos visuales');

  const activeMeta = THEME_META[baseTheme];

  const toggleOpen = () => setOpen(prev => !prev);

  const closeMenu = () => setOpen(false);

  const handleSelect = (theme: BaseTheme) => {
    setBaseTheme(theme);
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return undefined;
    const handleOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (!containerRef.current?.contains(target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('touchstart', handleOutside);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const firstButton = menuRef.current?.querySelector<HTMLButtonElement>('.dock-theme-switcher__option');
    firstButton?.focus();
  }, [open]);

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.stopPropagation();
      closeMenu();
    }
  };

  return (
    <div className="dock-theme-switcher" ref={containerRef}>
      <button
        type="button"
        className="dock-theme-switcher__button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-labelledby={labelId}
        onClick={toggleOpen}
      >
        <span className="dock-theme-switcher__icon" aria-hidden="true">
          {activeMeta.icon}
        </span>
        <span className="dock-theme-switcher__label" id={labelId}>
          {triggerLabel}
        </span>
        <span className="dock-theme-switcher__value">{activeMeta.label[lang]}</span>
      </button>

      <AnimatePresence>
        {open ? (
          <m.div
            className="dock-theme-switcher__menu"
            key="theme-menu"
            role="menu"
            id={menuId}
            aria-label={triggerSubtitle}
            ref={menuRef}
            onKeyDown={handleKeyDown}
            initial={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 8, scale: 0.96 }
            }
            animate={
              shouldReduceMotion
                ? { opacity: 1 }
                : { opacity: 1, y: 0, scale: 1 }
            }
            exit={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 6, scale: 0.96 }
            }
          >
            {BASE_THEME_ORDER.map(theme => {
              const meta = THEME_META[theme];
              const isActive = baseTheme === theme;
              return (
                <button
                  type="button"
                  key={theme}
                  className={`dock-theme-switcher__option ${isActive ? 'is-active' : ''}`}
                  role="menuitemradio"
                  aria-checked={isActive}
                  onClick={() => handleSelect(theme)}
                >
                  <span className="dock-theme-switcher__option-icon" aria-hidden="true">
                    {meta.icon}
                  </span>
                  <span>
                    <strong>{getThemeLabel(lang, theme)}</strong>
                    <small>{getThemeDescription(lang, theme)}</small>
                  </span>
                </button>
              );
            })}
          </m.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
