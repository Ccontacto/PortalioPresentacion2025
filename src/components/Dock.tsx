import { m } from 'framer-motion';
import { useCallback, useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';

import { useLanguage } from '../contexts/LanguageContext';
import { useNavigation } from '../contexts/NavigationContext';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { navIconFor } from '../utils/navIcons';

import ThemeSwitcher from './ThemeSwitcher';

export default function Dock() {
  const { data } = useLanguage();
  const { activePage, navigateTo } = useNavigation();
  const shouldReduceMotion = useReducedMotion();
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [isDockVisible, setIsDockVisible] = useState(true);
  const scrollTimeoutRef = useRef<number | null>(null);

  buttonRefs.current.length = data.nav.length;

  const handleKeyNavigation = useCallback((event: ReactKeyboardEvent<HTMLDivElement>) => {
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
  }, []);

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

  return (
    <div className="dock-container">
      <m.nav
        className="dock"
        role="navigation"
        aria-label="Navegación principal del portfolio"
        onKeyDown={handleKeyNavigation}
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
                delay: 0.3
              }
        }
        style={{ pointerEvents: isDockVisible ? 'auto' : 'none' }}
      >
        {data.nav.map((item, index) => (
          <button
            key={item.id}
            className={`dock-item ${activePage === item.id ? 'active' : ''}`}
            onClick={() => navigateTo(item.id)}
            ref={node => {
              buttonRefs.current[index] = node;
            }}
            aria-current={activePage === item.id ? 'page' : undefined}
            aria-label={item.label}
            title={item.label}
            data-retro-sfx
          >
            <span className="dock-item__icon" aria-hidden="true">
              {navIconFor(item.id, 22)}
            </span>
          </button>
        ))}
        <ThemeSwitcher />
      </m.nav>
    </div>
  );
}
