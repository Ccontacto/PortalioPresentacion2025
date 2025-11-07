import { FocusTrap } from 'focus-trap-react';
import { AnimatePresence, m } from 'framer-motion';
import {
  Copy as CopyIcon,
  Download,
  Globe,
  Github,
  Languages,
  Mail,
  Moon,
  Search,
  Sparkles,
  Sun,
  X
} from 'lucide-react';
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode
} from 'react';
import { createPortal } from 'react-dom';

import { useLanguage } from '../contexts/LanguageContext';
import { useNavigation } from '../contexts/NavigationContext';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../contexts/ToastContext';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
import { useCvDownload } from '../hooks/useCvDownload';
import { KONAMI_ENABLE_MESSAGE, KONAMI_DISABLE_MESSAGE } from '../constants/konami';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { DIALOG_VARIANTS, PANEL_TRANSITION, OVERLAY_FADE } from '../constants/animation';

import { WhatsappGlyph } from './icons/WhatsappGlyph';

type CommandGroup = string;

type CommandItem = {
  id: string;
  label: string;
  group: CommandGroup;
  action: () => void;
  icon?: ReactNode;
  keywords?: string[];
  description?: string;
  predicate?: () => boolean;
};

const DEBOUNCE_MS = 160;

export default function CommandPalette() {
  const { data, toggleLanguage, currentLang } = useLanguage();
  const { navigateTo } = useNavigation();
  const { baseTheme, toggleTheme, isKonami, activateKonami, deactivateKonami } = useTheme();
  const { showToast } = useToast();
  const downloadCv = useCvDownload();

  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const titleId = useId();
  const descriptionId = useId();
  const listId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  useBodyScrollLock(open);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(query);
    }, DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [query]);

  const closePalette = useCallback(() => {
    setOpen(false);
  }, []);

  const items = useMemo<CommandItem[]>(() => {
    const navItems: CommandItem[] = data.nav.map(navItem => ({
      id: `nav-${navItem.id}`,
      label: navItem.label,
      group: 'Secciones',
      icon: <Globe size={22} aria-hidden="true" />,
      keywords: [navItem.id, navItem.label],
      action: () => {
        navigateTo(navItem.id);
        closePalette();
      }
    }));

    const contactItems: CommandItem[] = [
      {
        id: 'contact-email',
        label: `Email: ${data.email}`,
        group: 'Contacto',
        icon: <Mail size={22} aria-hidden="true" />,
        keywords: ['correo', 'contacto', 'mail'],
        action: () => {
          window.location.href = `mailto:${data.email}`;
          closePalette();
        }
      },
      {
        id: 'contact-copy-email',
        label: 'Copiar email',
        group: 'Contacto',
        icon: <CopyIcon size={22} aria-hidden="true" />,
        keywords: ['clipboard', 'copiar', 'correo'],
        action: async () => {
          try {
            await navigator.clipboard.writeText(data.email);
            showToast(data.toasts.email_copy_success, 'success');
          } catch (error) {
            if (import.meta.env.DEV) {
              console.error('Clipboard copy failed', error);
            }
            showToast(data.toasts.email_copy_error, 'error');
          } finally {
            closePalette();
          }
        }
      },
      ...(data.whatsapp
        ? [
            {
              id: 'contact-whatsapp',
              label: 'WhatsApp',
              group: 'Contacto',
              icon: <WhatsappGlyph className="h-[22px] w-[22px]" aria-hidden="true" />,
              keywords: ['whatsapp', 'mensaje', 'contacto'],
              action: () => {
                window.open(
                  `https://wa.me/${data.whatsapp}?text=${encodeURIComponent(
                    'Hola José Carlos! Vi tu portfolio y me gustaría conversar.'
                  )}`,
                  '_blank',
                  'noopener,noreferrer'
                );
                showToast(data.toasts.whatsapp_open, 'info');
                closePalette();
              }
            }
          ]
        : [])
    ];

    const socialItems: CommandItem[] = [
      ...(data.social?.linkedin
        ? [
            {
              id: 'social-linkedin',
              label: 'LinkedIn',
              group: 'Redes',
              icon: <Globe size={22} aria-hidden="true" />,
              keywords: ['linkedin', 'networking'],
              action: () => {
                window.open(data.social.linkedin, '_blank', 'noopener,noreferrer');
                closePalette();
              }
            }
          ]
        : []),
      ...(data.social?.github
        ? [
            {
              id: 'social-github',
              label: 'GitHub',
              group: 'Redes',
              icon: <Github size={22} aria-hidden="true" />,
              keywords: ['repositorio', 'code'],
              action: () => {
                window.open(data.social.github, '_blank', 'noopener,noreferrer');
                closePalette();
              }
            }
          ]
        : []),
      ...(data.social?.portfolio
        ? [
            {
              id: 'social-portfolio',
              label: 'Portafolio externo',
              group: 'Redes',
              icon: <Globe size={22} aria-hidden="true" />,
              keywords: ['portfolio', 'sitio', 'web'],
              action: () => {
                window.open(data.social.portfolio, '_blank', 'noopener,noreferrer');
                closePalette();
              }
            }
          ]
        : [])
    ];

    const actionItems: CommandItem[] = [
      {
        id: 'action-download-cv',
        label: 'Descargar CV (PDF)',
        group: 'Acciones',
        icon: <Download size={22} aria-hidden="true" />,
        keywords: ['cv', 'curriculum', 'pdf'],
        action: () => {
          downloadCv({ data }).catch(() => {
            /* errores ya reportados en el hook */
          });
          closePalette();
        }
      }
    ];

    const preferenceItems: CommandItem[] = [
      {
        id: 'pref-konami',
        label: isKonami ? 'Salir de modo Konami' : 'Activar modo Konami',
        group: 'Preferencias',
        icon: <Sparkles size={22} aria-hidden="true" />,
        keywords: ['konami', 'retro', 'easter egg'],
        action: () => {
          if (isKonami) {
            deactivateKonami();
            showToast(KONAMI_DISABLE_MESSAGE, 'info');
          } else {
            activateKonami();
            showToast(KONAMI_ENABLE_MESSAGE, 'success');
          }
          closePalette();
        }
      },
      {
        id: 'pref-theme',
        label: baseTheme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro',
        group: 'Preferencias',
        icon: baseTheme === 'dark' ? <Sun size={22} aria-hidden="true" /> : <Moon size={22} aria-hidden="true" />,
        keywords: ['tema', 'theme', 'modo'],
        action: () => {
          toggleTheme();
          closePalette();
        }
      },
      {
        id: 'pref-language',
        label: currentLang === 'es' ? 'Cambiar a inglés' : 'Cambiar a español',
        group: 'Preferencias',
        icon: <Languages size={22} aria-hidden="true" />,
        keywords: ['idioma', 'language'],
        action: () => {
          toggleLanguage();
          closePalette();
        }
      }
    ];

    return [...navItems, ...contactItems, ...socialItems, ...actionItems, ...preferenceItems];
  }, [
    activateKonami,
    baseTheme,
    closePalette,
    currentLang,
    data,
    deactivateKonami,
    downloadCv,
    isKonami,
    navigateTo,
    showToast,
    toggleLanguage,
    toggleTheme
  ]);

  const availableItems = useMemo(
    () => items.filter(item => !item.predicate || item.predicate()),
    [items]
  );

  const filteredItems = useMemo(() => {
    const normalized = debouncedQuery.trim().toLowerCase();
    if (!normalized) return availableItems;
    return availableItems.filter(item => {
      const haystack = [item.label, item.group, ...(item.keywords ?? [])]
        .join(' ')
        .toLowerCase();
      return haystack.includes(normalized);
    });
  }, [availableItems, debouncedQuery]);

  useEffect(() => {
    setActiveIndex(prev => {
      if (filteredItems.length === 0) return 0;
      const clamped = Math.min(prev, filteredItems.length - 1);
      return clamped < 0 ? 0 : clamped;
    });
  }, [filteredItems]);

  useEffect(() => {
    if (!open) return;
    setQuery('');
    setDebouncedQuery('');
    setActiveIndex(0);
    const focusTimer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 90);
    return () => window.clearTimeout(focusTimer);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const list = listRef.current;
    if (!list) return;
    const active = list.querySelector<HTMLButtonElement>(`[data-index="${activeIndex}"]`);
    if (active) {
      active.scrollIntoView({ block: 'nearest' });
    }
  }, [open, activeIndex, filteredItems]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen(value => !value);
      }
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const openPalette = () => setOpen(true);
    const closePaletteEvent = () => setOpen(false);
    const handlePopState = () => setOpen(false);

    document.addEventListener('open-command-palette', openPalette);
    document.addEventListener('close-command-palette', closePaletteEvent);
    window.addEventListener('popstate', handlePopState);

    return () => {
      document.removeEventListener('open-command-palette', openPalette);
      document.removeEventListener('close-command-palette', closePaletteEvent);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleSelect = useCallback(
    (item: CommandItem) => {
      if (item.predicate && !item.predicate()) {
        return;
      }
      item.action();
      closePalette();
    },
    [closePalette]
  );

  const handleInputKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLInputElement>) => {
      if (filteredItems.length === 0) return;
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setActiveIndex(index => Math.min(index + 1, filteredItems.length - 1));
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setActiveIndex(index => Math.max(index - 1, 0));
      } else if (event.key === 'Enter') {
        event.preventDefault();
        const item = filteredItems[activeIndex];
        if (item) {
          handleSelect(item);
        }
      }
    },
    [activeIndex, filteredItems, handleSelect]
  );

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <m.div
          className="search-modal search-modal--command"
          data-dev-id="6500"
          variants={shouldReduceMotion ? undefined : OVERLAY_FADE}
          initial={shouldReduceMotion ? undefined : 'hidden'}
          animate={shouldReduceMotion ? undefined : 'show'}
          exit={shouldReduceMotion ? undefined : 'exit'}
          transition={shouldReduceMotion ? undefined : PANEL_TRANSITION}
          role="presentation"
        >
          <div
            className="search-modal__backdrop"
            data-dev-id="6501"
            role="presentation"
            aria-hidden="true"
            onClick={closePalette}
          />
          <FocusTrap
            active
            focusTrapOptions={{
              initialFocus: () => inputRef.current ?? false,
              allowOutsideClick: true,
              clickOutsideDeactivates: true,
              returnFocusOnDeactivate: true
            }}
          >
            <m.div
              className="search-modal__panel search-modal__panel--command"
              data-dev-id="6502"
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              aria-describedby={descriptionId}
              aria-controls={listId}
              variants={shouldReduceMotion ? undefined : DIALOG_VARIANTS}
              initial={shouldReduceMotion ? undefined : 'hidden'}
              animate={shouldReduceMotion ? undefined : 'show'}
              exit={shouldReduceMotion ? undefined : 'exit'}
              transition={shouldReduceMotion ? undefined : PANEL_TRANSITION}
              onClick={event => event.stopPropagation()}
            >
              <header className="search-modal__header">
                <div>
                  <h3 id={titleId} className="search-modal__title">
                    Explorar acciones
                  </h3>
                  <p id={descriptionId} className="search-modal__subtitle">
                    Accede a secciones, contactos y ajustes desde un solo lugar.
                  </p>
                </div>
                <button
                  type="button"
                  className="search-modal__close"
                  onClick={closePalette}
                  aria-label="Cerrar buscador de acciones"
                >
                  <X size={20} aria-hidden="true" />
                </button>
              </header>

              <div className="search-modal__input-group">
                <Search size={20} aria-hidden="true" className="search-modal__input-icon" />
                <input
                  ref={inputRef}
                  type="search"
                  value={query}
                  onChange={event => setQuery(event.target.value)}
                  onKeyDown={handleInputKeyDown}
                  placeholder="Buscar acciones, secciones o redes…"
                  className="search-modal__input"
                  autoCapitalize="none"
                  autoComplete="off"
                  spellCheck={false}
                  role="searchbox"
                  aria-controls={listId}
                  aria-activedescendant={
                    filteredItems[activeIndex] ? `command-option-${filteredItems[activeIndex].id}` : undefined
                  }
                />
                {query ? (
                  <button
                    type="button"
                    className="search-modal__clear"
                    onClick={() => setQuery('')}
                    aria-label="Limpiar búsqueda"
                  >
                    <X size={16} aria-hidden="true" />
                  </button>
                ) : null}
              </div>

              <div
                className="command-modal__list"
                role="listbox"
                id={listId}
                aria-labelledby={titleId}
                ref={listRef}
              >
                {filteredItems.length > 0 ? (
                  filteredItems.map((item, index) => {
                    const optionId = `command-option-${item.id}`;
                    const isActive = index === activeIndex;
                    return (
                      <button
                        key={item.id}
                        id={optionId}
                        data-index={index}
                        type="button"
                        role="option"
                        aria-selected={isActive}
                        className={`command-modal__option${isActive ? ' is-active' : ''}`}
                        onClick={() => handleSelect(item)}
                        onMouseEnter={() => setActiveIndex(index)}
                      >
                        {item.icon ? (
                          <span className="command-modal__option-icon" aria-hidden="true">
                            {item.icon}
                          </span>
                        ) : null}
                        <span className="command-modal__option-body">
                          <span className="command-modal__option-header">
                            <span className="command-modal__option-label">{item.label}</span>
                            <span className="command-modal__option-group">{item.group}</span>
                          </span>
                          {item.description ? (
                            <span className="command-modal__option-description">{item.description}</span>
                          ) : null}
                        </span>
                      </button>
                    );
                  })
                ) : (
                  <div className="command-modal__empty" role="status">
                    <p className="command-modal__empty-title">Sin coincidencias</p>
                    <p className="command-modal__empty-subtitle">Prueba con otro término o explora manualmente.</p>
                  </div>
                )}
              </div>

              <footer className="command-modal__footer" aria-hidden="true">
                <span>Cmd ⌘ / Ctrl ⌃ + K</span>
                <span>• Esc para cerrar</span>
              </footer>
            </m.div>
          </FocusTrap>
        </m.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}
