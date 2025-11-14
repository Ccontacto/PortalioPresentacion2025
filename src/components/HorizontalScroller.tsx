import { ChevronLeft, ChevronRight } from 'lucide-react';

import { useLanguage } from '../contexts/LanguageContext';
import { useHorizontalScroll } from '../hooks/useHorizontalScroll';

type HorizontalScrollerProps = {
  children: React.ReactNode;
  itemCount: number;
  itemSelector: string;
  bounceLeftClass?: string;
  bounceRightClass?: string;
  prevLabelKey: string;
  nextLabelKey: string;
};

export default function HorizontalScroller({
  children,
  itemCount,
  itemSelector,
  bounceLeftClass,
  bounceRightClass,
  prevLabelKey,
  nextLabelKey,
}: HorizontalScrollerProps) {
  const { data } = useLanguage();
  const { trackRef, canScrollLeft, canScrollRight, scrollByCard, updateScrollButtons } = useHorizontalScroll({
    bounceLeftClass,
    bounceRightClass,
    itemSelector,
    itemCount,
  });

  const wrapperClass = [
    'projects-track-wrapper',
    canScrollLeft ? 'projects-track-wrapper--left' : '',
    canScrollRight ? 'projects-track-wrapper--right' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const prevLabel = data.ui[prevLabelKey] || 'View previous items';
  const nextLabel = data.ui[nextLabelKey] || 'View next items';

  return (
    <div className={wrapperClass}>
      <div className="projects-track" role="list" ref={trackRef} onScroll={updateScrollButtons}>
        {children}
      </div>

      {canScrollLeft ? (
        <button
          type="button"
          className="projects-scroll-btn projects-scroll-btn--left"
          aria-label={prevLabel}
          onClick={() => scrollByCard(-1)}
        >
          <ChevronLeft size={18} />
        </button>
      ) : null}

      {canScrollRight ? (
        <button
          type="button"
          className="projects-scroll-btn projects-scroll-btn--right"
          aria-label={nextLabel}
          onClick={() => scrollByCard(1)}
        >
          <ChevronRight size={18} />
        </button>
      ) : null}
    </div>
  );
}
