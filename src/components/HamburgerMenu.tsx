import { AnimatePresence, m } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';

import { useNavigation } from '../contexts/NavigationContext';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useQuickActionsData } from './quick-actions/useQuickActionsData';

export default function HamburgerMenu() {
  const { navigateTo } = useNavigation();
  const { navItems, preferenceItems } = useQuickActionsData();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };
    const onPointer = (event: MouseEvent | TouchEvent) => {
      if (!containerRef.current) return;
      const target = event.target as Node;
      if (!containerRef.current.contains(target)) {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('touchstart', onPointer);

    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('touchstart', onPointer);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (typeof window === 'undefined') return;
    const frame = window.requestAnimationFrame(() => {
      searchInputRef.current?.focus();
      searchInputRef.current?.select();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [open]);

  useEffect(() => {
    if (!open && query) {
      setQuery('');
    }
  }, [open, query]);

  const handleToggle = () => {
    setOpen(prev => !prev);
  };

  const handleNavigate = (id: string) => {
    navigateTo(id);
    setOpen(false);
    setQuery('');
  };

  const handleAction = (action?: () => void | Promise<void>) => {
    if (action) {
      action();
    }
    setOpen(false);
    setQuery('');
  };

  const panelVariants = shouldReduceMotion
    ? undefined
    : {
        hidden: { opacity: 0, scale: 0.95, y: -4 },
        visible: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.96, y: -6 }
      };

  if (!navItems.length && !preferenceItems.length) {
    return null;
  }

  const normalizedQuery = query.trim().toLowerCase();

  const filteredNav = useMemo(() => {
    if (!normalizedQuery) return navItems;
    return navItems.filter(item => item.label.toLowerCase().includes(normalizedQuery));
  }, [navItems, normalizedQuery]);

  const filteredActions = useMemo(() => {
    if (!normalizedQuery) return preferenceItems;
    return preferenceItems.filter(item => item.label.toLowerCase().includes(normalizedQuery));
  }, [preferenceItems, normalizedQuery]);

  const hasActions = filteredActions.length > 0;
  const hasNav = filteredNav.length > 0;
  const showEmpty = !hasNav && !hasActions;

  return (
    <div ref={containerRef} className="hamburger-menu" data-dev-id="1300">
      <button
        type="button"
        className="hamburger-menu__button"
        aria-expanded={open}
        aria-controls="floating-nav"
        aria-label={open ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
        onClick={handleToggle}
        data-retro-sfx
      >
        <span className="hamburger-menu__icon" aria-hidden="true">
          <span className="hamburger-menu__line hamburger-menu__line--top" />
          <span className="hamburger-menu__line hamburger-menu__line--middle" />
          <span className="hamburger-menu__line hamburger-menu__line--bottom" />
        </span>
        <span className="hamburger-menu__label">Menú</span>
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <m.nav
            id="floating-nav"
            aria-label="Secciones del sitio"
            className="hamburger-menu__panel"
            initial={panelVariants ? 'hidden' : undefined}
            animate={panelVariants ? 'visible' : undefined}
            exit={panelVariants ? 'exit' : undefined}
            variants={panelVariants}
            transition={panelVariants ? { duration: 0.18, ease: [0.4, 0, 0.2, 1] } : undefined}
          >
            <div className="hamburger-menu__search">
              <input
                ref={searchInputRef}
                type="search"
                value={query}
                onChange={event => setQuery(event.target.value)}
                placeholder="Buscar secciones o acciones"
                aria-label="Buscar en el menú"
              />
            </div>

            {showEmpty ? (
              <div className="hamburger-menu__empty" role="status">
                <p className="hamburger-menu__empty-title">Sin coincidencias</p>
                <p className="hamburger-menu__empty-subtitle">Intenta con otro término o limpia el filtro.</p>
              </div>
            ) : (
              <>
                {hasNav ? (
                  <div className="hamburger-menu__section">
                    <p className="hamburger-menu__section-label">Secciones</p>
                    <ul className="hamburger-menu__list" role="list">
                      {filteredNav.map(item => (
                        <li key={item.id} className="hamburger-menu__item">
                          <button
                            type="button"
                            onClick={() => handleNavigate(item.id)}
                            className="hamburger-menu__link"
                            data-nav-id={item.id}
                          >
                            {item.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {hasActions ? (
                  <>
                    <div className="hamburger-menu__divider" aria-hidden="true"></div>
                    <div className="hamburger-menu__section">
                      <p className="hamburger-menu__section-label">Acciones rápidas</p>
                      <ul className="hamburger-menu__actions" role="list">
                        {filteredActions.map(item => (
                          <li key={item.key} className="hamburger-menu__action-item">
                            <button
                              type="button"
                              className="hamburger-menu__action"
                              onClick={() => handleAction(item.action)}
                              disabled={item.disabled}
                              aria-disabled={item.disabled ? 'true' : 'false'}
                              data-action-id={item.key}
                            >
                              {item.label}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                ) : null}
              </>
            )}
          </m.nav>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
