import { useCallback, useEffect, useRef, useState } from 'react';

interface UseHorizontalScrollOptions {
  /** Class to add when bouncing left */
  bounceLeftClass: string;
  /** Class to add when bouncing right */
  bounceRightClass: string;
  /** Selector for the scrollable item (e.g., '.project-card') */
  itemSelector: string;
  /** Number of items to trigger scroll button updates */
  itemCount: number;
}

interface UseHorizontalScrollResult {
  trackRef: React.RefObject<HTMLDivElement | null>;
  canScrollLeft: boolean;
  canScrollRight: boolean;
  scrollByCard: (direction: -1 | 1) => void;
  updateScrollButtons: () => void;
}

/**
 * Shared hook for horizontal scrolling functionality used in Experience and Projects sections.
 * Provides scroll state management, bounce animations, and card-based scrolling.
 */
export function useHorizontalScroll(options: UseHorizontalScrollOptions): UseHorizontalScrollResult {
  const { bounceLeftClass, bounceRightClass, itemSelector, itemCount } = options;
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollButtons = useCallback(() => {
    const track = trackRef.current;
    if (!track) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }
    const { scrollLeft, scrollWidth, clientWidth } = track;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
  }, []);

  const bounce = useCallback((className: string) => {
    const track = trackRef.current;
    if (!track) return;
    track.classList.add(className);
    setTimeout(() => track.classList.remove(className), 220);
  }, []);

  const getCardSpan = useCallback(() => {
    const track = trackRef.current;
    if (!track) return 0;
    const card = track.querySelector<HTMLElement>(itemSelector);
    const width = card?.clientWidth ?? track.clientWidth;
    let gap = 0;
    if (typeof window !== 'undefined') {
      const styles = window.getComputedStyle(track);
      gap = parseFloat(styles.columnGap || styles.gap || '0');
    }
    return width + gap;
  }, [itemSelector]);

  const scrollByCard = useCallback(
    (direction: -1 | 1) => {
      const track = trackRef.current;
      if (!track) return;
      const delta = getCardSpan() || track.clientWidth;
      const atStart = track.scrollLeft <= 0 && direction < 0;
      const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 1 && direction > 0;
      
      if (atStart) {
        bounce(bounceLeftClass);
        return;
      }
      if (atEnd) {
        bounce(bounceRightClass);
        return;
      }
      
      if (typeof track.scrollBy === 'function') {
        track.scrollBy({ left: direction * delta, behavior: 'smooth' });
      } else {
        track.scrollLeft += direction * delta;
        updateScrollButtons();
      }
    },
    [bounce, updateScrollButtons, getCardSpan, bounceLeftClass, bounceRightClass]
  );

  useEffect(() => {
    updateScrollButtons();
    const handler = () => updateScrollButtons();
    window.addEventListener('resize', handler);
    const track = trackRef.current;
    track?.addEventListener('scroll', handler);
    return () => {
      window.removeEventListener('resize', handler);
      track?.removeEventListener('scroll', handler);
    };
  }, [itemCount, updateScrollButtons]);

  return {
    trackRef,
    canScrollLeft,
    canScrollRight,
    scrollByCard,
    updateScrollButtons
  };
}
