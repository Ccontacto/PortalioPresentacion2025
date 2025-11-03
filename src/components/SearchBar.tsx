import { AnimatePresence, motion } from 'framer-motion';
import { FocusTrap } from 'focus-trap-react';
import { Search, Sparkles, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useCallback, useEffect, useId, useMemo, useRef, useState, type MouseEvent } from 'react';
import type { ProjectItem } from '../types/portfolio';
import { launchConfetti } from '../utils/confetti';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';

type ProjectTag = ProjectItem['tags'][number];

interface SearchBarProps {
  projectItems: ProjectItem[];
  onSearch: (searchTerm: string) => void;
  resultCount?: number;
  variant?: 'button' | 'icon';
  triggerLabel?: string;
}

const DEBOUNCE_MS = 220;

export default function SearchBar({
  projectItems,
  onSearch,
  resultCount,
  variant = 'button',
  triggerLabel
}: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confettiAvailable, setConfettiAvailable] = useState(true);

  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const debounceRef = useRef<number | null>(null);
  const mountedRef = useRef(false);

  const titleId = useId();
  const descriptionId = useId();
  const panelId = useId();

  const tagOccurrences = useMemo(() => {
    const map = new Map<ProjectTag, number>();
    projectItems.forEach(project => {
      project.tags.forEach(tag => {
        const value = map.get(tag) ?? 0;
        map.set(tag, value + 1);
      });
    });
    return map;
  }, [projectItems]);

  const sortedTags = useMemo(() => {
    return Array.from(tagOccurrences.entries())
      .sort((a, b) => {
        if (b[1] === a[1]) {
          return a[0].localeCompare(b[0]);
        }
        return b[1] - a[1];
      })
      .map(([tag]) => tag);
  }, [tagOccurrences]);

  const suggestedTags = useMemo(() => sortedTags.slice(0, 3), [sortedTags]);

  const filteredTags = useMemo(() => {
    if (!searchTerm.trim()) {
      return sortedTags;
    }
    const searchValue = searchTerm.trim().toLowerCase();
    return sortedTags.filter(tag => tag.toLowerCase().includes(searchValue));
  }, [searchTerm, sortedTags]);

  const triggerText = triggerLabel ?? 'Abrir buscador de proyectos';
  const isIconVariant = variant === 'icon';

  useEffect(() => {
    mountedRef.current = true;
  }, []);

  useBodyScrollLock(isModalOpen);

  useEffect(() => {
    if (!isModalOpen) return undefined;
    const focusTimer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 90);
    return () => {
      window.clearTimeout(focusTimer);
    };
  }, [isModalOpen]);

  useEffect(() => {
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
    }
    debounceRef.current = window.setTimeout(() => {
      onSearch(searchTerm.trim());
    }, DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
      }
    };
  }, [searchTerm, onSearch]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSearchTerm('');
    onSearch('');
    setConfettiAvailable(true);
    if (triggerRef.current) {
      triggerRef.current.focus();
    }
  }, [onSearch]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setConfettiAvailable(true);
  };

  useEffect(() => {
    if (!isModalOpen) return undefined;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        handleCloseModal();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen, handleCloseModal]);

  const handleSearchInput = (value: string) => {
    setSearchTerm(value);
  };

  const handleSuggestionClick = (tag: ProjectTag, event?: MouseEvent<HTMLButtonElement>) => {
    if (event) {
      event.preventDefault();
    }
    setSearchTerm(tag);
    onSearch(tag);
  };

  const handleConfetti = () => {
    if (!confettiAvailable) return;
    launchConfetti();
    setConfettiAvailable(false);
  };

  const renderModal = () => {
    if (!mountedRef.current) return null;
    return createPortal(
      <AnimatePresence>
        {isModalOpen ? (
          <motion.div
            className="search-modal"
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
              onClick={handleCloseModal}
            />
            <FocusTrap
              active
              focusTrapOptions={{
                initialFocus: () => inputRef.current ?? false,
                escapeDeactivates: false,
                allowOutsideClick: true,
                clickOutsideDeactivates: false,
                returnFocusOnDeactivate: false
              }}
            >
              <motion.div
                className="search-modal__panel"
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={descriptionId}
                id={panelId}
                initial={{ opacity: 0, scale: 0.96, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 12 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
              >
                <header className="search-modal__header">
                  <div>
                    <h3 id={titleId} className="search-modal__title">
                      Filtrar proyectos
                    </h3>
                    <p id={descriptionId} className="search-modal__subtitle">
                      Escribe una tecnología o selecciona una de las sugerencias.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="search-modal__close"
                    onClick={handleCloseModal}
                    aria-label="Cerrar buscador"
                  >
                    <X size={20} aria-hidden="true" />
                  </button>
                </header>

                <div className="search-modal__input-group">
                  <Search size={20} aria-hidden="true" className="search-modal__input-icon" />
                  <input
                    ref={inputRef}
                    type="search"
                    value={searchTerm}
                    onChange={(event) => handleSearchInput(event.target.value)}
                    placeholder="Buscar por tecnología..."
                    className="search-modal__input"
                    autoCapitalize="none"
                    autoComplete="off"
                    spellCheck={false}
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      className="search-modal__clear"
                      onClick={() => handleSearchInput('')}
                      aria-label="Limpiar búsqueda"
                    >
                      <X size={16} aria-hidden="true" />
                    </button>
                  )}
                </div>

                {suggestedTags.length > 0 && (
                  <div className="search-modal__suggestions" aria-label="Sugerencias destacadas">
                    {suggestedTags.map(tag => (
                      <button
                        key={tag}
                        type="button"
                        className="search-modal__chip"
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={(event) => handleSuggestionClick(tag, event)}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                )}

                <div className="search-modal__tag-list" role="list">
                  {filteredTags.length > 0 ? (
                    filteredTags.map(tag => (
                      <button
                        type="button"
                        key={tag}
                        className={`search-modal__tag ${searchTerm.trim().toLowerCase() === tag.toLowerCase() ? 'search-modal__tag--active' : ''}`}
                        onClick={(event) => handleSuggestionClick(tag, event)}
                      >
                        {tag}
                      </button>
                    ))
                  ) : (
                    <p className="search-modal__empty">Sin coincidencias. Ajusta la búsqueda o lanza confetti.</p>
                  )}
                </div>

                {typeof resultCount === 'number' && resultCount === 0 && confettiAvailable && (
                  <button
                    type="button"
                    className="search-modal__confetti"
                    onClick={handleConfetti}
                  >
                    <Sparkles size={18} aria-hidden="true" />
                    confetti
                  </button>
                )}
              </motion.div>
            </FocusTrap>
          </motion.div>
        ) : null}
      </AnimatePresence>,
      document.body
    );
  };

  return (
    <div className={`search-bar ${isIconVariant ? 'search-bar--icon' : ''}`}>
      <motion.button
        ref={triggerRef}
        type="button"
        className={`search-trigger ${isIconVariant ? 'search-trigger--icon' : ''}`}
        onClick={handleOpenModal}
        aria-haspopup="dialog"
        aria-expanded={isModalOpen}
        aria-controls={isModalOpen ? panelId : undefined}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
      >
        <Search size={22} aria-hidden="true" />
        {isIconVariant ? (
          <span className="sr-only">{triggerText}</span>
        ) : (
          <span>{triggerText}</span>
        )}
      </motion.button>
      {renderModal()}
    </div>
  );
}
