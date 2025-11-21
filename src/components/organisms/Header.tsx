import { Sun, Moon, Languages } from 'lucide-react';
import { useEffect, useState } from 'react';

import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '../atoms/Button';
import '../Navbar/Navbar.css';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { currentLang, toggleLanguage } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 96);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const themeToggleLabel = theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro';
  const languageToggleLabel = currentLang === 'es' ? 'Switch to English' : 'Cambiar a Español';

  return (
    <header className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <a href="#home" className="text-xl font-bold text-text-primary">
              JC
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleLanguage}
              aria-label={languageToggleLabel}
            >
              <Languages className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label={themeToggleLabel}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
