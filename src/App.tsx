import { LazyMotion, domAnimation, m } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, lazy, Suspense } from 'react';

import LoadingScreen from './components/LoadingScreen';
import PageProgress from './components/PageProgress';
import QuickActionsMenu from './components/QuickActionsMenu';
import { RetroModeBanner } from './components/RetroModeBanner';
import SkipToContent from './components/SkipToContent';
import ToastContainer from './components/ToastContainer';
import { KONAMI_DISABLE_MESSAGE, KONAMI_ENABLE_MESSAGE } from './constants/konami';
import { DevProvider } from './contexts/DevContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { NavigationProvider } from './contexts/NavigationContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { ToastProvider, useToast } from './contexts/ToastContext';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useKonamiCode } from './hooks/useKonamiCode';
import { useReducedMotion } from './hooks/useReducedMotion';
const ConfettiCanvas = lazy(() => import('./components/ConfettiCanvas'));
const CommandPalette = lazy(() => import('./components/CommandPalette'));
import Contact from './sections/Contact';
import Experience from './sections/Experience';
import FocusAreas from './sections/FocusAreas';
import Hero from './sections/Hero';
import Projects from './sections/Projects';
import Skills from './sections/Skills';

function AppContent() {
  const { showToast } = useToast();
  const { data, toggleLanguage } = useLanguage();
  const { toggleTheme, isKonami, activateKonami, deactivateKonami } = useTheme();
  const shouldReduceMotion = useReducedMotion();
  const konamiAnnouncementRef = useRef(true);

  const retroEnabledMessage =
    data.toasts?.retro_enabled ??
    (data.lang === 'en'
      ? 'Retro mode enabled. Welcome to the 8-bit future.'
      : KONAMI_ENABLE_MESSAGE);
  const retroDisabledMessage =
    data.toasts?.retro_disabled ??
    (data.lang === 'en'
      ? 'Retro mode disabled. Back to the present.'
      : KONAMI_DISABLE_MESSAGE);

  const keyboardShortcuts = useMemo(
    () => [
      { keys: ['t'], metaKey: true, callback: () => toggleTheme() },
      { keys: ['l'], metaKey: true, callback: () => toggleLanguage() }
    ],
    [toggleTheme, toggleLanguage]
  );

  useKeyboardShortcuts(keyboardShortcuts);

  const exitKonamiMode = useCallback(
    (options?: { announce?: boolean }) => {
      if (!isKonami) {
        return;
      }
      deactivateKonami();
      if (options?.announce !== false) {
        showToast(retroDisabledMessage, 'info');
      }
    },
    [deactivateKonami, isKonami, retroDisabledMessage, showToast]
  );

  const toggleKonamiMode = useCallback(() => {
    if (isKonami) {
      exitKonamiMode();
      return;
    }
    activateKonami();
    showToast(retroEnabledMessage, 'success');
  }, [activateKonami, exitKonamiMode, isKonami, retroEnabledMessage, showToast]);

  useKonamiCode(toggleKonamiMode);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.classList.toggle('retro-mode', isKonami);
  }, [isKonami]);

  useEffect(() => {
    if (!konamiAnnouncementRef.current) {
      return;
    }
    konamiAnnouncementRef.current = false;
    if (isKonami) {
      showToast(retroEnabledMessage, 'success');
    }
  }, [isKonami, retroEnabledMessage, showToast]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (data?.toasts?.welcome) {
        showToast(data.toasts.welcome, 'info');
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [showToast, data]);

  return (
    <>
      <LoadingScreen />
      <m.div
        initial={shouldReduceMotion ? undefined : { opacity: 0 }}
        animate={shouldReduceMotion ? undefined : { opacity: 1 }}
      >
        <PageProgress />
        <SkipToContent />
        <QuickActionsMenu />
        {/* Header/TopBar removidos por solicitud: contenido inicia directo */}
        {isKonami ? <RetroModeBanner onExitRetro={exitKonamiMode} /> : null}
        {/* MEJORA 1: main con role explícito y aria-label */}
        <main className="main-content" id="main-content" role="main" aria-label="Contenido principal">
          <Hero />
          <FocusAreas />
          <Experience />
          <Skills />
          <Projects />
          <Contact />
        </main>
        <ToastContainer />
        <Suspense fallback={null}>
          <ConfettiCanvas />
        </Suspense>
        <Suspense fallback={null}>
          <CommandPalette />
        </Suspense>
      </m.div>
    </>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <LanguageProvider>
        <ThemeProvider>
          <NavigationProvider>
            <DevProvider>
              <LazyMotion features={domAnimation} strict>
                <AppContent />
              </LazyMotion>
            </DevProvider>
          </NavigationProvider>
        </ThemeProvider>
      </LanguageProvider>
    </ToastProvider>
  );
}
