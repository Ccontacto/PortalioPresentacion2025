import { AnimatePresence, motion } from 'framer-motion';
import { Briefcase, Code, Ellipsis, Home, Mail, Rocket } from 'lucide-react';
import { useCallback, useEffect, useRef, useState, type JSX, type KeyboardEvent as ReactKeyboardEvent } from 'react';

import { useLanguage } from '../contexts/LanguageContext';
import { useNavigation } from '../contexts/NavigationContext';
import { useReducedMotion } from '../hooks/useReducedMotion';

const icons: Record<string, JSX.Element> = {
  home: <Home size={24} aria-hidden="true" />,
  experience: <Briefcase size={24} aria-hidden="true" />,
  skills: <Code size={24} aria-hidden="true" />,
  projects: <Rocket size={24} aria-hidden="true" />,
  contact: <Mail size={24} aria-hidden="true" />
};

export default function Dock() {
  const { data } = useLanguage();
  const { activePage, navigateTo } = useNavigation();
  const shouldReduceMotion = useReducedMotion();
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [isDockVisible, setIsDockVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const scrollTimeoutRef = useRef<number | null>(null);

  buttonRefs.current.length = data.nav.length;

  const handleKeyNavigation = useCallback((event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!isExpanded) {
      return;
    }
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') {
      return;
    }

    const buttons = buttonRefs.current.filter(Boolean) as HTMLButtonElement[];
    if (buttons.length === 0) {
      return;
    }

    event.preventDefault();

    const activeElement = document.activeElement as HTMLButtonElement | null;
    const currentIndex = buttons.findIndex(button => button === activeElement);
    const direction = event.key === 'ArrowRight' ? 1 : -1;

    const targetIndex =
      currentIndex === -1 ? (direction === 1 ? 0 : buttons.length - 1) : (currentIndex + direction + buttons.length) % buttons.length;

    buttons[targetIndex]?.focus();
  }, [isExpanded]);

  useEffect(() => {
    if (shouldReduceMotion) {
      return undefined;
    }

    const handleScroll = () => {
      const currentY = window.scrollY;

      if (currentY < 80) {
        setIsDockVisible(true);
        if (scrollTimeoutRef.current) {
          window.clearTimeout(scrollTimeoutRef.current);
          scrollTimeoutRef.current = null;
        }
        return;
      }

      setIsDockVisible(prev => {
        if (!prev) return prev;
        return false;
      });
      setIsExpanded(false);

      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = window.setTimeout(() => {
        setIsDockVisible(true);
      }, 1000);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [shouldReduceMotion]);

  useEffect(() => {
    if (!isExpanded) {
      return undefined;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsExpanded(false);
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (!target) {
        setIsExpanded(false);
        return;
      }
      if (toggleRef.current?.contains(target)) {
        return;
      }
      if (navRef.current?.contains(target)) {
        return;
      }
      setIsExpanded(false);
    };

    window.addEventListener('keydown', handleEscape);
    window.addEventListener('pointerdown', handlePointerDown, { capture: true });
    return () => {
      window.removeEventListener('keydown', handleEscape);
      window.removeEventListener('pointerdown', handlePointerDown, { capture: true });
    };
  }, [isExpanded]);

  const handleToggle = () => {
    setIsExpanded(prev => !prev);
  };

  const handleNavigate = (sectionId: string) => {
    navigateTo(sectionId);
    setIsExpanded(false);
  };

  const navItems = data.nav ?? [];
  const activeNav = navItems.find(item => item.id === activePage) ?? navItems[0];
  const orderedNavItems = activeNav
    ? [activeNav, ...navItems.filter(item => item.id !== activeNav.id)]
    : navItems;
  const currentIcon = activeNav ? icons[activeNav.id] ?? <Home size={24} aria-hidden="true" /> : <Home size={24} aria-hidden="true" />;
  const toggleLabel = isExpanded ? 'Cerrar navegación flotante' : 'Abrir navegación flotante';

  return (
    <div className="dock-container">
      <motion.div
        className="dock-shell"
        layout
        initial={shouldReduceMotion ? undefined : { y: 120, opacity: 0 }}
        animate={
          shouldReduceMotion
            ? undefined
            : {
                y: isDockVisible ? 0 : 120,
                opacity: isDockVisible ? 1 : 0
              }
        }
        transition={
          shouldReduceMotion
            ? undefined
            : {
                type: 'spring',
                stiffness: 260,
                damping: 28,
                delay: 0.2
              }
        }
        style={{ pointerEvents: isDockVisible ? 'auto' : 'none' }}
      >
        <AnimatePresence initial={false} mode="wait">
          {!isExpanded && (
            <motion.div
              key="dock-collapsed"
              className="dock-collapsed"
              initial={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.8, y: 12 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1, scale: 1, y: 0 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.65, y: -8 }}
              transition={
                shouldReduceMotion
                  ? undefined
                  : {
                      type: 'spring',
                      stiffness: 320,
                      damping: 28
                    }
              }
            >
              <button
                type="button"
                className="dock-current"
                aria-label={activeNav ? `Ir a ${activeNav.label}` : 'Ir a inicio'}
                title={activeNav?.label ?? 'Inicio'}
              onClick={() => {
                if (activeNav) {
                  handleNavigate(activeNav.id);
                } else {
                  handleNavigate('home');
                }
                }}
              >
                {currentIcon}
              </button>
              <button
                type="button"
                className={`dock-toggle ${isExpanded ? 'is-active' : ''}`}
                ref={toggleRef}
                aria-label={toggleLabel}
                aria-pressed={isExpanded}
                aria-expanded={isExpanded}
                onClick={handleToggle}
              >
                <Ellipsis size={22} aria-hidden="true" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isExpanded && (
            <motion.nav
              key="dock-nav"
              ref={node => {
                navRef.current = node;
              }}
              className="dock"
              layout
              role="navigation"
              aria-label="Navegación principal del portfolio"
              onKeyDown={handleKeyNavigation}
              initial={shouldReduceMotion ? undefined : { opacity: 0, y: 24, scale: 0.85 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, y: 18, scale: 0.7 }}
              transition={
                shouldReduceMotion
                  ? undefined
                  : {
                      type: 'spring',
                      stiffness: 280,
                      damping: 30
                    }
              }
            >
              {orderedNavItems.map((item, index) => (
                <button
                  key={item.id}
                  className={`dock-item ${activePage === item.id ? 'active' : ''}`}
                  onClick={() => handleNavigate(item.id)}
                  ref={node => {
                    buttonRefs.current[index] = node;
                  }}
                  aria-current={activePage === item.id ? 'page' : undefined}
                  aria-label={item.label}
                  title={item.label}
                  data-retro-sfx
                >
                  {icons[item.id] || <Home size={24} aria-hidden="true" />}
                </button>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
