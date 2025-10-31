import { useEffect, useReducer, useRef } from 'react';
import type { JSX } from 'react';
import { motion } from 'framer-motion';
import FocusTrap from 'focus-trap-react';
import {
  Sun,
  Moon,
  Download,
  Copy,
  Mail,
  Sparkles,
  Linkedin,
  Github,
  Globe,
  MoreHorizontal,
  X,
  Languages,
  CheckCircle,
  TriangleAlert,
  Handshake
} from 'lucide-react';
import { WhatsappGlyph } from './icons/WhatsappGlyph';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';
import { generatePdf } from '../utils/pdfGenerator';
import { useNavigation } from '../contexts/NavigationContext';
import type { AvailabilityKey } from '../types/portfolio';

type AvailabilityState = AvailabilityKey;
type HeaderPanel = 'overflow';

type HeaderState = {
  availability: AvailabilityState;
  mobileMenuOpen: boolean;
  confettiRemaining: number;
  activePanel: HeaderPanel | null;
};

type HeaderAction =
  | { type: 'setAvailability'; payload: AvailabilityState }
  | { type: 'openMobileMenu' }
  | { type: 'closeMobileMenu' }
  | { type: 'setConfetti'; payload: number }
  | { type: 'setPanel'; payload: HeaderPanel | null };

const availabilityCycle: AvailabilityState[] = ['available', 'listening', 'unavailable'];
const CONFETTI_COOLDOWN_MS = 5000;
const CONFETTI_TICK_MS = 200;
const availabilityIconMap: Record<AvailabilityState, JSX.Element> = {
  available: <CheckCircle size={24} aria-hidden="true" />,
  listening: <Handshake size={24} aria-hidden="true" />,
  unavailable: <TriangleAlert size={24} aria-hidden="true" />
};

const getInitialHeaderState = (): HeaderState => {
  let availability: AvailabilityState = 'available';
  if (typeof window !== 'undefined') {
    const stored = window.localStorage.getItem('portfolio_availability');
    if (stored && availabilityCycle.includes(stored as AvailabilityState)) {
      availability = stored as AvailabilityState;
    }
  }

  return {
    availability,
    mobileMenuOpen: false,
    confettiRemaining: 0,
    activePanel: null
  };
};

const headerReducer = (state: HeaderState, action: HeaderAction): HeaderState => {
  switch (action.type) {
    case 'setAvailability':
      return { ...state, availability: action.payload };
    case 'openMobileMenu':
      return { ...state, mobileMenuOpen: true };
    case 'closeMobileMenu':
      return { ...state, mobileMenuOpen: false, activePanel: null };
    case 'setConfetti':
      return { ...state, confettiRemaining: action.payload };
    case 'setPanel':
      return { ...state, activePanel: action.payload };
    default:
      return state;
  }
};

const availabilityClassMap: Record<AvailabilityState, string> = {
  available: 'availability-available',
  listening: 'availability-listening',
  unavailable: 'availability-unavailable'
};

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { data, currentLang, toggleLanguage } = useLanguage();
  const { showToast } = useToast();
  const { navigateTo } = useNavigation();
  const [
    { availability, mobileMenuOpen, confettiRemaining, activePanel },
    dispatch
  ] = useReducer(headerReducer, undefined, getInitialHeaderState);

  const headerContainerRef = useRef<HTMLDivElement | null>(null);
  const brandRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const lastConfettiRef = useRef(0);
  const confettiTimerRef = useRef<number | null>(null);
  const liveRegionRef = useRef<HTMLSpanElement | null>(null);

  const copyEmail = async () => {
    if (!navigator.clipboard) {
      showToast(data.toasts.email_copy_error, 'error');
      return;
    }
    try {
      await navigator.clipboard.writeText(data.email);
      showToast(data.toasts.email_copy_success, 'success');
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Clipboard copy failed', error);
      }
      showToast(data.toasts.email_copy_error, 'error');
    }
  };

  const openEmail = () => {
    window.location.href = `mailto:${data.email}`;
  };

  const openWhatsApp = () => {
    window.open(
      `https://wa.me/${data.whatsapp}?text=${encodeURIComponent(
        'Hola José Carlos! Vi tu portfolio y me gustaría conversar.'
      )}`,
      '_blank',
      'noopener,noreferrer'
    );
    showToast(data.toasts.whatsapp_open, 'info');
  };

  const openLinkedIn = () => window.open(data.social.linkedin, '_blank', 'noopener,noreferrer');
  const openGitHub = () => window.open(data.social.github, '_blank', 'noopener,noreferrer');
  const openPortfolio = () => window.open(data.social.portfolio, '_blank', 'noopener,noreferrer');
  const handlePdf = () => {
    showToast('Generando CV...', 'info');
    generatePdf(data, (data.lang as 'es' | 'en') || 'es')
      .then(() => {
        showToast('CV listo para descargar', 'success');
      })
      .catch(error => {
        if (import.meta.env.DEV) {
          console.error('CV generation failed', error);
        }
        showToast('No se pudo generar el CV. Inténtalo de nuevo.', 'error');
      });
  };

  const handleToggleAvailability = () => {
    const currentIndex = availabilityCycle.indexOf(availability);
    const next = availabilityCycle[(currentIndex + 1) % availabilityCycle.length];
    const toastKeyMap: Record<AvailabilityState, keyof typeof data.toasts | undefined> = {
      available: 'availability_available',
      listening: 'availability_listening',
      unavailable: 'availability_unavailable'
    };
    const toastTypeMap: Record<AvailabilityState, 'success' | 'info' | 'warning'> = {
      available: 'success',
      listening: 'info',
      unavailable: 'warning'
    };
    const toastKey = toastKeyMap[next];
    const message = toastKey ? data.toasts?.[toastKey] : null;
    if (message) {
      showToast(message, toastTypeMap[next]);
    }
    dispatch({ type: 'setAvailability', payload: next });
  };

  const setPanelRef = (node: HTMLDivElement | null) => {
    panelRef.current = node;
  };

  const togglePanel = (panel: HeaderPanel) => {
    dispatch({ type: 'setPanel', payload: activePanel === panel ? null : panel });
  };

  const closeActivePanel = () => dispatch({ type: 'setPanel', payload: null });

  const startConfettiCooldown = () => {
    lastConfettiRef.current = Date.now();
    dispatch({ type: 'setConfetti', payload: CONFETTI_COOLDOWN_MS });
    if (confettiTimerRef.current) {
      window.clearInterval(confettiTimerRef.current);
    }
    confettiTimerRef.current = window.setInterval(() => {
      const remaining = Math.max(0, lastConfettiRef.current + CONFETTI_COOLDOWN_MS - Date.now());
      dispatch({ type: 'setConfetti', payload: remaining });
    }, CONFETTI_TICK_MS);
  };

  const launchConfetti = () => {
    const now = Date.now();
    const remaining = lastConfettiRef.current + CONFETTI_COOLDOWN_MS - now;
    if (remaining > 0) {
      const seconds = Math.ceil(remaining / 1000);
      showToast(`Confetti disponible en ${seconds}s`, 'warning');
      dispatch({ type: 'setConfetti', payload: remaining });
      if (!confettiTimerRef.current) {
        startConfettiCooldown();
      }
      if (liveRegionRef.current) {
        liveRegionRef.current.textContent = `Confetti disponible en ${seconds} segundos`;
      }
      return;
    }
    document.dispatchEvent(new Event('launch'));
    startConfettiCooldown();
    if (liveRegionRef.current) {
      liveRegionRef.current.textContent = 'Confetti lanzado. Espera 5 segundos para volver a celebrar.';
    }
  };

  const handleConfettiClick = () => {
    launchConfetti();
  };

  useEffect(() => {
    window.localStorage.setItem('portfolio_availability', availability);
  }, [availability]);

  useEffect(() => {
    if (!liveRegionRef.current) return;
    if (confettiRemaining > 0) {
      liveRegionRef.current.textContent = `Confetti disponible en ${Math.ceil(confettiRemaining / 1000)} segundos`;
    } else {
      liveRegionRef.current.textContent = 'Confetti disponible para lanzar.';
    }
  }, [confettiRemaining]);

  useEffect(() => {
    if (confettiRemaining <= 0 && confettiTimerRef.current) {
      window.clearInterval(confettiTimerRef.current);
      confettiTimerRef.current = null;
    }
    return () => {
      if (confettiRemaining <= 0 && confettiTimerRef.current) {
        window.clearInterval(confettiTimerRef.current);
        confettiTimerRef.current = null;
      }
    };
  }, [confettiRemaining]);

  useEffect(() => {
    return () => {
      if (confettiTimerRef.current) {
        window.clearInterval(confettiTimerRef.current);
        confettiTimerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const updateBrandWidth = () => {
      if (!brandRef.current || !headerContainerRef.current) return;
      const { width } = brandRef.current.getBoundingClientRect();
      headerContainerRef.current.style.setProperty('--header-brand-width', `${width}px`);
    };

    updateBrandWidth();

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', updateBrandWidth);
      return () => {
        window.removeEventListener('resize', updateBrandWidth);
      };
    }

    const observer = new ResizeObserver(() => {
      updateBrandWidth();
    });
    if (brandRef.current) {
      observer.observe(brandRef.current);
    }
    window.addEventListener('resize', updateBrandWidth);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateBrandWidth);
    };
  }, []);

useEffect(() => {
  if (!mobileMenuOpen) return undefined;
  const previousOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  return () => {
    document.body.style.overflow = previousOverflow;
  };
}, [mobileMenuOpen]);

  useEffect(() => {
    if (!activePanel || !panelRef.current) return undefined;
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        closeActivePanel();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activePanel]);

  const availabilityLabel = data.availability?.status?.[availability] ?? availability;
  const availabilityToggleLabel = data.availability?.toggle?.[availability] ?? 'Cambiar disponibilidad';
  const languageToggleLabel = currentLang === 'es' ? 'Switch to English' : 'Cambiar a español';
  const themeToggleLabel = theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';
  const confettiLabel = data.tooltips.celebrate;
  const isConfettiOnCooldown = confettiRemaining > 0;

  type QuickAction = {
    key: string;
    label: string;
    icon?: JSX.Element;
    action: () => void;
    disabled?: boolean;
    immediate?: boolean;
  };

  const navActions: QuickAction[] = data.nav.map(item => ({
    key: `nav-${item.id}`,
    label: item.label,
    icon: <Globe size={22} aria-hidden="true" />,
    action: () => navigateTo(item.id)
  }));

  const overflowSections = [
    {
      id: 'social',
      label: 'Redes profesionales',
      items: [
        { key: 'linkedin', label: 'LinkedIn', icon: <Linkedin size={22} aria-hidden="true" />, action: openLinkedIn, immediate: true },
        { key: 'github', label: 'GitHub', icon: <Github size={22} aria-hidden="true" />, action: openGitHub, immediate: true },
        { key: 'portfolio', label: 'Portafolio', icon: <Globe size={22} aria-hidden="true" />, action: openPortfolio, immediate: true }
      ]
    },
    {
      id: 'contact',
      label: 'Contacto',
      items: [
        { key: 'email', label: data.tooltips.email, icon: <Mail size={22} aria-hidden="true" />, action: openEmail, immediate: true },
        { key: 'copy', label: data.tooltips.copy, icon: <Copy size={22} aria-hidden="true" />, action: copyEmail },
        {
          key: 'whatsapp',
          label: 'WhatsApp',
          icon: <WhatsappGlyph className="h-[22px] w-[22px]" aria-hidden="true" />,
          action: openWhatsApp,
          immediate: true
        }
      ]
    },
    {
      id: 'preferences',
      label: 'Preferencias y extras',
      items: [
        { key: 'pdf', label: data.tooltips.pdf, icon: <Download size={22} aria-hidden="true" />, action: handlePdf, immediate: true },
        {
          key: 'confetti',
          label: confettiLabel,
          icon: <Sparkles size={22} aria-hidden="true" />,
          action: handleConfettiClick,
          disabled: isConfettiOnCooldown
        },
        {
          key: 'language',
          label: languageToggleLabel,
          icon: <Languages size={22} aria-hidden="true" />,
          action: toggleLanguage
        },
        {
          key: 'theme',
          label: themeToggleLabel,
          icon: theme === 'dark' ? <Sun size={22} aria-hidden="true" /> : <Moon size={22} aria-hidden="true" />,
          action: toggleTheme
        }
      ]
    }
  ];

  const overflowItems = overflowSections.flatMap(section => section.items);
  const mobileActionGroups = [
    { id: 'nav', label: 'Secciones', items: navActions },
    { id: 'actions', label: 'Acciones rápidas', items: overflowItems }
  ];

  return (
    <header className="header" role="banner">
      <div className="header-container" ref={headerContainerRef}>
        <div className="header-brand flex items-start" ref={brandRef}>
          <button
            type="button"
            className={`availability-badge ${availabilityClassMap[availability]}`}
            onClick={handleToggleAvailability}
            aria-label={availabilityToggleLabel}
          >
            <span className="availability-indicator" aria-hidden="true"></span>
            <span className="availability-icon" aria-hidden="true">
              {availabilityIconMap[availability]}
            </span>
            <span className="availability-label" aria-live="polite">
              {availabilityLabel}
            </span>
          </button>
        </div>

        <nav className="header-navigation" aria-hidden="true" />

        <div className="header-controls">
          <span ref={liveRegionRef} className="sr-only" role="status" aria-live="polite"></span>
          <div className="header-actions desktop-only header-actions--primary">
            <button
              className="icon-btn"
              aria-haspopup="true"
              aria-expanded={activePanel === 'overflow'}
              aria-controls="header-panel-overflow"
              onClick={() => togglePanel('overflow')}
              title="Acciones rápidas"
              aria-label="Abrir menú de acciones"
            >
              <MoreHorizontal size={24} aria-hidden="true" />
            </button>
          </div>
          <button
            type="button"
            className="icon-btn mobile-only"
            onClick={() => dispatch({ type: 'openMobileMenu' })}
            aria-haspopup="dialog"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-quick-actions"
            aria-label="Abrir menú de acciones rápidas"
          >
            <MoreHorizontal size={24} aria-hidden="true" />
          </button>
        </div>
      </div>

      {activePanel === 'overflow' ? (
        <div
          id="header-panel-overflow"
          className="header-panel header-panel--overflow"
          role="menu"
          aria-label="Acciones rápidas"
          ref={setPanelRef}
          style={{
            background: 'var(--surface-panel)',
            border: '3px solid var(--border-strong)',
            borderRadius: '16px',
            boxShadow: 'var(--shadow-lg) var(--shadow-strong)',
          }}
        >
          <button
            type="button"
            className="header-panel-close icon-btn"
            onClick={closeActivePanel}
            aria-label="Cerrar menú de acciones"
            style={{ color: 'var(--error)' }}
          >
            <X size={24} aria-hidden="true" />
          </button>
          <div className="header-panel-list" role="menu">
            {overflowItems.map(item => (
              <button
                key={item.key}
                type="button"
                onClick={() => {
                  item.action();
                  closeActivePanel();
                }}
                className="header-panel-button"
                role="menuitem"
                disabled={item.disabled}
                aria-disabled={item.disabled ? 'true' : 'false'}
              >
                {item.icon ? <span className="header-panel-button__icon">{item.icon}</span> : null}
                <span className="header-panel-button__label">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {mobileMenuOpen && (
        <div
          className="mobile-actions-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-actions-title"
          onClick={event => {
            if (event.target === event.currentTarget) {
              dispatch({ type: 'closeMobileMenu' });
            }
          }}
        >
          <FocusTrap
            active={mobileMenuOpen}
            focusTrapOptions={{
              allowOutsideClick: true,
              clickOutsideDeactivates: true,
              initialFocus: () =>
                mobileMenuRef.current?.querySelector('[data-focus-default]') ?? mobileMenuRef.current ?? undefined,
              onDeactivate: () => dispatch({ type: 'closeMobileMenu' })
            }}
          >
            <motion.div
              className="mobile-actions-modal"
              id="mobile-quick-actions"
              ref={mobileMenuRef}
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <header className="mobile-actions-modal__header">
                <h2 id="mobile-actions-title">Acciones y accesos rápidos</h2>
                <button
                  type="button"
                  className="mobile-actions-modal__close"
                  onClick={() => dispatch({ type: 'closeMobileMenu' })}
                  aria-label="Cerrar menú"
                  data-focus-default
                >
                  <X size={22} aria-hidden="true" />
                </button>
              </header>

              <div className="mobile-actions-modal__content">
                {mobileActionGroups.map(group => (
                  <div className="mobile-actions-modal__group" key={group.id}>
                    <p className="mobile-actions-modal__group-label">{group.label}</p>
                    <div className="mobile-actions-modal__group-items">
                      {group.items.map(item => (
                        <button
                          key={item.key}
                          type="button"
                          className="mobile-actions-modal__item"
                          onClick={() => {
                            if (item.immediate) {
                              item.action();
                              dispatch({ type: 'closeMobileMenu' });
                              return;
                            }
                            dispatch({ type: 'closeMobileMenu' });
                            window.setTimeout(() => {
                              item.action();
                            }, 180);
                          }}
                          disabled={item.disabled}
                          aria-disabled={item.disabled ? 'true' : 'false'}
                        >
                          {item.icon ? <span className="mobile-actions-modal__icon">{item.icon}</span> : null}
                          <span className="mobile-actions-modal__label">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </FocusTrap>
        </div>
      )}
    </header>
  );
}
