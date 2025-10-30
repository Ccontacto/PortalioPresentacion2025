import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

type NavigationContextValue = {
  activePage: string;
  setActivePage: (id: string) => void;
  navigateTo: (id: string) => void;
};

const NavigationContext = createContext<NavigationContextValue | null>(null);

export const useNavigation = () => {
  const ctx = useContext(NavigationContext);
  if (!ctx) throw new Error('useNavigation must be used within NavigationProvider');
  return ctx;
};

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [activePage, setActivePage] = useState('home');

  const navigateTo = useCallback((id: string) => {
    setActivePage(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  useEffect(() => {
    const sections = ['home', 'experience', 'skills', 'projects', 'contact'];
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            setActivePage(e.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });

    return () => obs.disconnect();
  }, []);

  return (
    <NavigationContext.Provider value={{ activePage, setActivePage, navigateTo }}>
      {children}
    </NavigationContext.Provider>
  );
}
