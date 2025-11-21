import { LazyMotion, domAnimation, m } from 'framer-motion';

import { BackToTop } from './components/BackToTop';
import Header from './components/organisms/Header';
import { LanguageProvider } from './contexts/LanguageContext';
import { NavigationProvider } from './contexts/NavigationContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { useReducedMotion } from './hooks/useReducedMotion';
import Contact from './sections/Contact';
import Experience from './sections/Experience';
import Hero from './sections/Hero';
import Projects from './sections/Projects';
import Skills from './sections/Skills';

function AppContent() {
  const { theme } = useTheme();
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      <a className="skip-link" href="#main-content">
        Saltar al contenido principal
      </a>
      <m.div
        initial={shouldReduceMotion ? 'visible' : 'hidden'}
        animate="visible"
        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
        className={theme}
      >
        <Header />
        <main id="main-content" role="main">
          <Hero />
          <Experience />
          <Skills />
          <Projects />
          <Contact />
        </main>
      </m.div>
      <BackToTop />
    </>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <NavigationProvider>
          <LazyMotion features={domAnimation} strict>
            <AppContent />
          </LazyMotion>
        </NavigationProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}
