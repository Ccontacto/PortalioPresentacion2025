import { AnimatePresence, motion } from 'framer-motion';
import FocusTrap from 'focus-trap-react';
import {
  Copy as CopyIcon,
  Download,
  Globe,
  Github,
  Languages,
  Mail,
  Moon,
  Search,
  Sun,
  X,
  MessageSquare
} from 'lucide-react';
import { createPortal } from 'react-dom';
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
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigation } from '../contexts/NavigationContext';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../contexts/ToastContext';
import { generateATSPdf } from '../utils/pdfGenerator.ats';
import { generateNonATSPdf } from '../utils/pdfGenerator.nonAts';

const COMMAND_GROUPS = {
  sections: 'Secciones',
  social: 'Redes',
  contact: 'Contacto',
  actions: 'Acciones',
  preferences: 'Preferencias'
} as const;

type CommandGroup = (typeof COMMAND_GROUPS)[keyof typeof COMMAND_GROUPS];

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
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();

  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  const titleId = useId();
  const descriptionId = useId();
  const listId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

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
      group: COMMAND_GROUPS.sections,
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
        group: COMMAND_GROUPS.contact,
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
        group: COMMAND_GROUPS.contact,
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
              group: COMMAND_GROUPS.contact,
              icon: <MessageSquare className="h-[22px] w-[22px]" aria-hidden="true" />,
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
              group: COMMAND_GROUPS.social,
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
              group: COMMAND_GROUPS.social,
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
              group: COMMAND_GROUPS.social,
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
        label: 'Descargar CV (ATS)',
        group: COMMAND_GROUPS.actions,
        icon: <Download size={22} aria-hidden="true" />,
        keywords: ['cv', 'curriculum', 'pdf', 'ats'],
        action: () => {
          showToast('Generando CV (ATS)...', 'info');
          generateATSPdf(data, (data.lang as 'es' | 'en') || 'es')
            .then(() => {
              showToast('CV (ATS) listo para descargar', 'success');
            })
            .catch(error => {
              if (import.meta.env.DEV) {
                console.error('ATS CV generation failed', error);
              }
              showToast('No se pudo generar el CV (ATS). Inténtalo de nuevo.', 'error');
            });
          closePalette();
        }
      },
      {
        id: 'action-download-cv-non-ats',
        label: 'Descargar CV (Diseño)',
        group: COMMAND_GROUPS.actions,
        icon: <Download size={22} aria-hidden="true" />,
        keywords: ['cv', 'curriculum', 'pdf', 'diseño'],
        action: () => {
          showToast('Generando CV (Diseño)...', 'info');
          generateNonATSPdf(data)
            .then(() => {
              showToast('CV (Diseño) listo para descargar', 'success');
            })
            .catch(error => {
              if (import.meta.env.DEV) {
                console.error('Non-ATS CV generation failed', error);
              }
              showToast('No se pudo generar el CV (Diseño). Inténtalo de nuevo.', 'error');
            });
          closePalette();
        }
      }
    ];

    const preferenceItems: CommandItem[] = [
      {
        id: 'pref-theme',
        label: theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro',
        group: COMMAND_GROUPS.preferences,
        icon: theme === 'dark' ? <Sun size={22} aria-hidden="true" /> : <Moon size={22} aria-hidden="true" />,
        keywords: ['tema', 'theme', 'modo'],
        action: () => {
          toggleTheme();
          closePalette();
        }
      },
      {
        id: 'pref-language',
        label: currentLang === 'es' ? 'Cambiar a inglés' : 'Cambiar a español',
        group: COMMAND_GROUPS.preferences,
        icon: <Languages size={22} aria-hidden="true" />,
        keywords: ['idioma', 'language'],
        action: () => {
          toggleLanguage();
          closePalette();
        }
      }
    ];

    return [...navItems, ...contactItems, ...socialItems, ...actionItems, ...preferenceItems];
  }, [closePalette, currentLang, data, navigateTo, showToast, theme, toggleLanguage, toggleTheme]);

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
        <motion.div
          className="search-modal search-modal--command"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          role="presentation"
        >
          <div
            className="search-modal__backdrop"
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
            <motion.div
              className="search-modal__panel search-modal__panel--command"
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              aria-describedby={descriptionId}
              aria-controls={listId}
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
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
            </motion.div>
          </FocusTrap>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}
