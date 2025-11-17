import { m } from 'framer-motion';

import { useLanguage } from '../contexts/LanguageContext';
import { Badge } from '../design-system/primitives/Badge';
import { Card } from '../design-system/primitives/Card';
import { Chip } from '../design-system/primitives/Chip';
import { SectionHeader as DsSectionHeader } from '../design-system/primitives/SectionHeader';
import { SectionWrapper } from '../design-system/primitives/SectionWrapper';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useSectionTelemetry } from '../hooks/useSectionTelemetry';

import type { FocusAreaItem } from '../types/portfolio';

export default function FocusAreas() {
  const { data } = useLanguage();
  const focus = data.sections.focus;
  const shouldReduceMotion = useReducedMotion();
  useSectionTelemetry('focus');

  if (!focus) {
    return null;
  }

  return (
    <SectionWrapper id="focus" className="page-section--focus" aria-labelledby="focus-heading" data-dev-id="3000">
      <header className="focus-header" data-dev-id="3001">
        <Badge>{focus.eyebrow}</Badge>
        <DsSectionHeader title={focus.title} subtitle={focus.subtitle} />
      </header>

      <div className="focus-grid" role="list" data-dev-id="3002">
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
      </div>
    </SectionWrapper>
  );
}
