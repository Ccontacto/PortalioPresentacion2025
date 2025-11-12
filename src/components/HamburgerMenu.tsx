import { AnimatePresence, m } from 'framer-motion';
import { Briefcase, Contact, Home, Package, Sparkles, Wrench, Layers, Mail } from 'lucide-react';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useId,
  type KeyboardEventHandler
} from 'react';

import { useNavigation } from '../contexts/NavigationContext';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useFloatingPanelPlacement } from '../hooks/useFloatingPanelPlacement';
import { useQuickActionsData } from './quick-actions/useQuickActionsData';

export default function HamburgerMenu() {
  const { navigateTo } = useNavigation();
  const { navItems, preferenceItems } = useQuickActionsData();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const { panelStyle, panelMaxHeight, openUp, rightAnchored } = useFloatingPanelPlacement(open, buttonRef, {
    preferredWidth: 320,
    gap: 8,
    safe: 12,
    minMaxHeight: 180
  });
  const pagesHelpId = useId();
  const [currentPage, setCurrentPage] = useState(0);
  const pagesLabel = 'Páginas del menú';

  const getPages = useCallback(() => {
    if (!contentRef.current) return [] as HTMLElement[];
    return Array.from(contentRef.current.querySelectorAll<HTMLElement>('.hamburger-menu__page'));
  }, []);

  const scrollToIndex = useCallback(
    (index: number, immediate = false) => {
      const pages = getPages();
      if (!pages.length) {
        setCurrentPage(0);
        return;
      }
      const clamped = Math.max(0, Math.min(index, pages.length - 1));
      const target = pages[clamped];
      setCurrentPage(clamped);
      const behavior = shouldReduceMotion || immediate ? 'auto' : 'smooth';
      if (contentRef.current?.scrollTo) {
        contentRef.current.scrollTo({ left: target.offsetLeft, behavior });
      } else if (contentRef.current) {
        contentRef.current.scrollLeft = target.offsetLeft;
      }
    },
    [getPages, shouldReduceMotion]
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };
    const onPointer = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      const isInsideButton = containerRef.current?.contains(target);
      const isInsidePanel = panelRef.current?.contains(target);
      if (isInsideButton || isInsidePanel) {
        return;
      }
      setOpen(false);
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
    const frame = requestAnimationFrame(() => {
      searchInputRef.current?.focus();
      searchInputRef.current?.select();
    });
    return () => cancelAnimationFrame(frame);
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

  const handlePageKeyDown = useCallback<KeyboardEventHandler<HTMLDivElement>>(
    event => {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }
      switch (event.key) {
        case 'ArrowRight':
          event.preventDefault();
          scrollToIndex(currentPage + 1);
          break;
        case 'ArrowLeft':
          event.preventDefault();
          scrollToIndex(currentPage - 1);
          break;
        case 'Home':
          event.preventDefault();
          scrollToIndex(0);
          break;
        case 'End':
          event.preventDefault();
          scrollToIndex(getPages().length - 1);
          break;
        default:
          break;
      }
    },
    [currentPage, scrollToIndex, getPages]
  );

  useEffect(() => {
    if (!open) {
      setCurrentPage(0);
      return;
    }
    const frame = requestAnimationFrame(() => scrollToIndex(0, true));
    return () => cancelAnimationFrame(frame);
  }, [open, scrollToIndex, filteredNav.length, filteredActions.length]);

  const navIconFor = (id: string) => {
    switch (id) {
      case 'home': return <Home size={18} aria-hidden />;
      case 'experience': return <Briefcase size={18} aria-hidden />;
      case 'skills': return <Layers size={18} aria-hidden />;
      case 'projects': return <Package size={18} aria-hidden />;
      case 'contact': return <Mail size={18} aria-hidden />;
      default: return <Sparkles size={18} aria-hidden />;
    }
  };

  return (
    <div ref={containerRef} className="hamburger-menu" data-dev-id="1300">
      <button
        type="button"
        className="hamburger-menu__button"
        ref={buttonRef}
        aria-expanded={open}
        aria-controls="floating-nav"
        aria-label={open ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
        onClick={handleToggle}
        onTouchEnd={e => { e.preventDefault(); setOpen(prev => !prev); }}
        data-retro-sfx
      >
        <span className="hamburger-menu__icon" aria-hidden="true">
          <span className="hamburger-menu__line hamburger-menu__line--top" />
          <span className="hamburger-menu__line hamburger-menu__line--middle" />
          <span className="hamburger-menu__line hamburger-menu__line--bottom" />
        </span>
        {/* Round button: hide textual label to keep it circular; keep aria-label for a11y */}
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <m.nav
            id="floating-nav"
            aria-label="Secciones del sitio"
            className="hamburger-menu__panel"
            ref={panelRef}
            style={panelStyle}
            initial={panelVariants ? 'hidden' : undefined}
            animate={panelVariants ? 'visible' : undefined}
            exit={panelVariants ? 'exit' : undefined}
            variants={panelVariants}
            transition={panelVariants ? { duration: 0.18, ease: [0.4, 0, 0.2, 1] } : undefined}
          >
            <span
              className={`hamburger-menu__caret ${openUp ? 'is-bottom' : 'is-top'} ${rightAnchored ? 'is-right' : 'is-left'}`}
              aria-hidden="true"
            />
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
            <div
              className="hamburger-menu__content"
              role="region"
              aria-label={pagesLabel}
              aria-describedby={pagesHelpId}
              ref={contentRef}
              data-current-page={currentPage}
              tabIndex={0}
              onKeyDown={handlePageKeyDown}
            >
              <p id={pagesHelpId} className="sr-only">
                Usa las flechas izquierda y derecha para navegar por todas las páginas del menú. Home va al
                inicio y End al final.
              </p>
              {showEmpty ? (
                <div className="hamburger-menu__empty" role="status">
                  <p className="hamburger-menu__empty-title">Sin coincidencias</p>
                  <p className="hamburger-menu__empty-subtitle">Intenta con otro término o limpia el filtro.</p>
                </div>
              ) : (
                <>
                  {hasNav ? (
                    <section className="hamburger-menu__page">
                      <p className="hamburger-menu__section-label">Secciones</p>
                      <ul className="hamburger-menu__grid" role="list">
                        {filteredNav.slice(0, 5).map(item => (
                          <li key={item.id} role="listitem">
                            <button
                              type="button"
                              onClick={() => handleNavigate(item.id)}
                              className="hamburger-menu__pill"
                              data-nav-id={item.id}
                            >
                              <span className="hamburger-menu__pill-icon">{navIconFor(item.id)}</span>
                              <span className="hamburger-menu__pill-label">{item.label}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </section>
                  ) : null}
                  {hasActions ? (
                    <section className="hamburger-menu__page">
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
                              {item.icon ? (
                                <span className="hamburger-menu__action-icon" aria-hidden>
                                  {item.icon}
                                </span>
                              ) : null}
                              <span className="hamburger-menu__action-label">{item.label}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </section>
                  ) : null}
                </>
              )}
            </div>

          </m.nav>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
