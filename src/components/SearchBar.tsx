import { AnimatePresence, motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { ProjectItem } from '../types/portfolio';

type ProjectTag = ProjectItem['tags'][number];

interface SearchBarProps {
  projectItems: ProjectItem[];
  onSearch: (searchTerm: string) => void;
}

export default function SearchBar({ projectItems, onSearch }: SearchBarProps) {
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

  const handleSearchTermChange = (value: string) => {
    setSearchTerm(value);
    onSearch(value);
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

  return (
    <div className="flex justify-center mb-8">
      <AnimatePresence>
        {isSearchActive ? (
          <motion.div
            key="search-active"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-lg p-4 bg-white border border-black shadow-lg rounded-lg"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
              <input
                type="text"
                placeholder="Buscar por tecnología..."
                className="w-full pl-12 pr-4 py-3 border rounded-full bg-white dark:bg-gray-800 shadow-lg"
                value={searchTerm}
                onChange={(e) => handleSearchTermChange(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
                autoFocus
              />
              {searchTerm && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label="Limpiar búsqueda"
                >
                  <X size={24} />
                </button>
              )}
              {showSuggestions && suggestedTags.length > 0 && (
                <div className="absolute z-10 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
                  {suggestedTags.map(tag => (
                    <button
                      key={tag}
                      onMouseDown={() => handleTagClick(tag)}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className={`skill-badge ${searchTerm === tag ? 'bg-blue-500 text-white' : ''}`}
                >
                  {tag}
                </button>
              ))}
            </div>
            <div className="flex justify-center mt-4">
                              <button
                                onClick={handleCloseSearch}
                                className="text-sm flex items-center gap-2 p-2"
                                aria-label="Cerrar búsqueda"
                              >
                                <X size={24} /> Cerrar
                              </button>            </div>
          </motion.div>
        ) : (
          <motion.button
            key="search-inactive"
            onClick={() => setIsSearchActive(true)}
            className="bg-blue-500 text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-lg"
            aria-label="Filtrar proyectos"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Search size={24} />
            Filtrar Proyectos
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
