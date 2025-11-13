import { AnimatePresence, m } from 'framer-motion';
import { Briefcase, Contact, Home, Layers, Package, Sparkles } from 'lucide-react';
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import type { KeyboardEventHandler } from 'react';

import { useLanguage } from '../contexts/LanguageContext';
import { useNavigation } from '../contexts/NavigationContext';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useFloatingPanelPlacement } from '../hooks/useFloatingPanelPlacement';
import { useQuickActionsData } from './quick-actions/useQuickActionsData';

export default function HamburgerMenu() {
  const { data } = useLanguage();
  const { navigateTo } = useNavigation();
  const { navItems, preferenceItems } = useQuickActionsData();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const helpId = useId();
  const shouldReduceMotion = useReducedMotion();
  const { panelStyle, panelMaxHeight, openUp, rightAnchored } = useFloatingPanelPlacement(open, buttonRef, {
    preferredWidth: 640,
    gap: 12,
    safe: 16,
    minMaxHeight: 220
  });

  const lang = data?.lang === 'en' ? 'en' : 'es';
  const strings = useMemo(() => {
    const isEnglish = lang === 'en';
    return {
      toggleOpen: isEnglish ? 'Open navigation menu' : 'Abrir menú de navegación',
      toggleClose: isEnglish ? 'Close navigation menu' : 'Cerrar menú de navegación',
      searchPlaceholder: isEnglish ? 'Search sections or actions' : 'Buscar secciones o acciones',
      menuLabel: isEnglish ? 'Menu pages' : 'Páginas del menú',
      sectionsTitle: isEnglish ? 'Sections' : 'Secciones',
      sectionsSubtitle: isEnglish ? 'Jump anywhere instantly' : 'Explora cualquier sección',
      actionsTitle: isEnglish ? 'Quick actions' : 'Acciones rápidas',
      actionsSubtitle: isEnglish ? 'Instant preferences' : 'Preferencias instantáneas',
      emptyTitle: isEnglish ? 'No matches' : 'Sin coincidencias',
      emptySubtitle: isEnglish
        ? 'Try another term or clear the filter.'
        : 'Intenta con otro término o limpia el filtro.',
      srHint: isEnglish
        ? 'Use left and right arrows to move between pages. Home and End jump to the beginning or end.'
        : 'Usa las flechas izquierda y derecha para moverte entre páginas. Inicio y Fin saltan al principio o final.'
    };
  }, [lang]);

  const navDescriptions = useMemo(() => {
    const isEnglish = lang === 'en';
    return {
      home: isEnglish ? 'Availability, CTA and overview' : 'Disponibilidad, CTA y resumen',
      experience: isEnglish ? 'Leadership journey & squads' : 'Trayectoria y liderazgo',
      skills: isEnglish ? 'Stack & tooling' : 'Stack y herramientas',
      projects: isEnglish ? 'Launches & AI work' : 'Lanzamientos e IA aplicada',
      contact: isEnglish ? 'Direct line & messaging' : 'Contacto directo y mensajería'
    } as Record<string, string>;
  }, [lang]);

  const normalizedQuery = query.trim().toLowerCase();
  const filteredNav = useMemo(() => {
    if (!normalizedQuery) return navItems;
    return navItems.filter(item => item.label.toLowerCase().includes(normalizedQuery));
  }, [navItems, normalizedQuery]);

  const filteredActions = useMemo(() => {
    if (!normalizedQuery) return preferenceItems;
    return preferenceItems.filter(item => item.label.toLowerCase().includes(normalizedQuery));
  }, [preferenceItems, normalizedQuery]);

  const hasNav = filteredNav.length > 0;
  const hasActions = filteredActions.length > 0;
  const showEmpty = !hasNav && !hasActions;
  const featuredActions = filteredActions.slice(0, 2);
  const secondaryActions = filteredActions.slice(2);

  const getPages = useCallback(() => {
    return Array.from(contentRef.current?.querySelectorAll<HTMLElement>('.hamburger-menu__page') ?? []);
  }, []);

  const scrollToIndex = useCallback(
    (index: number, instant = false) => {
      const pages = getPages();
      if (!pages.length) return;
      const clamped = Math.max(0, Math.min(index, pages.length - 1));
      const target = pages[clamped];
      if (!target || !contentRef.current) return;
      setCurrentPage(clamped);
      const container = contentRef.current;
      const behavior = instant || shouldReduceMotion ? 'auto' : 'smooth';
      if (typeof container.scrollTo === 'function') {
        container.scrollTo({ left: target.offsetLeft, behavior });
      } else {
        container.scrollLeft = target.offsetLeft;
      }
    },
    [getPages, shouldReduceMotion]
  );

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
        case 'Escape':
          setOpen(false);
          break;
        default:
          break;
      }
    },
    [currentPage, getPages, scrollToIndex]
  );

  useEffect(() => {
    if (!open) return;
    const content = contentRef.current;
    if (!content) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const pages = getPages();
        if (!pages.length) return;
        const left = content.scrollLeft;
        let closestIndex = 0;
        let smallest = Number.POSITIVE_INFINITY;
        pages.forEach((page, idx) => {
          const diff = Math.abs(page.offsetLeft - left);
          if (diff < smallest) {
            smallest = diff;
            closestIndex = idx;
          }
        });
        setCurrentPage(closestIndex);
      });
    };
    content.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      content.removeEventListener('scroll', onScroll);
    };
  }, [open, getPages]);

  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => {
      searchInputRef.current?.focus();
      searchInputRef.current?.select();
      scrollToIndex(0, true);
    });
    return () => cancelAnimationFrame(frame);
  }, [open, scrollToIndex, filteredNav.length, filteredActions.length]);

  useEffect(() => {
    if (!open) {
      setQuery('');
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };
    const onPointer = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      const insideButton = containerRef.current?.contains(target);
      const insidePanel = panelRef.current?.contains(target);
      if (insideButton || insidePanel) {
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

  const handleToggle = () => {
    setOpen(prev => !prev);
  };

  const handleNavigate = (id: string) => {
    navigateTo(id);
    setOpen(false);
    setQuery('');
  };

  const handleAction = async (action?: () => void | Promise<void>) => {
    if (action) {
      try {
        await action();
      } catch (error) {
        console.error('Quick action failed', error);
      }
    }
    setOpen(false);
    setQuery('');
  };

  if (!navItems.length && !preferenceItems.length) {
    return null;
  }

  const navIconFor = (id: string) => {
    switch (id) {
      case 'home':
        return <Home size={18} aria-hidden />;
      case 'experience':
        return <Briefcase size={18} aria-hidden />;
      case 'skills':
        return <Layers size={18} aria-hidden />;
      case 'projects':
        return <Package size={18} aria-hidden />;
      case 'contact':
        return <Contact size={18} aria-hidden />;
      default:
        return <Sparkles size={18} aria-hidden />;
    }
  };

  const panelInlineStyle = panelStyle
    ? (panelMaxHeight ? { ...panelStyle, maxHeight: panelMaxHeight } : panelStyle)
    : undefined;

  const srHintId = helpId || 'menu-pages-help';

  return (
    <div ref={containerRef} className="hamburger-menu" data-dev-id="1300">
      <button
        type="button"
        className="hamburger-menu__button"
        ref={buttonRef}
        aria-expanded={open}
        aria-controls="floating-nav"
        aria-label={open ? strings.toggleClose : strings.toggleOpen}
        onClick={handleToggle}
        data-retro-sfx
      >
        <span className="hamburger-menu__icon" aria-hidden="true">
          <span className="hamburger-menu__line hamburger-menu__line--top" />
          <span className="hamburger-menu__line hamburger-menu__line--middle" />
          <span className="hamburger-menu__line hamburger-menu__line--bottom" />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <m.nav
            id="floating-nav"
            aria-label={strings.menuLabel}
            className="hamburger-menu__panel"
            ref={panelRef}
            style={panelInlineStyle}
            initial={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.94, y: -6 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, scale: 1, y: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
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
                placeholder={strings.searchPlaceholder}
                aria-label={strings.searchPlaceholder}
              />
            </div>
            <div
              className="hamburger-menu__content"
              role="region"
              aria-label={strings.menuLabel}
              aria-describedby={srHintId}
              ref={contentRef}
              tabIndex={-1}
              onKeyDown={handlePageKeyDown}
              data-current-page={currentPage}
            >
              <p id={srHintId} className="sr-only">
                {strings.srHint}
              </p>

              {showEmpty ? (
                <div className="hamburger-menu__page">
                  <div className="hamburger-menu__empty" role="status">
                    <p className="hamburger-menu__empty-title">{strings.emptyTitle}</p>
                    <p className="hamburger-menu__empty-subtitle">{strings.emptySubtitle}</p>
                  </div>
                </div>
              ) : (
                <>
                  {hasNav ? (
                    <section className="hamburger-menu__page" aria-label={strings.sectionsTitle}>
                      <div className="hamburger-menu__group-header">
                        <p>{strings.sectionsTitle}</p>
                        <span>{strings.sectionsSubtitle}</span>
                      </div>
                      <div className="hamburger-menu__grid" role="list">
                        {filteredNav.map(item => (
                          <div key={item.id} className="hamburger-menu__pill-wrapper" role="listitem">
                            <button
                              type="button"
                              className="hamburger-menu__pill"
                              onClick={() => handleNavigate(item.id)}
                              data-nav-id={item.id}
                              aria-label={`${item.label}. ${navDescriptions[item.id] ?? ''}`}
                            >
                              <span className="hamburger-menu__pill-icon">{navIconFor(item.id)}</span>
                              <span className="hamburger-menu__pill-label">{item.label}</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </section>
                  ) : null}

                  {hasActions ? (
                    <section className="hamburger-menu__page" aria-label={strings.actionsTitle}>
                      <div className="hamburger-menu__group-header">
                        <p>{strings.actionsTitle}</p>
                        <span>{strings.actionsSubtitle}</span>
                      </div>
                      {featuredActions.length ? (
                        <div className="hamburger-menu__featured" role="list">
                          {featuredActions.map(action => (
                            <div key={action.key} className="hamburger-menu__featured-item" role="listitem">
                              <button
                                type="button"
                                className="hamburger-menu__featured-btn"
                                onClick={() => handleAction(action.action)}
                                disabled={action.disabled}
                                aria-disabled={action.disabled ? 'true' : 'false'}
                                data-action-id={action.key}
                              >
                                {action.icon ? (
                                  <span className="hamburger-menu__featured-icon" aria-hidden>
                                    {action.icon}
                                  </span>
                                ) : null}
                                <span className="hamburger-menu__featured-label">{action.label}</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : null}
                      {secondaryActions.length ? (
                        <ul className="hamburger-menu__action-list" role="list">
                          {secondaryActions.map(action => (
                            <li key={action.key} className="hamburger-menu__action-item">
                              <button
                                type="button"
                                className="hamburger-menu__action"
                                onClick={() => handleAction(action.action)}
                                disabled={action.disabled}
                                aria-disabled={action.disabled ? 'true' : 'false'}
                                data-action-id={action.key}
                              >
                                {action.icon ? (
                                  <span className="hamburger-menu__action-icon" aria-hidden>
                                    {action.icon}
                                  </span>
                                ) : null}
                                <span className="hamburger-menu__action-label">{action.label}</span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : null}
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
