import Icon from '@components/icons/VectorIcon';
import { m } from 'framer-motion';
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type MouseEvent
} from 'react';

import { useLanguage } from '../contexts/LanguageContext';
import { useNavigation } from '../contexts/NavigationContext';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
import { useDeferredExitAction } from '../hooks/useDeferredExitAction';
import { launchConfetti } from '../utils/confetti';

import Modal from './Modal';

import type { ProjectItem } from '../types/portfolio';


type ProjectTag = ProjectItem['tags'][number];

interface SearchBarProps {
  projectItems: readonly ProjectItem[];
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
  const debounceRef = useRef<ReturnType<typeof globalThis.setTimeout> | null>(null);
  const mountedRef = useRef(false);
  const { queue, onExitComplete } = useDeferredExitAction();

  const titleId = useId();
  const descriptionId = useId();
  const panelId = useId();
  const { navigateTo } = useNavigation();
  const { data } = useLanguage();

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

  const triggerText = triggerLabel ?? (data.lang === 'es' ? 'Abrir buscador de proyectos' : 'Open projects search');
  const eyebrowText = data.ui?.searchEyebrow ?? (data.lang === 'es' ? 'Buscador IA' : 'Project finder');
  const helperText = data.ui?.searchHelper ?? (data.lang === 'es' ? 'Filtra por skills, tags y lanzamientos' : 'Filter by skills, tags & launches');
  const keyboardHint = data.ui?.searchShortcut ?? '⌘K / Ctrl+K';
  const resultsLabel =
    typeof resultCount === 'number'
      ? data.lang === 'es'
        ? `${resultCount} ${resultCount === 1 ? 'proyecto' : 'proyectos'} listos`
        : `${resultCount} ${resultCount === 1 ? 'project' : 'projects'} ready`
      : data.lang === 'es'
        ? 'Resultados dinámicos'
        : 'Dynamic results';
  const suggestionsTitle = data.ui?.searchSuggestionsTitle ?? (data.lang === 'es' ? 'Sugerencias curadas' : 'Curated picks');
  const suggestionsCaption = data.ui?.searchSuggestionsCaption ?? (data.lang === 'es' ? 'Selecciona una tecnología destacada' : 'Tap a highlighted technology');
  const tagsTitle = data.ui?.searchTagsTitle ?? (data.lang === 'es' ? 'Explorar por tags' : 'Browse by tags');
  const tagsCaption = data.ui?.searchTagsCaption ?? (data.lang === 'es' ? 'Ordenados por frecuencia en los proyectos' : 'Sorted by project frequency');

  const isIconVariant = variant === 'icon';

  useEffect(() => {
    mountedRef.current = true;
  }, []);

  useBodyScrollLock(isModalOpen);

  useEffect(() => {
    if (!isModalOpen || typeof window === 'undefined') return undefined;
    const focusTimer = globalThis.setTimeout(() => {
      inputRef.current?.focus();
    }, 90);
    return () => {
      globalThis.clearTimeout(focusTimer);
    };
  }, [isModalOpen]);

  useEffect(() => {
    const isTestEnv = import.meta.env.VITEST;
    if (typeof window === 'undefined' || isTestEnv) {
      onSearch(searchTerm.trim());
      return;
    }
    if (debounceRef.current) {
      globalThis.clearTimeout(debounceRef.current);
    }
    debounceRef.current = globalThis.setTimeout(() => {
      onSearch(searchTerm.trim());
    }, DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) {
        globalThis.clearTimeout(debounceRef.current);
      }
    };
  }, [searchTerm, onSearch]);

  const handleCloseModal = useCallback(
    (options?: { resetSearch?: boolean }) => {
      setIsModalOpen(false);
      if (options?.resetSearch !== false) {
        setSearchTerm('');
        onSearch('');
      }
      setConfettiAvailable(true);
      if (triggerRef.current) {
        triggerRef.current.focus();
      }
    },
    [onSearch]
  );

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setConfettiAvailable(true);
  };

  useEffect(() => {
    if (typeof document === 'undefined') return;
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

  const handleNavigateProjects = () => {
    if (queue(() => navigateTo('projects'))) {
      handleCloseModal({ resetSearch: false });
    }
  };

  const renderModal = () => {
    if (!mountedRef.current) return null;
    return (
      <Modal
        isOpen={isModalOpen}
        onClose={() => handleCloseModal()}
        onExitComplete={onExitComplete}
        titleId={titleId}
        descriptionId={descriptionId}
        panelId={panelId}
        initialFocusRef={inputRef as React.RefObject<HTMLElement>}
      >
        <header className="search-modal__header">
          <div>
            <h3 id={titleId} className="search-modal__title">
            {data.ui?.searchFilterTitle ?? (data.lang === 'es' ? 'Filtrar proyectos' : 'Filter projects')}
            </h3>
            <p id={descriptionId} className="search-modal__subtitle">
              {data.ui?.searchFilterSubtitle ?? (data.lang === 'es' ? 'Escribe una tecnología o selecciona una de las sugerencias.' : 'Type a technology or pick one of the suggestions.')}
            </p>
            <div className="search-modal__meta">
              <span className="search-modal__pill" role="status" aria-live="polite">
                <Icon name="sparkles" size={16} aria-hidden />
                {resultsLabel}
              </span>
              <span className="search-modal__pill search-modal__pill--ghost" aria-hidden="true">
                {keyboardHint}
              </span>
            </div>
          </div>
          <button
            type="button"
            className="search-modal__close"
            onClick={() => handleCloseModal()}
            aria-label="Cerrar buscador"
          >
            <Icon name="close" size={20} aria-hidden />
          </button>
        </header>

        <div className="search-modal__input-group">
          <Icon name="search" size={20} aria-hidden className="search-modal__input-icon" />
          <input
            ref={inputRef}
            type="search"
            value={searchTerm}
            onChange={(event) => handleSearchInput(event.target.value)}
            placeholder={data.ui?.searchPlaceholderTech ?? (data.lang === 'es' ? 'Buscar por tecnología...' : 'Search by technology...')}
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
              aria-label={data.ui?.searchClearLabel ?? (data.lang === 'es' ? 'Limpiar búsqueda' : 'Clear search')}
            >
              <Icon name="eraser" size={16} aria-hidden />
            </button>
          )}
        </div>

        {suggestedTags.length > 0 && (
          <section className="search-modal__section">
            <div className="search-modal__section-heading">
              <p className="search-modal__section-title">{suggestionsTitle}</p>
              <span className="search-modal__section-caption">{suggestionsCaption}</span>
            </div>
            <div className="search-modal__suggestions" aria-label={data.ui?.searchSuggestionsAria ?? (data.lang === 'es' ? 'Sugerencias destacadas' : 'Featured suggestions')}>
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
          </section>
        )}

        <section className="search-modal__section">
          <div className="search-modal__section-heading">
            <p className="search-modal__section-title">{tagsTitle}</p>
            <span className="search-modal__section-caption">{tagsCaption}</span>
          </div>
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
              <p className="search-modal__empty">{data.ui?.searchNoMatches ?? (data.lang === 'es' ? 'Sin coincidencias. Ajusta la búsqueda o lanza confetti.' : 'No matches. Adjust your query or launch confetti.')}</p>
            )}
          </div>
        </section>

        <div className="search-modal__actions">
          <button
            type="button"
            className="search-modal__apply"
            onClick={handleNavigateProjects}
            data-retro-sfx
          >
            <Icon name="arrowRight" size={18} aria-hidden />
            {data.ui?.viewProjects ?? (data.lang === 'es' ? 'Ver proyectos' : 'View projects')}
          </button>
        </div>

        {typeof resultCount === 'number' && resultCount === 0 && confettiAvailable && (
          <button
            type="button"
            className="search-modal__confetti"
            onClick={handleConfetti}
          >
            <Icon name="sparkles" size={18} aria-hidden />
            confetti
          </button>
        )}
      </Modal>
    );
  };

  return (
    <div className={`search-bar ${isIconVariant ? 'search-bar--icon' : ''}`}>
      <m.button
        ref={triggerRef}
        type="button"
        className={`search-trigger ${isIconVariant ? 'search-trigger--icon' : ''}`}
        onClick={handleOpenModal}
        aria-haspopup="dialog"
        aria-expanded={isModalOpen}
        aria-controls={isModalOpen ? panelId : undefined}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        data-retro-sfx
        data-dev-id="6000"
      >
        {isIconVariant ? (
          <>
            <Icon name="search" size={22} aria-hidden />
            <span className="sr-only">{triggerText}</span>
          </>
        ) : (
          <>
            <span className="search-trigger__icon" aria-hidden>
              <Icon name="search" size={24} aria-hidden />
            </span>
            <span className="search-trigger__label">
              <span className="search-trigger__eyebrow">{eyebrowText}</span>
              <span className="search-trigger__text">{triggerText}</span>
              {helperText ? <span className="search-trigger__hint">{helperText}</span> : null}
            </span>
            <span className="search-trigger__kbd" aria-hidden="true">
              {keyboardHint}
            </span>
          </>
        )}
      </m.button>
      {renderModal()}
    </div>
  );
}
