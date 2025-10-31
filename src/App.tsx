import { motion } from 'framer-motion';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { NavigationProvider } from './contexts/NavigationContext';
import { useReducedMotion } from './hooks/useReducedMotion';
import Header from './components/organisms/Header'; // Ruta actualizada
import Hero from './sections/Hero';
import Experience from './sections/Experience';
import Skills from './sections/Skills';
import Projects from './sections/Projects';
import Contact from './sections/Contact';

function AppContent() {
  const { theme } = useTheme();
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? 'visible' : 'hidden'}
      animate="visible"
      variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
      className={theme} // Asigna la clase 'light' o 'dark' directamente
    >
      <Header />
      <main id="main-content" role="main">
        <Hero />
        <Experience />
        <Skills />
        <Projects />
        <Contact />
      </main>
    </motion.div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <NavigationProvider>
          <AppContent />
        </NavigationProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}
