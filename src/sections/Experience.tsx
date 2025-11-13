import { m } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { useLanguage } from '../contexts/LanguageContext';

import type { ExperienceJob } from '../types/portfolio';

export default function Experience() {
  const { data } = useLanguage();
  const jobs = data.sections.experience.jobs as ExperienceJob[];
  const trackRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
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
    setTimeout(() => track.classList.remove(className), 250);
  }, []);

  const getCardSpan = useCallback(() => {
    const track = trackRef.current;
    if (!track) return 0;
    const card = track.querySelector<HTMLElement>('.experience-node');
    const width = card?.clientWidth ?? track.clientWidth;
    let gap = 0;
    if (typeof window !== 'undefined') {
      const styles = window.getComputedStyle(track);
      gap = parseFloat(styles.columnGap || styles.gap || '0');
    }
    return width + gap;
  }, []);

  const scrollByCard = useCallback(
    (direction: -1 | 1) => {
      const track = trackRef.current;
      if (!track) return;
      const delta = getCardSpan() || track.clientWidth;
      const atStart = track.scrollLeft <= 0 && direction < 0;
      const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 1 && direction > 0;
      if (atStart) {
        bounce('experience-track--snap-bounce-left');
        return;
      }
      if (atEnd) {
        bounce('experience-track--snap-bounce-right');
        return;
      }
      if (typeof track.scrollBy === 'function') {
        track.scrollBy({ left: direction * delta, behavior: 'smooth' });
      } else {
        track.scrollLeft += direction * delta;
        updateScrollButtons();
      }
    },
    [bounce, getCardSpan, updateScrollButtons]
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
  }, [jobs.length, updateScrollButtons]);

  // Asegura que el carrusel inicie en la posición 0 (izquierda)
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    try {
      if (typeof track.scrollTo === 'function') {
        track.scrollTo({ left: 0 });
      } else {
        track.scrollLeft = 0;
      }
    } finally {
      // Sincroniza visibilidad de botones después del frame
      const raf = requestAnimationFrame(updateScrollButtons);
      return () => cancelAnimationFrame(raf);
    }
  }, [jobs.length, updateScrollButtons]);


  const wrapperClass = [
    'experience-track-wrapper',
    canScrollLeft ? 'experience-track-wrapper--left' : '',
    canScrollRight ? 'experience-track-wrapper--right' : ''
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <section ref={sectionRef} id="experience" className="page-section" aria-labelledby="experience-heading" data-dev-id="4000">
      <header className="experience-header" data-dev-id="4001">
        <span className="experience-header__eyebrow">Trayectoria destacada</span>
        <h2 id="experience-heading" className="experience-header__title">
          {data.sections.experience.title}
        </h2>
        <p className="experience-header__subtitle">
          Dirección técnica, liderazgo de squads y exploración de IA generativa aplicadas a productos reales.
        </p>
      </header>

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
              <aside className="experience-node__meta">
                <time className="experience-node__period">{job.period}</time>
                <span className="experience-node__company">{job.company}</span>
              </aside>

              <div className="experience-node__body">
                <h3 className="experience-node__role">{job.role}</h3>
                <p className="experience-node__description">{job.description}</p>
                <div className="experience-node__tags" role="list" aria-label="Tecnologías utilizadas">
                  {job.tags.map(tag => (
                    <span key={tag} className="skill-badge experience-node__tag" role="listitem">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
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
            <ChevronLeft size={18} />
          </button>
        ) : null}
        {canScrollRight ? (
          <button
            type="button"
            className="experience-scroll-btn experience-scroll-btn--right"
            aria-label="Ver experiencia siguiente"
            onClick={() => scrollByCard(1)}
          >
            <ChevronRight size={18} />
          </button>
        ) : null}
      </div>
    </section>
  );
}
