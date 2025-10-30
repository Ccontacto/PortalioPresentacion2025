import { useCallback, useRef, type JSX, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { Home, Briefcase, Code, Rocket, Mail } from 'lucide-react';
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

  return (
    <div className="dock-container">
      {/* MEJORA 1: nav con role y aria-label */}
      <motion.nav
        className="dock"
        role="navigation"
        aria-label="Navegación principal del portfolio"
        onKeyDown={handleKeyNavigation}
        initial={shouldReduceMotion ? undefined : { y: 100 }}
        animate={shouldReduceMotion ? undefined : { y: 0 }}
        transition={shouldReduceMotion ? undefined : { type: 'spring', delay: 0.5 }}
      >
        {data.nav.map((item, index) => (
          <button
            key={item.id}
            className={`dock-item ${activePage === item.id ? 'active' : ''}`}
            onClick={() => navigateTo(item.id)}
            ref={node => {
              buttonRefs.current[index] = node;
            }}
            // MEJORA 1: aria-current para página activa
            aria-current={activePage === item.id ? 'page' : undefined}
            // MEJORA 3: aria-label explícito
            aria-label={item.label}
            title={item.label}
          >
            {icons[item.id] || <Home size={24} aria-hidden="true" />}
          </button>
        ))}
      </motion.nav>
    </div>
  );
}
