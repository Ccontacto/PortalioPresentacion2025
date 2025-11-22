import Icon from '@components/icons/VectorIcon';

import { useLanguage } from '../contexts/LanguageContext';
import { useHorizontalScroll } from '../hooks/useHorizontalScroll';

import type { UIStrings } from '../types/portfolio';

type HorizontalScrollerProps = {
  children: React.ReactNode;
  itemCount: number;
  itemSelector: string;
  bounceLeftClass?: string;
  bounceRightClass?: string;
  prevLabelKey: keyof UIStrings;
  nextLabelKey: keyof UIStrings;
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
    bounceLeftClass: bounceLeftClass ?? '',
    bounceRightClass: bounceRightClass ?? '',
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

  const safeUi = (data as { ui?: UIStrings }).ui ?? ({} as UIStrings);
  const prevLabel: string = safeUi[prevLabelKey] ?? 'View previous items';
  const nextLabel: string = safeUi[nextLabelKey] ?? 'View next items';

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
          <Icon name="chevronLeft" size={18} aria-hidden />
        </button>
      ) : null}

      {canScrollRight ? (
        <button
          type="button"
          className="projects-scroll-btn projects-scroll-btn--right"
          aria-label={nextLabel}
          onClick={() => scrollByCard(1)}
        >
          <Icon name="chevronRight" size={18} aria-hidden />
        </button>
      ) : null}
    </div>
  );
}
