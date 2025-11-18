
import { DevProvider } from '../contexts/DevContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import { NavigationProvider } from '../contexts/NavigationContext';
import { PortfolioSpecProvider } from '../contexts/PortfolioSpecContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { ToastProvider } from '../contexts/ToastContext';

import type { PropsWithChildren } from 'react';

/**
 * Agrupa los providers críticos de la aplicación para reutilizarlos en Storybook.
 * Permite que las historias consuman idioma, tema, toasts y banderas de desarrollo
 * sin duplicar lógica dentro de cada archivo de historias.
 */
export function StorybookProviders({ children }: PropsWithChildren) {
  return (
    <LanguageProvider>
      <ToastProvider>
        <ThemeProvider>
          <PortfolioSpecProvider>
            <NavigationProvider>
              <DevProvider>{children}</DevProvider>
            </NavigationProvider>
          </PortfolioSpecProvider>
        </ThemeProvider>
      </ToastProvider>
    </LanguageProvider>
  );
}
