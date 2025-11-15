import { LazyMotion, domAnimation } from 'framer-motion';
import { DevProvider } from './contexts/DevContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { NavigationProvider } from './contexts/NavigationContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import { POSProvider } from './pos/contexts/POSContext';
import POSView from './pos/views/POSView';

function AppContent() {
  return <POSView />;
}

export default function App() {
  return (
    <LanguageProvider>
      <ToastProvider>
        <ThemeProvider>
          <NavigationProvider>
            <DevProvider>
              <POSProvider>
                <LazyMotion features={domAnimation} strict>
                  <AppContent />
                </LazyMotion>
              </POSProvider>
            </DevProvider>
          </NavigationProvider>
        </ThemeProvider>
      </ToastProvider>
    </LanguageProvider>
  );
}
