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
  Handshake,
  Search
} from 'lucide-react';
import { WhatsappGlyph } from './icons/WhatsappGlyph';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';
import { useNavigation } from '../contexts/NavigationContext';
import { generatePdf } from '../utils/pdfGenerator';
import { useReducedMotion } from '../hooks/useReducedMotion';
import type { AvailabilityKey } from '../types/portfolio';

type AvailabilityState = AvailabilityKey;
type HeaderPanel = 'social' | 'contact' | 'preferences';

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
  available: <CheckCircle size={18} aria-hidden="true" />,
  listening: <Handshake size={18} aria-hidden="true" />,
  unavailable: <TriangleAlert size={18} aria-hidden="true" />
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
  const shouldReduceMotion = useReducedMotion();
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
      '_blank'
    );
    showToast(data.toasts.whatsapp_open, 'info');
  };

  const openLinkedIn = () => window.open(data.social.linkedin, '_blank');
  const openGitHub = () => window.open(data.social.github, '_blank');
  const openPortfolio = () => window.open(data.social.portfolio, '_blank');
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

  const handleOpenCommandPalette = () => {
    document.dispatchEvent(new Event('open-command-palette'));
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

  const mobileSections = [
    {
      id: 'sections',
      label: 'Secciones',
      items: data.nav.map(item => ({
        key: item.id,
        label: item.label,
        action: () => {
          navigateTo(item.id);
        }
      }))
    },
    {
      id: 'contact',
      label: 'Contacto y redes',
      items: [
        { key: 'email', label: data.tooltips.email, icon: <Mail size={18} aria-hidden="true" />, action: openEmail },
        { key: 'copy', label: data.tooltips.copy, icon: <Copy size={18} aria-hidden="true" />, action: copyEmail },
        { key: 'whatsapp', label: 'WhatsApp', icon: <WhatsappGlyph className="h-[18px] w-[18px]" aria-hidden="true" />, action: openWhatsApp },
        { key: 'linkedin', label: data.tooltips.linkedin, icon: <Linkedin size={18} aria-hidden="true" />, action: openLinkedIn },
        { key: 'github', label: data.tooltips.github, icon: <Github size={18} aria-hidden="true" />, action: openGitHub },
        { key: 'portfolio', label: 'Portafolio', icon: <Globe size={18} aria-hidden="true" />, action: openPortfolio }
      ]
    },
    {
      id: 'preferences',
      label: 'Preferencias',
      items: [
        { key: 'availability', label: availabilityToggleLabel, action: handleToggleAvailability },
        { key: 'language', label: languageToggleLabel, icon: <Languages size={18} aria-hidden="true" />, action: toggleLanguage },
        {
          key: 'theme',
          label: themeToggleLabel,
          icon: theme === 'dark' ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />,
          action: toggleTheme
        },
        { key: 'pdf', label: data.tooltips.pdf, icon: <Download size={18} aria-hidden="true" />, action: handlePdf },
        { key: 'search', label: 'Buscar secciones', icon: <Search size={18} aria-hidden="true" />, action: handleOpenCommandPalette },
        {
          key: 'confetti',
          label: confettiLabel,
          icon: <Sparkles size={18} aria-hidden="true" />,
          action: handleConfettiClick,
          disabled: isConfettiOnCooldown
        }
      ]
    }
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

        <nav className="header-navigation" role="navigation" aria-label="Acciones rápidas y preferencias">
          <div className="header-search desktop-only" role="search">
            <button
              type="button"
              className="header-search__trigger"
              onClick={handleOpenCommandPalette}
              aria-label="Buscar secciones"
            >
              <Search size={18} aria-hidden="true" />
              <span className="sr-only">Buscar secciones…</span>
            </button>
          </div>
          <div className="header-actions desktop-only header-actions--primary">
            <button
              className="icon-btn"
              aria-haspopup="true"
              aria-expanded={activePanel === 'social'}
              aria-controls="header-panel-social"
              onClick={() => togglePanel('social')}
              title="Mis redes"
              aria-label="Mis redes"
            >
              <Linkedin size={18} aria-hidden="true" />
            </button>
            <button
              className="icon-btn"
              aria-haspopup="true"
              aria-expanded={activePanel === 'contact'}
              aria-controls="header-panel-contact"
              onClick={() => togglePanel('contact')}
              title="Contacto"
              aria-label="Contacto"
            >
              <Mail size={18} aria-hidden="true" />
            </button>
            <button
              className="icon-btn"
              aria-haspopup="true"
              aria-expanded={activePanel === 'preferences'}
              aria-controls="header-panel-preferences"
              onClick={() => togglePanel('preferences')}
              title="Abrir preferencias"
            >
              <MoreHorizontal size={18} aria-hidden="true" />
            </button>
          </div>

          <span ref={liveRegionRef} className="sr-only" role="status" aria-live="polite"></span>

          <button
            type="button"
            className="icon-btn mobile-only"
            onClick={() => dispatch({ type: 'openMobileMenu' })}
            aria-haspopup="dialog"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-quick-actions"
            aria-label="Abrir menú de acciones rápidas"
          >
            <MoreHorizontal size={20} aria-hidden="true" />
          </button>
        </nav>

        <div className="header-equalizer" aria-hidden="true" />
      </div>

      {activePanel === 'social' ? (
        <div id="header-panel-social" className="header-panel" role="menu" aria-label="Redes profesionales" ref={setPanelRef}>
          <button type="button" className="header-panel-close" onClick={closeActivePanel} aria-label="Cerrar menú de redes">
            <X size={18} aria-hidden="true" />
          </button>
          <ul>
            <li>
              <button
                type="button"
                onClick={() => {
                  openLinkedIn();
                  closeActivePanel();
                }}
              >
                <Linkedin size={16} aria-hidden="true" />
                LinkedIn
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => {
                  openGitHub();
                  closeActivePanel();
                }}
              >
                <Github size={16} aria-hidden="true" />
                GitHub
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => {
                  openPortfolio();
                  closeActivePanel();
                }}
              >
                <Globe size={16} aria-hidden="true" />
                Portafolio
              </button>
            </li>
          </ul>
        </div>
      ) : null}

      {activePanel === 'contact' ? (
        <div id="header-panel-contact" className="header-panel" role="menu" aria-label="Opciones de contacto" ref={setPanelRef}>
          <button type="button" className="header-panel-close" onClick={closeActivePanel} aria-label="Cerrar menú de contacto">
            <X size={18} aria-hidden="true" />
          </button>
          <ul>
            <li>
              <button
                type="button"
                onClick={() => {
                  openEmail();
                  closeActivePanel();
                }}
              >
                <Mail size={16} aria-hidden="true" />
                {data.tooltips.email}
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => {
                  copyEmail();
                  closeActivePanel();
                }}
              >
                <Copy size={16} aria-hidden="true" />
                {data.tooltips.copy}
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => {
                  openWhatsApp();
                  closeActivePanel();
                }}
              >
                <WhatsappGlyph className="h-4 w-4" aria-hidden="true" />
                WhatsApp
              </button>
            </li>
          </ul>
        </div>
      ) : null}

      {activePanel === 'preferences' ? (
        <div
          id="header-panel-preferences"
          className="header-panel"
          role="menu"
          aria-label="Preferencias rápidas"
          ref={setPanelRef}
        >
          <button
            type="button"
            className="header-panel-close"
            onClick={closeActivePanel}
            aria-label="Cerrar menú de preferencias"
          >
            <X size={18} aria-hidden="true" />
          </button>
          <ul>
            <li>
              <button
                type="button"
                onClick={() => {
                  handlePdf();
                  closeActivePanel();
                }}
              >
                <Download size={16} aria-hidden="true" />
                {data.tooltips.pdf}
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => {
                  handleConfettiClick();
                  closeActivePanel();
                }}
                disabled={isConfettiOnCooldown}
                aria-disabled={isConfettiOnCooldown ? 'true' : 'false'}
                title={isConfettiOnCooldown ? 'Confetti disponible en unos segundos' : data.tooltips.celebrate}
              >
                <Sparkles size={16} aria-hidden="true" />
                {data.tooltips.celebrate}
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => {
                  toggleLanguage();
                  closeActivePanel();
                }}
              >
                <Languages size={16} aria-hidden="true" />
                {languageToggleLabel}
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => {
                  toggleTheme();
                  closeActivePanel();
                }}
              >
                {theme === 'dark' ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
                {themeToggleLabel}
              </button>
            </li>
          </ul>
        </div>
      ) : null}

      {mobileMenuOpen && (
        <div
          className="mobile-menu-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-quick-actions-title"
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
              className="mobile-menu-panel mx-auto"
              id="mobile-quick-actions"
              ref={mobileMenuRef}
              initial={{ y: '100%' }}
              animate={{ y: shouldReduceMotion ? 0 : '0%' }}
              exit={{ y: shouldReduceMotion ? 0 : '100%' }}
              transition={shouldReduceMotion ? undefined : { type: 'spring', stiffness: 400, damping: 40 }}
            >
              <div className="mobile-menu-header">
                <h2 id="mobile-quick-actions-title" className="mobile-menu-title">
                  Acciones rápidas
                </h2>
                <button
                  type="button"
                  className="icon-btn mobile-menu-close"
                  onClick={() => dispatch({ type: 'closeMobileMenu' })}
                  aria-label="Cerrar menú"
                  data-focus-default
                >
                  <X size={20} aria-hidden="true" />
                </button>
              </div>
              {mobileSections.map(section => (
                <div className="mobile-menu-section" key={section.id}>
                  <p className="mobile-menu-label">{section.label}</p>
                  <ul className="mobile-menu-list" role="menu">
                    {section.items.map(item => (
                      <li key={item.key}>
                        <button
                          type="button"
                          className="mobile-menu-button"
                          onClick={() => {
                            item.action();
                            dispatch({ type: 'closeMobileMenu' });
                          }}
                          role="menuitem"
                          disabled={item.disabled}
                          aria-disabled={item.disabled ? 'true' : 'false'}
                        >
                          {item.icon ? <span className="mobile-menu-icon">{item.icon}</span> : null}
                          <span>{item.label}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </motion.div>
          </FocusTrap>
        </div>
      )}
    </header>
  );
}
