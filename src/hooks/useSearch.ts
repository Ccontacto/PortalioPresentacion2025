import Fuse, {
  type IFuseOptions,
  type FuseResultMatch,
  type FuseOptionKey
} from 'fuse.js';
import { useMemo, useState } from 'react';

type UseSearchOptions<T> = Partial<IFuseOptions<T>>;

type EnrichedResult<T> = T & {
  score?: number;
  matches?: FuseResultMatch[];
};

export type UseSearchResult<T> = {
  query: string;
  setQuery: (value: string) => void;
  results: EnrichedResult<T>[];
  hasResults: boolean;
};

const DEFAULT_KEYS = ['title', 'description', 'tags', 'content'] as const;

export const useSearch = <T extends object>(
  data: readonly T[] = [],
  options: UseSearchOptions<T> = {}
): UseSearchResult<T> => {
  const [query, setQuery] = useState('');

  const fuse = useMemo(() => {
    const defaultOptions: IFuseOptions<T> = {
      keys: DEFAULT_KEYS.map(key => key as FuseOptionKey<T>),
      threshold: 0.3,
      includeScore: true,
      includeMatches: true,
      minMatchCharLength: 2,
      ignoreLocation: true,
      ...options
    };

    return new Fuse(data, defaultOptions);
  }, [data, options]);

  const results = useMemo<EnrichedResult<T>[]>(() => {
    if (!query.trim()) return [...data];
    return fuse.search(query).map(result => ({
      ...result.item,
      score: result.score,
      matches: result.matches
    }));
  }, [query, fuse, data]);

  return {
    query,
    setQuery,
    results,
    hasResults: results.length > 0
  };
};
