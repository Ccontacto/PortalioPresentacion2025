import { Fragment } from 'react';
import { motion } from 'framer-motion';

import { useLanguage } from '../contexts/LanguageContext';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { useReducedMotion } from '../hooks/useReducedMotion';

import type { HeroDescriptionSegment, HeroMetaItem, HeroTitleSegment, Stat } from '../types/portfolio';

export default function Hero() {
  const { data } = useLanguage();
  const [ref, visible] = useIntersectionObserver<HTMLDivElement>({ threshold: 0.3 });
  const shouldReduceMotion = useReducedMotion();

  const heroCopy = data.hero;

  const resolvedMeta = (heroCopy.meta ?? []).reduce<{ label: string; value: string }[]>(
    (acc, metaItem: HeroMetaItem) => {
      const value =
        'field' in metaItem && metaItem.field
          ? data[metaItem.field]
          : 'value' in metaItem
          ? metaItem.value
          : undefined;
      if (value) {
        acc.push({ label: metaItem.label, value });
      }
      return acc;
    },
    []
  );

  const titleSegments: HeroTitleSegment[] = heroCopy.titleSegments?.length
    ? heroCopy.titleSegments
    : [{ text: data.title }];

  const descriptionSegments: HeroDescriptionSegment[] = heroCopy.descriptionSegments?.length
    ? heroCopy.descriptionSegments
    : [{ text: data.description }];

  const tagline = heroCopy.tagline ?? data.tagline;
  const status = heroCopy.status;
  const note = heroCopy.note;

  return (
    <section id="home" className="page-section page-section--hero" aria-labelledby="hero-heading">
      <motion.div
        ref={ref}
        className="hero-shell"
        initial={shouldReduceMotion ? undefined : { opacity: 0, y: 32 }}
        animate={shouldReduceMotion ? undefined : { opacity: visible ? 1 : 0, y: visible ? 0 : 32 }}
      >
        <div className="hero-backdrop" aria-hidden="true"></div>
        <div className="hero-grid">
          <div className="hero-content">
            <span className="hero-eyebrow">{heroCopy.eyebrow}</span>
            <h1 id="hero-heading" className="hero-title">
              {titleSegments.map((segment, index) =>
                segment.accent ? (
                  <span
                    key={`${segment.text}-${index}`}
                    className={`hero-title__accent hero-title__accent--${segment.accent}`}
                  >
                    {segment.text}
                  </span>
                ) : (
                  <Fragment key={`${segment.text}-${index}`}>{segment.text}</Fragment>
                )
              )}
            </h1>
            <p className="hero-tagline">{tagline}</p>
            <p className="hero-description">
              {descriptionSegments.map((segment, index) =>
                segment.accent === 'gradient' ? (
                  <span key={`${segment.text}-${index}`} className="hero-description__accent">
                    {segment.text}
                  </span>
                ) : (
                  <Fragment key={`${segment.text}-${index}`}>{segment.text}</Fragment>
                )
              )}
            </p>

            <div className="hero-actions">
              <a className="hero-action hero-action--primary" href="#projects">
                {data.ui.viewProjects}
              </a>
              <a className="hero-action hero-action--ghost" href="#contact">
                {data.ui.bookCall}
              </a>
            </div>

            <dl className="hero-meta">
              {resolvedMeta.map(item => (
                <div key={`${item.label}-${item.value}`} className="hero-meta__item">
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <aside className="hero-panel" aria-label={data.lang === 'en' ? 'Current focus' : 'Foco actual'}>
            <div className="hero-panel__card hero-panel__card--status">
              <span className="hero-panel__eyebrow">{status.title}</span>
              <p className="hero-panel__description">{status.description}</p>
            </div>

            <div className="hero-stats" role="list">
              {data.stats.map((stat: Stat) => (
                <div key={stat.id} className="hero-stat" role="listitem">
                  <span className="hero-stat__value">{stat.value}</span>
                  <span className="hero-stat__label">{stat.label}</span>
                </div>
              ))}
            </div>

            <div className="hero-panel__card hero-panel__card--note">
              <span className="hero-panel__eyebrow">{note.title}</span>
              <div className="hero-panel__tags" role="list">
                {note.items.map(item => (
                  <span key={item} className="hero-panel__tag" role="listitem">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </motion.div>
    </section>
  );
}
