
import Icon from '@components/icons/VectorIcon';
import { SectionLayout } from '@components/SectionLayout';
import { useLanguage } from '@contexts/LanguageContext';
import { Card } from '@design-system/primitives/Card';
import { Chip } from '@design-system/primitives/Chip';
import { useHorizontalScroll } from '@hooks/useHorizontalScroll';
import { useSectionTelemetry } from '@telemetry/useSectionTelemetry';
import { m } from 'framer-motion';
import { useEffect } from 'react';

import type { ExperienceJob } from '@portfolio-types';

export default function Experience() {
  const { data } = useLanguage();
  const jobs = data.sections.experience.jobs as ExperienceJob[];
  useSectionTelemetry('experience');
  
  const { trackRef, canScrollLeft, canScrollRight, scrollByCard, updateScrollButtons } = useHorizontalScroll({
    bounceLeftClass: 'experience-track--snap-bounce-left',
    bounceRightClass: 'experience-track--snap-bounce-right',
    itemSelector: '.experience-node',
    itemCount: jobs.length
  });

  // Asegura que el carrusel inicie en la posición 0 (izquierda)
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    
    if (typeof track.scrollTo === 'function') {
      track.scrollTo({ left: 0 });
    } else {
      track.scrollLeft = 0;
    }
    
    // Sincroniza visibilidad de botones después del frame
    const raf = requestAnimationFrame(updateScrollButtons);
    return () => cancelAnimationFrame(raf);
  }, [jobs.length, trackRef, updateScrollButtons]);


  const wrapperClass = [
    'experience-track-wrapper',
    canScrollLeft ? 'experience-track-wrapper--left' : '',
    canScrollRight ? 'experience-track-wrapper--right' : ''
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <SectionLayout
      id="experience"
      data-dev-id="4000"
      eyebrow={data.lang === 'en' ? 'Trajectory' : 'Trayectoria destacada'}
      title={data.sections.experience.title}
    >
      <div className={wrapperClass}>
        <div
          className="experience-track experience-track--horizontal"
          data-dev-id="4002"
          role="list"
          ref={trackRef}
          onScroll={updateScrollButtons}
        >
          {jobs.map((job: ExperienceJob, index: number) => (
            <m.article
              key={job.id}
              className="experience-node"
              data-dev-id={`400${index}`}
              role="listitem"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
            >
              <Card as="div" className="experience-node__card">
                <aside className="experience-node__meta">
                  <time className="experience-node__period">{job.period}</time>
                  <span className="experience-node__company">{job.company}</span>
                </aside>

                <div className="experience-node__body">
                  <h3 className="experience-node__role">{job.role}</h3>
                  <p className="experience-node__description">{job.description}</p>
                  <ul className="experience-node__tags" aria-label="Tecnologías utilizadas">
                    {job.tags.map(tag => (
                      <li key={tag}>
                        <Chip className="experience-node__tag">{tag}</Chip>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </m.article>
          ))}
        </div>
        {canScrollLeft ? (
          <button
            type="button"
            className="experience-scroll-btn experience-scroll-btn--left"
            aria-label="Ver experiencia anterior"
            onClick={() => scrollByCard(-1)}
          >
            <Icon name="chevronLeft" size={18} aria-hidden />
          </button>
        ) : null}
        {canScrollRight ? (
          <button
            type="button"
            className="experience-scroll-btn experience-scroll-btn--right"
            aria-label="Ver experiencia siguiente"
            onClick={() => scrollByCard(1)}
          >
            <Icon name="chevronRight" size={18} aria-hidden />
          </button>
        ) : null}
      </div>
    </SectionLayout>
  );
}
