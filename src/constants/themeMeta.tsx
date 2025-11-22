import Icon from '@components/icons/VectorIcon';

import type { BaseTheme } from '../contexts/ThemeContext';
import type { JSX } from 'react';

type ThemeLocale = 'es' | 'en';

type ThemeMeta = {
  icon: JSX.Element;
  label: Record<ThemeLocale, string>;
  description: Record<ThemeLocale, string>;
};

const iconSize = 18;

export const THEME_META: Record<BaseTheme, ThemeMeta> = {
  light: {
    icon: <Icon name="sun" size={iconSize} aria-hidden />,
    label: { es: 'Claro', en: 'Light' },
    description: {
      es: 'Base luminosa y cálida',
      en: 'Bright, warm background'
    }
  },
  dark: {
    icon: <Icon name="moon" size={iconSize} aria-hidden />,
    label: { es: 'Oscuro', en: 'Dark' },
    description: {
      es: 'Contraste alto para ambientes con poca luz',
      en: 'High contrast for low light'
    }
  },
  oled: {
    icon: <Icon name="sparkles" size={iconSize} aria-hidden />,
    label: { es: 'OLED', en: 'OLED' },
    description: {
      es: 'Profundidad máxima y negros orgánicos',
      en: 'Deep blacks for OLED displays'
    }
  },
  'high-contrast': {
    icon: <Icon name="contrast" size={iconSize} aria-hidden />,
    label: { es: 'Alto contraste', en: 'High contrast' },
    description: {
      es: 'Modo accesible AA/AAA, tintes mínimos',
      en: 'Accessible high-contrast palette'
    }
  }
};

export const getThemeLabel = (lang: string, theme: BaseTheme) =>
  THEME_META[theme].label[lang === 'en' ? 'en' : 'es'];

export const getThemeDescription = (lang: string, theme: BaseTheme) =>
  THEME_META[theme].description[lang === 'en' ? 'en' : 'es'];
