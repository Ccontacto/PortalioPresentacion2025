import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

// Definimos los tres modos de tema posibles
type Theme = 'light' | 'dark' | 'high-contrast';
type ThemeContextValue = { theme: Theme; toggleTheme: () => void };

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};

// El ciclo de temas que seguirá el toggle
const themeCycle: Theme[] = ['light', 'dark', 'high-contrast'];

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'light';

    // 1. Revisar si hay un tema guardado en localStorage
    const stored = window.localStorage.getItem('portfolio_theme') as Theme | null;
    if (stored && themeCycle.includes(stored)) {
      return stored;
    }

    // 2. Si no, detectar la preferencia del sistema operativo
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  });

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;

    // Limpiar clases y atributos de temas anteriores
    root.classList.remove('dark');
    root.removeAttribute('data-theme');

    // Aplicar la clase o atributo correspondiente al tema actual
    if (theme === 'dark') {
      root.classList.add('dark');
    }
    // Siempre exponer data-theme para los estilos basados en atributos
    root.setAttribute('data-theme', theme);

    // Guardar la preferencia en localStorage
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('portfolio_theme', theme);
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(currentTheme => {
      const currentIndex = themeCycle.indexOf(currentTheme);
      const nextIndex = (currentIndex + 1) % themeCycle.length;
      return themeCycle[nextIndex];
    });
  }, []);

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}
