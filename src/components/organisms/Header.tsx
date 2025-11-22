import Icon from '@components/icons/VectorIcon';
import { useEffect, useMemo, useState } from 'react';

import { useLanguage } from '../../contexts/LanguageContext';
import { useNavigation } from '../../contexts/NavigationContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '../atoms/Button';
import '../Navbar/Navbar.css';

export default function Header() {
  const { baseTheme, toggleTheme } = useTheme();
  const { navigateTo, activePage } = useNavigation();
  const { data, currentLang, toggleLanguage } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 32);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = useMemo(() => data.nav ?? [], [data.nav]);
  const brandInitials = useMemo(() => {
    if (!data?.name) return 'JC';
    const parts = data.name.split(/\s+/).filter(Boolean);
    if (parts.length === 0) {
      return 'JC';
    }
    return parts
      .slice(0, 2)
      .map(part => part.charAt(0).toUpperCase())
      .join('');
  }, [data?.name]);

  return (
    <header className={`site-header ${isScrolled ? 'site-header--scrolled' : ''}`}>
      <div className="section__container site-header__inner">
        <button
          type="button"
          className="site-header__brand"
          onClick={() => navigateTo('home')}
          aria-label="Ir al inicio"
        >
          {brandInitials}
        </button>

        <nav className="site-header__nav" aria-label="Secciones principales">
          {navItems.map(item => (
            <button
              type="button"
              key={item.id}
              className={`site-header__link ${activePage === item.id ? 'is-active' : ''}`}
              onClick={() => navigateTo(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="site-header__actions">
          <button
            type="button"
            className="site-header__icon-btn"
            onClick={toggleLanguage}
            aria-label="Cambiar idioma"
          >
            {currentLang.toUpperCase()}
          </button>
          <button
            type="button"
            className="site-header__icon-btn"
            onClick={toggleTheme}
            aria-label="Cambiar tema"
          >
            {baseTheme === 'dark' ? <Icon name="sun" size={18} aria-hidden /> : <Icon name="moon" size={18} aria-hidden />}
          </button>
          <Button size="sm" onClick={() => navigateTo('contact')}>
            Hablemos
          </Button>
        </div>
      </div>
    </header>
  );
}
