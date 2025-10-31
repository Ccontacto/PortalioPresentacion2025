import { Sun, Moon, Languages } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '../atoms/Button';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { currentLang, toggleLanguage } = useLanguage();

  const themeToggleLabel = theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro';
  const languageToggleLabel = currentLang === 'es' ? 'Switch to English' : 'Cambiar a Español';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-base/80 backdrop-blur-sm border-b border-border-subtle">
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
