import type { Lang } from '@utils/typeGuards';

const uiDictionary = {
  es: {
    telemetry: {
      title: '¿Podemos medir el uso?',
      description: 'Uso datos anónimos para priorizar secciones y mejorar la experiencia.',
      accept: 'Permitir analíticas',
      decline: 'No, gracias'
    },
    privacy: {
      title: 'Privacidad y preferencias',
      description: 'Controla tu idioma y la telemetría anónima desde este panel.',
      telemetryDescription: 'Telemetría de secciones',
      telemetryEnable: 'Activar',
      telemetryDisable: 'Desactivar',
      telemetryReset: 'Borrar métricas',
      languageLabel: 'Idioma del portafolio',
      languageHelper: 'Elige el idioma en el que quieres ver la información.',
      statusGranted: 'Telemetría activada',
      statusDenied: 'Telemetría desactivada',
      statusUnknown: 'Pendiente de tu decisión'
    },
    nav: {
      home: 'Inicio',
      focus: 'Enfoque',
      experience: 'Experiencia',
      skills: 'Habilidades',
      projects: 'Proyectos',
      contact: 'Contacto'
    },
    footer: {
      rights: '© 2025 José Carlos Torres Rivera. Todos los derechos reservados.',
      builtWith: 'Desarrollado con React, TypeScript y Framer Motion.'
    }
  },
  en: {
    telemetry: {
      title: 'May I measure usage?',
      description: 'I use anonymous usage data to prioritize sections and keep improving the experience.',
      accept: 'Allow analytics',
      decline: 'No thanks'
    },
    privacy: {
      title: 'Privacy & preferences',
      description: 'Control your language and the anonymous telemetry from here.',
      telemetryDescription: 'Section telemetry',
      telemetryEnable: 'Enable',
      telemetryDisable: 'Disable',
      telemetryReset: 'Clear metrics',
      languageLabel: 'Portfolio language',
      languageHelper: 'Choose the language you want for this experience.',
      statusGranted: 'Telemetry enabled',
      statusDenied: 'Telemetry disabled',
      statusUnknown: 'Pending your decision'
    },
    nav: {
      home: 'Home',
      focus: 'Playbooks',
      experience: 'Experience',
      skills: 'Skills',
      projects: 'Projects',
      contact: 'Contact'
    },
    footer: {
      rights: '© 2025 José Carlos Torres Rivera. All rights reserved.',
      builtWith: 'Crafted with React, TypeScript and Framer Motion.'
    }
  }
} as const;

export type UiDictionary = typeof uiDictionary;
export type UiNamespace = keyof UiDictionary['es'];
export type UiKey<N extends UiNamespace> = keyof UiDictionary['es'][N];

export const getUiString = <N extends UiNamespace>(lang: Lang, namespace: N, key: UiKey<N>): string => {
  const fallbackLocale = uiDictionary.es;
  const langLocale = (uiDictionary[lang] ?? fallbackLocale) as UiDictionary['es'];
  const entry = (langLocale[namespace] ?? fallbackLocale[namespace]) as UiDictionary['es'][N];
  const value = entry[key];
  if (typeof value === 'string') {
    return value;
  }
  return `${String(namespace)}.${String(key)}`;
};

export { uiDictionary };
