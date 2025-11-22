
import HorizontalScroller from '@components/HorizontalScroller';
import { SectionLayout } from '@components/SectionLayout';
import { useLanguage } from '@contexts/LanguageContext';
import { Card } from '@design-system/primitives/Card';
import { Chip } from '@design-system/primitives/Chip';
import { useReducedMotion } from '@hooks/useReducedMotion';
import { useSectionTelemetry } from '@telemetry/useSectionTelemetry';
import { m } from 'framer-motion';

import type { FocusAreaItem } from '@portfolio-types';

export default function FocusAreas() {
  const { data } = useLanguage();
  const focus = data.sections.focus;
  const shouldReduceMotion = useReducedMotion();
  useSectionTelemetry('focus');

  if (!focus) {
    return null;
  }

  return (
    <SectionLayout
      id="focus"
      className="page-section--focus"
      data-dev-id="3000"
      headerClassName="focus-header"
      eyebrow={focus.eyebrow}
      title={focus.title}
      subtitle={focus.subtitle}
    >
      <div data-dev-id="3002">
        <HorizontalScroller itemCount={focus.items.length} itemSelector=".focus-card" prevLabelKey="prevFocus" nextLabelKey="nextFocus">
          {focus.items.map((item: FocusAreaItem, index: number) => (
            <m.article
              key={item.id}
              className="focus-card"
              data-dev-id={`300${index}`}
              role="listitem"
              initial={shouldReduceMotion ? undefined : { opacity: 0, y: 40 }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={shouldReduceMotion ? undefined : { once: true, amount: 0.35 }}
              transition={shouldReduceMotion ? undefined : { delay: index * 0.08 }}
            >
              <Card as="div">
                <span className="focus-card__eyebrow">{item.eyebrow}</span>
                <h3 className="focus-card__title">{item.title}</h3>
                <p className="focus-card__description">{item.description}</p>
                <ul className="focus-card__list">
                  {item.highlights.map(highlight => (
                    <li key={highlight}>
                      <Chip className="focus-card__list-item">{highlight}</Chip>
                    </li>
                  ))}
                </ul>
              </Card>
            </m.article>
          ))}
        </HorizontalScroller>
      </div>
    </SectionLayout>
  );
}
