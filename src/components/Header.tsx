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
  Languages,
  CheckCircle,
  TriangleAlert,
  Handshake
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';


import { useLanguage } from '../contexts/LanguageContext';
import { useNavigation } from '../contexts/NavigationContext';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../contexts/ToastContext';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
import { useConfettiCooldown } from '../hooks/useConfettiCooldown';
import { useCvDownload } from '../hooks/useCvDownload';

import { AvailabilityBadge } from './header/AvailabilityBadge';
import { MobileActionsModal } from './header/MobileActionsModal';
import { OverflowPanel } from './header/OverflowPanel';
import { WhatsappGlyph } from './icons/WhatsappGlyph';

import type { AvailabilityState, QuickAction, QuickActionGroup } from './header/types';
import type { JSX } from 'react';

type HeaderPanel = 'overflow';

type HeaderState = {
  availability: AvailabilityState;
  mobileMenuOpen: boolean;
  activePanel: HeaderPanel | null;
};

type HeaderAction =
  | { type: 'setAvailability'; payload: AvailabilityState }
  | { type: 'openMobileMenu' }
  | { type: 'closeMobileMenu' }
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

type HeaderProps = {
  retroModeEnabled?: boolean;
  onExitRetroMode?: () => void;
};

export default function Header({ retroModeEnabled = false, onExitRetroMode }: HeaderProps = {}) {
  const { theme, toggleTheme } = useTheme();
  const { data, currentLang, toggleLanguage } = useLanguage();
  const { toasts } = data;
  const { showToast } = useToast();
  const { navigateTo } = useNavigation();
  const [{ availability, mobileMenuOpen, activePanel }, dispatch] = useReducer(
    headerReducer,
    undefined,
    getInitialHeaderState
  );

  const headerContainerRef = useRef<HTMLDivElement | null>(null);
  const brandRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const liveRegionRef = useRef<HTMLSpanElement | null>(null);

  const {
    remaining: confettiRemaining,
    isOnCooldown: isConfettiOnCooldown,
    tryLaunch: tryLaunchConfetti
  } = useConfettiCooldown({ cooldownMs: CONFETTI_COOLDOWN_MS, tickMs: CONFETTI_TICK_MS });
  const downloadCv = useCvDownload();

  const copyEmail = useCallback(async () => {
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
  }, [data.email, data.toasts.email_copy_error, data.toasts.email_copy_success, showToast]);

  const openEmail = useCallback(() => {
    window.location.href = `mailto:${data.email}`;
  }, [data.email]);

  const openWhatsApp = useCallback(() => {
    window.open(
      `https://wa.me/${data.whatsapp}?text=${encodeURIComponent(
        'Hola José Carlos! Vi tu portfolio y me gustaría conversar.'
      )}`,
      '_blank',
      'noopener,noreferrer'
    );
    showToast(data.toasts.whatsapp_open, 'info');
  }, [data.toasts.whatsapp_open, data.whatsapp, showToast]);

  const openLinkedIn = useCallback(() => {
    window.open(data.social.linkedin, '_blank', 'noopener,noreferrer');
  }, [data.social.linkedin]);

  const openGitHub = useCallback(() => {
    window.open(data.social.github, '_blank', 'noopener,noreferrer');
  }, [data.social.github]);

  const openPortfolio = useCallback(() => {
    window.open(data.social.portfolio, '_blank', 'noopener,noreferrer');
  }, [data.social.portfolio]);

  const handlePdf = useCallback(() => {
    downloadCv({ data });
  }, [data, downloadCv]);

  const handleToggleAvailability = useCallback(() => {
    const currentIndex = availabilityCycle.indexOf(availability);
    const next = availabilityCycle[(currentIndex + 1) % availabilityCycle.length];
    const toastKeyMap: Record<AvailabilityState, keyof typeof toasts | undefined> = {
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
    const message = toastKey ? toasts?.[toastKey] : null;
    if (message) {
      showToast(message, toastTypeMap[next]);
    }
    dispatch({ type: 'setAvailability', payload: next });
  }, [availability, dispatch, showToast, toasts]);

  const setPanelRef = (node: HTMLDivElement | null) => {
    panelRef.current = node;
  };

  const togglePanel = (panel: HeaderPanel) => {
    dispatch({ type: 'setPanel', payload: activePanel === panel ? null : panel });
  };

  const closeActivePanel = () => dispatch({ type: 'setPanel', payload: null });

  const handleConfettiClick = useCallback(() => {
    const result = tryLaunchConfetti();
    if (!result.launched) {
      const seconds = Math.ceil(result.remaining / 1000);
      showToast(`Confetti disponible en ${seconds}s`, 'warning');
      if (liveRegionRef.current) {
        liveRegionRef.current.textContent = `Confetti disponible en ${seconds} segundos`;
      }
      return;
    }
    if (liveRegionRef.current) {
      liveRegionRef.current.textContent = 'Confetti lanzado. Espera 5 segundos para volver a celebrar.';
    }
  }, [showToast, tryLaunchConfetti]);

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

  useBodyScrollLock(mobileMenuOpen);

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

  const navActions = useMemo<QuickAction[]>(
    () =>
      data.nav.map(item => ({
        key: `nav-${item.id}`,
        label: item.label,
        icon: <Globe size={22} aria-hidden="true" />,
        action: () => navigateTo(item.id)
      })),
    [data.nav, navigateTo]
  );

  const preferenceItems = useMemo<QuickAction[]>(() => {
    const baseItems: QuickAction[] = [
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
    ];

    if (retroModeEnabled && onExitRetroMode) {
      const result = [
        {
          key: 'retro-exit',
          label: data.ui.retroExit,
          icon: <Sparkles size={22} aria-hidden="true" />,
          action: onExitRetroMode,
          immediate: true
        },
        ...baseItems
      ];
      return result;
    }

    return baseItems;
  }, [
    confettiLabel,
    data.tooltips.pdf,
    data.ui.retroExit,
    isConfettiOnCooldown,
    languageToggleLabel,
    onExitRetroMode,
    retroModeEnabled,
    theme,
    themeToggleLabel,
    toggleLanguage,
    toggleTheme,
    handleConfettiClick,
    handlePdf
  ]);

  const overflowSections = useMemo<QuickActionGroup[]>(
    () => [
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
        items: preferenceItems
      }
    ],
    [
      copyEmail,
      data.tooltips.copy,
      data.tooltips.email,
      openEmail,
      openGitHub,
      openLinkedIn,
      openPortfolio,
      openWhatsApp,
      preferenceItems
    ]
  );

  const overflowItems = useMemo(() => overflowSections.flatMap(section => section.items), [overflowSections]);

  const mobileActionGroups = useMemo<QuickActionGroup[]>(
    () => [
      { id: 'nav', label: 'Secciones', items: navActions },
      { id: 'actions', label: 'Acciones rápidas', items: overflowItems }
    ],
    [navActions, overflowItems]
  );

  return (
    <header className="header" role="banner">
      <div className="header-container" ref={headerContainerRef}>
        <div className="header-brand flex items-start" ref={brandRef}>
          <AvailabilityBadge
            availability={availability}
            badgeClass={availabilityClassMap[availability]}
            icon={availabilityIconMap[availability]}
            label={availabilityLabel}
            toggleLabel={availabilityToggleLabel}
            onToggle={handleToggleAvailability}
          />
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
            data-retro-sfx
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
            data-retro-sfx
          >
            <MoreHorizontal size={24} aria-hidden="true" />
          </button>
        </div>
      </div>

      {activePanel === 'overflow' ? (
        <OverflowPanel items={overflowItems} onClose={closeActivePanel} panelRef={setPanelRef} />
      ) : null}

      <MobileActionsModal
        open={mobileMenuOpen}
        groups={mobileActionGroups}
        onClose={() => dispatch({ type: 'closeMobileMenu' })}
        menuRef={mobileMenuRef}
      />
    </header>
  );
}
