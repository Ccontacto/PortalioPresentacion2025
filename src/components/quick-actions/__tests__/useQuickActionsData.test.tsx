import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { KONAMI_ENABLE_MESSAGE } from '../../../constants/konami';
import { useQuickActionsData } from '../useQuickActionsData';

const mockToggleTheme = vi.fn();
const mockToggleLanguage = vi.fn();
const mockToggleDevIds = vi.fn();
const mockActivateKonami = vi.fn();
const mockDeactivateKonami = vi.fn();
const mockTryLaunch = vi.fn().mockReturnValue({ launched: true, remaining: 0 });
const mockDownloadCv = vi.fn();
const mockShowToast = vi.fn();

const fakeData = {
  lang: 'es',
  nav: [
    { id: 'home', label: 'Inicio' },
    { id: 'projects', label: 'Proyectos' },
    { id: 'contact', label: 'Contacto' }
  ],
  email: 'test@example.com',
  whatsapp: '+521234567890',
  social: {
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    portfolio: 'https://portfolio.test'
  },
  tooltips: {
    pdf: 'Descargar CV',
    celebrate: 'Celebrar',
    language: 'ES',
    theme: 'Tema',
    linkedin: 'LinkedIn',
    github: 'GitHub',
    email: 'Email',
    whatsapp: 'WhatsApp'
  },
  toasts: {
    invalid_url: 'Sin enlace disponible.',
    availability_available: '',
    availability_listening: '',
    availability_unavailable: ''
  },
  ui: {
    viewProjects: 'Ver proyectos',
    bookCall: 'Agendar llamada',
    quickActionsTitle: 'Acciones rápidas',
    quickSectionsLabel: 'Secciones',
    quickPreferencesLabel: 'Preferencias',
    searchPlaceholder: 'Buscar…',
    noMatchesTitle: 'Sin coincidencias',
    noMatchesSubtitle: 'Ajusta tu búsqueda',
    searchAriaLabel: 'Busca acciones rápidas',
    searchFilterTitle: 'Filtrar',
    searchFilterSubtitle: 'Tecnologías',
    searchPlaceholderTech: 'Buscar tecnologías',
    searchClearLabel: 'Limpiar',
    searchSuggestionsAria: 'Sugerencias destacadas',
    searchNoMatches: 'Sin coincidencias.',
    prevProjects: 'Proyectos previos',
    nextProjects: 'Próximos proyectos',
    prevSkills: 'Habilidades previas',
    nextSkills: 'Siguientes habilidades'
  }
};

vi.mock('../../../contexts/LanguageContext', () => ({
  useLanguage: () => ({
    data: fakeData,
    currentLang: 'es',
    toggleLanguage: mockToggleLanguage,
    t: (key: string) => key,
    overrides: {},
    updateOverrides: () => {}
  })
}));

vi.mock('../../../contexts/ThemeContext', () => ({
  useTheme: () => ({
    baseTheme: 'light',
    toggleTheme: mockToggleTheme,
    isKonami: false,
    activateKonami: mockActivateKonami,
    deactivateKonami: mockDeactivateKonami,
    toggleKonami: vi.fn(),
    theme: 'light',
    setBaseTheme: vi.fn()
  })
}));

vi.mock('../../../contexts/DevContext', () => ({
  useDev: () => ({
    devIds: false,
    toggleDevIds: mockToggleDevIds
  })
}));

vi.mock('../../../contexts/ToastContext', () => ({
  useToast: () => ({
    toasts: [],
    showToast: mockShowToast,
    removeToast: vi.fn()
  })
}));

vi.mock('../../../hooks/useConfettiCooldown', () => ({
  useConfettiCooldown: () => ({
    tryLaunch: mockTryLaunch,
    isOnCooldown: false
  })
}));

vi.mock('../../../hooks/useCvDownload', () => ({
  useCvDownload: () => mockDownloadCv
}));

let openSpy: ReturnType<typeof vi.fn>;

describe('useQuickActionsData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    openSpy = vi.fn();
    Object.defineProperty(window, 'open', {
      configurable: true,
      writable: true,
      value: openSpy
    });
  });

  afterEach(() => {
    openSpy.mockReset();
  });

  it('exposes nav items from language data', () => {
    const { result } = renderHook(() => useQuickActionsData());
    expect(result.current.navItems).toEqual(fakeData.nav);
  });

  it('builds a comprehensive list of quick actions', () => {
    const { result } = renderHook(() => useQuickActionsData());
    const keys = result.current.preferenceItems.map(action => action.key);
    expect(keys).toEqual(
      expect.arrayContaining([
        'pdf',
        'theme',
        'language',
        'github',
        'linkedin',
        'portfolio',
        'email',
        'whatsapp',
        'confetti',
        'retro',
        'dev-ids'
      ])
    );
  });

  it('runs the action callbacks that toggle UI state or open links', () => {
    const { result } = renderHook(() => useQuickActionsData());
    const findAction = (key: string) => result.current.preferenceItems.find(action => action.key === key);

    act(() => {
      findAction('pdf')?.action();
    });
    expect(mockDownloadCv).toHaveBeenCalledWith({ data: fakeData });

    act(() => {
      findAction('theme')?.action();
    });
    expect(mockToggleTheme).toHaveBeenCalled();

    act(() => {
      findAction('language')?.action();
    });
    expect(mockToggleLanguage).toHaveBeenCalled();

    act(() => {
      findAction('github')?.action();
      findAction('linkedin')?.action();
      findAction('portfolio')?.action();
    });
    expect(openSpy).toHaveBeenCalledTimes(3);

    act(() => {
      findAction('email')?.action();
      findAction('whatsapp')?.action();
    });
    expect(openSpy).toHaveBeenCalledTimes(5);

    act(() => {
      findAction('retro')?.action();
    });
    expect(mockActivateKonami).toHaveBeenCalled();
    expect(mockShowToast).toHaveBeenCalledWith(KONAMI_ENABLE_MESSAGE, 'success');

    act(() => {
      findAction('dev-ids')?.action();
    });
    expect(mockToggleDevIds).toHaveBeenCalled();
  });

  it('shows a toast when an action has no URL', () => {
    const originalSocial = { ...fakeData.social };
    fakeData.social = { ...originalSocial, github: undefined };

    const { result } = renderHook(() => useQuickActionsData());
    const githubAction = result.current.preferenceItems.find(action => action.key === 'github');

    act(() => {
      githubAction?.action();
    });

    expect(mockShowToast).toHaveBeenCalledWith(fakeData.toasts?.invalid_url, 'warning');

    fakeData.social = originalSocial;
  });
});
