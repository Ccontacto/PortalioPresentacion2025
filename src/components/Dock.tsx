import { AnimatePresence, m, type Variants } from 'framer-motion';
import { Briefcase, Code, Ellipsis, Home, Mail, Rocket } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState, type JSX, type KeyboardEvent as ReactKeyboardEvent } from 'react';

import { MOTION, SPRING } from '../constants/animation';
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

const capsuleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.65, y: 14 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
  transition: {
      type: 'spring',
      stiffness: SPRING.stiffness,
      damping: SPRING.damping,
      staggerChildren: 0.05,
      delayChildren: 0.08
    }
  },
  exit: { opacity: 0, scale: 0.8, y: 10, transition: { duration: MOTION.fast } }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: SPRING.stiffness,
      damping: SPRING.damping
    }
  }
};

const collapsedActiveVariants: Variants = {
  rest: { x: 0, opacity: 1, scale: 1 },
  exit: {
    x: -32,
    opacity: 0,
    scale: 0.92,
    transition: { duration: MOTION.fast, ease: 'easeInOut' }
  }
};

const collapsedToggleVariants: Variants = {
  rest: { x: 0, opacity: 1, scale: 1 },
  exit: {
    x: 32,
    opacity: 0,
    scale: 0.92,
    transition: { duration: MOTION.fast, ease: 'easeInOut' }
  }
};

const navVariants: Variants = {
  hidden: { opacity: 0, scale: 0.85, y: 12 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: SPRING.stiffness, damping: SPRING.damping }
  },
  exit: { opacity: 0, scale: 0.8, y: 10, transition: { duration: MOTION.fast } }
};

export default function Dock() {
  const { data } = useLanguage();
  const { activePage, navigateTo } = useNavigation();
  const shouldReduceMotion = useReducedMotion();

  const navItems = useMemo(() => data.nav ?? [], [data.nav]);
  const hasNavItems = navItems.length > 0;
  const activeNav = hasNavItems ? navItems.find(item => item.id === activePage) ?? navItems[0] : undefined;
  const secondaryNavItems =
    hasNavItems && activeNav ? navItems.filter(item => item.id !== activeNav.id) : [];
  const currentIcon =
    activeNav && activeNav.id in icons ? icons[activeNav.id] : <Home size={24} aria-hidden="true" />;

  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  buttonRefs.current.length = navItems.length;

  const [isDockVisible, setIsDockVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const scrollTimeoutRef = useRef<number | null>(null);

  const handleKeyNavigation = useCallback(
    (event: ReactKeyboardEvent<HTMLDivElement>) => {
      if (!isExpanded) {
        return;
      }
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') {
        return;
      }

      const buttons = buttonRefs.current.filter(Boolean) as HTMLButtonElement[];
      if (!buttons.length) {
        return;
      }

      event.preventDefault();

      const activeElement = document.activeElement as HTMLButtonElement | null;
      const currentIndex = buttons.findIndex(button => button === activeElement);
      const direction = event.key === 'ArrowRight' ? 1 : -1;
      const targetIndex =
        currentIndex === -1
          ? direction === 1
            ? 0
            : buttons.length - 1
          : (currentIndex + direction + buttons.length) % buttons.length;

      buttons[targetIndex]?.focus();
    },
    [isExpanded]
  );

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
      if (toggleRef.current?.contains(target) || navRef.current?.contains(target)) {
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

  const handleToggle = () => setIsExpanded(prev => !prev);
  const handleNavigate = (sectionId: string) => {
    navigateTo(sectionId);
    setIsExpanded(false);
  };

  if (!hasNavItems || !activeNav) {
    return null;
  }

  return (
    <div className="dock-container" data-dev-id="9200">
      <m.div
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
                stiffness: SPRING.stiffness,
                damping: SPRING.damping,
                delay: 0.2
              }
        }
      >
        <AnimatePresence initial={false} mode="wait">
          {!isExpanded && activeNav && (
            <m.div
              key="dock-collapsed"
              className="dock-collapsed"
              initial={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.9, y: 10 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1, scale: 1, y: 0 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.95, y: -6 }}
              transition={
                shouldReduceMotion
                  ? undefined
                  : {
                      type: 'spring',
                      stiffness: SPRING.stiffness,
                      damping: SPRING.damping
                    }
              }
            >
              <m.button
                layoutId="dock-active"
                type="button"
                className="dock-current"
                data-dev-id="9201"
                aria-label={`Ir a ${activeNav.label}`}
                title={activeNav.label}
                onClick={() => handleNavigate(activeNav.id)}
                variants={shouldReduceMotion ? undefined : collapsedActiveVariants}
                initial={shouldReduceMotion ? undefined : 'rest'}
                animate={shouldReduceMotion ? undefined : 'rest'}
                exit={shouldReduceMotion ? undefined : 'exit'}
              >
                {currentIcon}
              </m.button>

              <m.button
                layoutId="dock-toggle"
                type="button"
                className="dock-toggle"
                ref={toggleRef}
                data-dev-id="9202"
                aria-label={isExpanded ? 'Cerrar navegación flotante' : 'Abrir navegación flotante'}
                aria-pressed={isExpanded}
                aria-expanded={isExpanded}
                onClick={handleToggle}
                variants={shouldReduceMotion ? undefined : collapsedToggleVariants}
                initial={shouldReduceMotion ? undefined : 'rest'}
                animate={shouldReduceMotion ? undefined : 'rest'}
                exit={shouldReduceMotion ? undefined : 'exit'}
              >
                <Ellipsis size={22} aria-hidden="true" />
              </m.button>
            </m.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isExpanded && (
            <m.nav
              key="dock-nav"
              ref={node => {
                navRef.current = node;
              }}
              className="dock"
              data-dev-id="9203"
              role="navigation"
              aria-label="Navegación flotante"
              onKeyDown={handleKeyNavigation}
              variants={shouldReduceMotion ? undefined : navVariants}
              initial="hidden"
              animate="show"
              exit="exit"
            >
              <m.button
                layoutId="dock-active"
                className={`dock-item dock-item--active ${activePage === activeNav.id ? 'active' : ''}`}
                onClick={() => handleNavigate(activeNav.id)}
                aria-current={activePage === activeNav.id ? 'page' : undefined}
                aria-label={activeNav.label}
                title={activeNav.label}
              >
                {currentIcon}
              </m.button>

              <m.div
                layoutId="dock-toggle"
                className="dock-list"
                variants={shouldReduceMotion ? undefined : capsuleVariants}
                initial="hidden"
                animate="show"
                exit="exit"
              >
                {secondaryNavItems.map(item => (
                  <m.button
                    key={item.id}
                    className={`dock-item ${activePage === item.id ? 'active' : ''}`}
                    onClick={() => handleNavigate(item.id)}
                    ref={node => {
                      const navIndex = navItems.findIndex(navItem => navItem.id === item.id);
                      if (navIndex >= 0) {
                        buttonRefs.current[navIndex] = node;
                      }
                    }}
                    aria-current={activePage === item.id ? 'page' : undefined}
                    aria-label={item.label}
                    title={item.label}
                    variants={shouldReduceMotion ? undefined : itemVariants}
                    initial="hidden"
                    animate="show"
                    exit="hidden"
                  >
                    {icons[item.id] || <Home size={24} aria-hidden="true" />}
                  </m.button>
                ))}
              </m.div>
            </m.nav>
          )}
        </AnimatePresence>
      </m.div>
    </div>
  );
}
