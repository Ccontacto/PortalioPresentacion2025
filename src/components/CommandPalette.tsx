import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  X
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigation } from '../contexts/NavigationContext';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../contexts/ToastContext';
import { generatePdf } from '../utils/pdfGenerator';
import { WhatsappGlyph } from './icons/WhatsappGlyph';

type CommandGroup = 'Secciones' | 'Redes' | 'Contacto' | 'Acciones' | 'Preferencias';

type CommandItem = {
  id: string;
  label: string;
  group: CommandGroup;
  action: () => void;
  icon?: JSX.Element;
  keywords?: string[];
  description?: string;
};

export default function CommandPalette() {
  const { data, toggleLanguage, currentLang } = useLanguage();
  const { navigateTo } = useNavigation();
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLInputElement | null>(null);

  const closePalette = useCallback(() => setOpen(false), []);

  const items = useMemo<CommandItem[]>(() => {
    const navItems: CommandItem[] = data.nav.map(navItem => ({
      id: `nav-${navItem.id}`,
      label: navItem.label,
      group: 'Secciones',
      icon: <Globe size={18} aria-hidden="true" />,
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
        icon: <Mail size={18} aria-hidden="true" />,
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
        icon: <CopyIcon size={18} aria-hidden="true" />,
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
      {
        id: 'contact-whatsapp',
        label: 'WhatsApp',
        group: 'Contacto',
        icon: <WhatsappGlyph aria-hidden="true" />,
        keywords: ['whatsapp', 'mensaje', 'contacto'],
        action: () => {
          window.open(
            `https://wa.me/${data.whatsapp}?text=${encodeURIComponent(
              'Hola José Carlos! Vi tu portfolio y me gustaría conversar.'
            )}`,
            '_blank'
          );
          showToast(data.toasts.whatsapp_open, 'info');
          closePalette();
        }
      }
    ];

    const socialItems: CommandItem[] = [
      {
        id: 'social-linkedin',
        label: 'LinkedIn',
        group: 'Redes',
        icon: <Globe size={18} aria-hidden="true" />,
        keywords: ['linkedin', 'networking'],
        action: () => {
          window.open(data.social.linkedin, '_blank');
          closePalette();
        }
      },
      {
        id: 'social-github',
        label: 'GitHub',
        group: 'Redes',
        icon: <Github size={18} aria-hidden="true" />,
        keywords: ['repositorio', 'code'],
        action: () => {
          window.open(data.social.github, '_blank');
          closePalette();
        }
      },
      {
        id: 'social-portfolio',
        label: 'Portafolio externo',
        group: 'Redes',
        icon: <Globe size={18} aria-hidden="true" />,
        keywords: ['portfolio', 'sitio', 'web'],
        action: () => {
          window.open(data.social.portfolio, '_blank');
          closePalette();
        }
      }
    ];

    const actionItems: CommandItem[] = [
      {
        id: 'action-download-cv',
        label: 'Descargar CV (PDF)',
        group: 'Acciones',
        icon: <Download size={18} aria-hidden="true" />,
        keywords: ['cv', 'curriculum', 'pdf'],
        action: () => {
          showToast('Generando CV...', 'info');
          generatePdf(data, (data.lang as 'es' | 'en') || 'es')
            .then(() => {
              showToast('CV listo para descargar', 'success');
            })
            .catch(error => {
              if (import.meta.env.DEV) {
                console.error('CV generation failed', error);
              }
              showToast('No se pudo generar el CV. Inténtalo de nuevo.', 'error');
            });
          closePalette();
        }
      }
    ];

    const preferenceItems: CommandItem[] = [
      {
        id: 'pref-theme',
        label: theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro',
        group: 'Preferencias',
        icon: theme === 'dark' ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />,
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
        icon: <Languages size={18} aria-hidden="true" />,
        keywords: ['idioma', 'language'],
        action: () => {
          toggleLanguage();
          closePalette();
        }
      }
    ];

    return [...navItems, ...contactItems, ...socialItems, ...actionItems, ...preferenceItems];
  }, [
    closePalette,
    data,
    currentLang,
    navigateTo,
    showToast,
    theme,
    toggleLanguage,
    toggleTheme
  ]);

  const filtered = useMemo(
    () => {
      const normalized = query.trim().toLowerCase();
      if (!normalized) return items;
      return items.filter(item => {
        const haystack = [
          item.label,
          ...(item.keywords ?? []),
          item.group
        ]
          .join(' ')
          .toLowerCase();
        return haystack.includes(normalized);
      });
    },
    [items, query]
  );

  const grouped = useMemo(() => {
    const map = new Map<CommandGroup, CommandItem[]>();
    for (const item of filtered) {
      const existing = map.get(item.group);
      if (existing) {
        existing.push(item);
      } else {
        map.set(item.group, [item]);
      }
    }
    return Array.from(map.entries());
  }, [filtered]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen(v => !v);
      }
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const open = () => setOpen(true);
    const close = () => setOpen(false);
    document.addEventListener('open-command-palette', open);
    document.addEventListener('close-command-palette', close);
    return () => {
      document.removeEventListener('open-command-palette', open);
      document.removeEventListener('close-command-palette', close);
    };
  }, []);

  useEffect(() => {
    if (open) {
      ref.current?.focus();
      setQuery('');
    } else {
      setQuery('');
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="command-palette-backdrop"
      onClick={closePalette}
      role="dialog"
      aria-modal="true"
      aria-labelledby="command-palette-title"
    >
      <FocusTrap
        active
        focusTrapOptions={{
          allowOutsideClick: true,
          clickOutsideDeactivates: true
        }}
      >
        <div
          className="command-palette-panel"
          role="document"
          onClick={event => event.stopPropagation()}
        >
          <div className="command-palette-header">
            <div>
              <h2 id="command-palette-title" className="command-palette-title">
                Buscar acciones
              </h2>
              <p id="command-palette-description" className="command-palette-description">
                Encuentra secciones, redes, contactos y preferencias en un solo lugar.
              </p>
            </div>
            <button
              type="button"
              className="command-palette-close"
              onClick={closePalette}
              aria-label="Cerrar buscador"
            >
              <X size={20} aria-hidden="true" />
            </button>
          </div>

          <div className="command-palette-search">
            <Search size={18} aria-hidden="true" />
            <label htmlFor="command-palette-input" className="sr-only">
              Buscar secciones, redes o acciones
            </label>
            <input
              id="command-palette-input"
              ref={ref}
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="Busca por nombre, acción o palabra clave…"
              role="searchbox"
              aria-describedby="command-palette-hint"
              aria-controls="command-palette-results"
              aria-autocomplete="list"
            />
          </div>
          <p id="command-palette-hint" className="command-palette-hint">
            Usa las flechas para navegar y Enter para seleccionar.
          </p>

          <div className="command-palette-results" id="command-palette-results" role="listbox">
            {grouped.length > 0 ? (
              grouped.map(([group, groupItems]) => (
                <section key={group} className="command-palette-group">
                  <h3 className="command-palette-group-title">{group}</h3>
                  <ul className="command-palette-group-list">
                    {groupItems.map(item => (
                      <li key={item.id} role="option" aria-selected={false}>
                        <button type="button" className="command-palette-item" onClick={item.action}>
                          <span className="command-palette-item-icon">{item.icon}</span>
                          <span className="command-palette-item-body">
                            <span className="command-palette-item-label">{item.label}</span>
                            {item.description ? (
                              <span className="command-palette-item-description">{item.description}</span>
                            ) : null}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              ))
            ) : (
              <div className="command-palette-empty" role="status">
                <p className="command-palette-empty-title">No se encontraron resultados</p>
                <p className="command-palette-empty-subtitle">Prueba con otro término de búsqueda.</p>
              </div>
            )}
          </div>

          <div className="command-palette-footer">
            <span>Cmd ⌘ / Ctrl ⌃ + K</span>
            <span>para abrir • Esc para cerrar</span>
          </div>
        </div>
      </FocusTrap>
    </div>
  );
}
