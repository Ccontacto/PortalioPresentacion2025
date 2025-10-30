import { AnimatePresence, motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useMemo, useState, type MouseEvent } from 'react';
import type { ProjectItem } from '../types/portfolio';

type ProjectTag = ProjectItem['tags'][number];

interface SearchBarProps {
  projectItems: ProjectItem[];
  onSearch: (searchTerm: string) => void;
  variant?: 'button' | 'icon';
  triggerLabel?: string;
}

export default function SearchBar({
  projectItems,
  onSearch,
  variant = 'button',
  triggerLabel,
}: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const allTags = useMemo(() => {
    const tags = new Set<ProjectTag>();
    projectItems.forEach((proj: ProjectItem) => {
      proj.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }, [projectItems]);

  const suggestedTags = useMemo(() => {
    if (!searchTerm) return [];
    return allTags.filter(tag =>
      tag.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, allTags]);

  const triggerText = triggerLabel ?? 'Filtrar proyectos';
  const isIconVariant = variant === 'icon';

  const handleSearchTermChange = (value: string) => {
    setSearchTerm(value);
    onSearch(value);
    setShowSuggestions(Boolean(value));
  };

  const handleTagClick = (tag: ProjectTag) => {
    setSearchTerm(tag);
    onSearch(tag);
    setShowSuggestions(false);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    onSearch('');
    setShowSuggestions(false);
  };

  const handleCloseSearch = () => {
    setIsSearchActive(false);
    handleClearSearch();
  };

  const handleSuggestionMouseDown = (
    event: MouseEvent<HTMLButtonElement>,
    tag: ProjectTag
  ) => {
    event.preventDefault();
    handleTagClick(tag);
  };

  return (
    <div className={`search-bar ${isIconVariant ? 'search-bar--compact' : ''}`}>
      <AnimatePresence initial={false}>
        {isSearchActive ? (
          <motion.div
            key="search-active"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="search-panel"
          >
            <div className="search-panel__header">
              <h3 className="search-panel__title">Filtrar proyectos</h3>
              <button
                type="button"
                onClick={handleCloseSearch}
                className="search-panel__close"
                aria-label="Cerrar búsqueda"
              >
                <X size={18} />
              </button>
            </div>

            <div className="search-panel__field">
              <Search className="search-panel__icon" size={20} aria-hidden="true" />
              <input
                type="search"
                placeholder="Buscar por tecnología..."
                className="search-panel__input"
                value={searchTerm}
                onChange={(event) => handleSearchTermChange(event.target.value)}
                onFocus={() => setShowSuggestions(Boolean(searchTerm))}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 120)}
                autoFocus
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="search-panel__clear"
                  aria-label="Limpiar búsqueda"
                >
                  <X size={16} />
                </button>
              )}

              {showSuggestions && suggestedTags.length > 0 && (
                <ul className="search-panel__suggestions" role="listbox">
                  {suggestedTags.map(tag => (
                    <li key={tag}>
                      <button
                        type="button"
                        onMouseDown={(event) => handleSuggestionMouseDown(event, tag)}
                        className="search-panel__suggestion"
                      >
                        {tag}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div
              className="search-panel__tags"
              role="list"
              aria-label="Seleccionar tecnología para filtrar"
            >
              {allTags.map(tag => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className={`skill-badge search-panel__tag${
                    searchTerm === tag ? ' search-panel__tag--active' : ''
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="search-inactive"
            type="button"
            onClick={() => setIsSearchActive(true)}
            className={`search-trigger ${isIconVariant ? 'search-trigger--icon' : ''}`}
            aria-label={isIconVariant ? triggerText : undefined}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
          >
            <Search size={22} aria-hidden="true" />
            {isIconVariant ? <span className="sr-only">{triggerText}</span> : <span>{triggerText}</span>}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
