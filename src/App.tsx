import { motion } from 'framer-motion';
import { useEffect, useMemo, lazy, Suspense } from 'react';

import Dock from './components/Dock';
import Header from './components/Header';
import LoadingScreen from './components/LoadingScreen';
import PageIndicator from './components/PageIndicator';
import PageProgress from './components/PageProgress';
import SkipToContent from './components/SkipToContent';
import ToastContainer from './components/ToastContainer';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { NavigationProvider } from './contexts/NavigationContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { ToastProvider, useToast } from './contexts/ToastContext';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useReducedMotion } from './hooks/useReducedMotion';
const ConfettiCanvas = lazy(() => import('./components/ConfettiCanvas'));
const CommandPalette = lazy(() => import('./components/CommandPalette'));
import Contact from './sections/Contact';
import Experience from './sections/Experience';
import Hero from './sections/Hero';
import Projects from './sections/Projects';
import Skills from './sections/Skills';

function AppContent() {
  const { showToast } = useToast();
  const { data, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const shouldReduceMotion = useReducedMotion();

  const keyboardShortcuts = useMemo(
    () => [
      { keys: ['t'], metaKey: true, callback: () => toggleTheme() },
      { keys: ['l'], metaKey: true, callback: () => toggleLanguage() }
    ],
    [toggleTheme, toggleLanguage]
  );

  useKeyboardShortcuts(keyboardShortcuts);

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
      <motion.div
        initial={shouldReduceMotion ? undefined : { opacity: 0 }}
        animate={shouldReduceMotion ? undefined : { opacity: 1 }}
        className={theme === 'dark' ? 'dark' : ''}
      >
        <PageProgress />
        <SkipToContent />
        <Header />
        {/* MEJORA 1: main con role explícito y aria-label */}
        <main className="main-content" id="main-content" role="main" aria-label="Contenido principal">
          <Hero />
          <Experience />
          <Skills />
          <Projects />
          <Contact />
        </main>
        <Dock />
        <ToastContainer />
        <Suspense fallback={null}>
          <ConfettiCanvas />
        </Suspense>
        <PageIndicator />
        <Suspense fallback={null}>
          <CommandPalette />
        </Suspense>
      </motion.div>
    </>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <LanguageProvider>
        <ThemeProvider>
          <NavigationProvider>
            <AppContent />
          </NavigationProvider>
        </ThemeProvider>
      </LanguageProvider>
    </ToastProvider>
  );
}
