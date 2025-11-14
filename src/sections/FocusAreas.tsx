import { m } from 'framer-motion';

import { useLanguage } from '../contexts/LanguageContext';
import { useReducedMotion } from '../hooks/useReducedMotion';

import type { FocusAreaItem } from '../types/portfolio';

export default function FocusAreas() {
  const { data } = useLanguage();
  const focus = data.sections.focus;
  const shouldReduceMotion = useReducedMotion();

  if (!focus) {
    return null;
  }

  return (
    <section id="focus" className="page-section page-section--focus" aria-labelledby="focus-heading" data-dev-id="3000">
      <header className="focus-header" data-dev-id="3001">
        <span className="focus-header__eyebrow">{focus.eyebrow}</span>
        <h2 id="focus-heading" className="focus-header__title">
          {focus.title}
        </h2>
        <p className="focus-header__subtitle">{focus.subtitle}</p>
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
            <span className="focus-card__eyebrow">{item.eyebrow}</span>
            <h3 className="focus-card__title">{item.title}</h3>
            <p className="focus-card__description">{item.description}</p>
            <ul className="focus-card__list">
              {item.highlights.map(highlight => (
                <li key={highlight} className="focus-card__list-item">
                  {highlight}
                </li>
              ))}
            </ul>
          </m.article>
        ))}
      </div>
    </section>
  );
}
