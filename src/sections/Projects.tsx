import { m } from 'framer-motion';
import { ChevronLeft, ChevronRight, ExternalLink, Rocket } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import SearchBar from '../components/SearchBar';
import { useLanguage } from '../contexts/LanguageContext';

import type { ProjectItem } from '../types/portfolio';

const isValidHttpUrl = (value: string): boolean => {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

export default function Projects() {
  const { data } = useLanguage();
  const [currentSearchTerm, setCurrentSearchTerm] = useState('');
  const trackRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const filteredProjects = useMemo(() => {
    if (!currentSearchTerm) {
      return data.sections.projects.items;
    }
    return data.sections.projects.items.filter((proj: ProjectItem) =>
      proj.tags.some(tag => tag.toLowerCase().includes(currentSearchTerm.toLowerCase()))
    );
  }, [currentSearchTerm, data.sections.projects.items]);

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
    const card = track.querySelector<HTMLElement>('.project-card');
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
        bounce('projects-track--bounce-left');
        return;
      }
      if (atEnd) {
        bounce('projects-track--bounce-right');
        return;
      }
      if (typeof track.scrollBy === 'function') {
        track.scrollBy({ left: direction * delta, behavior: 'smooth' });
      } else {
        track.scrollLeft += direction * delta;
        updateScrollButtons();
      }
    },
    [bounce, updateScrollButtons, getCardSpan]
  );

  useEffect(() => {
    updateScrollButtons();
    const handleResize = () => updateScrollButtons();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [filteredProjects.length, updateScrollButtons]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (typeof track.scrollTo === 'function') {
      track.scrollTo({ left: 0 });
    } else {
      track.scrollLeft = 0;
    }
    const frame = requestAnimationFrame(updateScrollButtons);
    return () => cancelAnimationFrame(frame);
  }, [filteredProjects.length, updateScrollButtons]);


  const wrapperClass = [
    'projects-track-wrapper',
    canScrollLeft ? 'projects-track-wrapper--left' : '',
    canScrollRight ? 'projects-track-wrapper--right' : ''
  ]
    .filter(Boolean)
    .join(' ');

  const prevLabel = data.lang === 'en' ? 'View previous projects' : 'Ver proyectos anteriores';
  const nextLabel = data.lang === 'en' ? 'View next projects' : 'Ver siguientes proyectos';

  return (
    <section ref={sectionRef} id="projects" className="page-section" aria-labelledby="projects-heading" data-dev-id="5000">
      <header className="experience-header" data-dev-id="5001">
        <span className="experience-header__eyebrow">Casos reales</span>
        <h2 id="projects-heading" className="experience-header__title">
          {data.sections.projects.title}
        </h2>
        <p className="experience-header__subtitle">
          Lanzamientos y prototipos donde combiné iOS, liderazgo técnico e IA aplicada.
        </p>
      </header>

      <div className="page-section__body" data-dev-id="5003">
        <SearchBar
          projectItems={data.sections.projects.items}
          onSearch={setCurrentSearchTerm}
          resultCount={filteredProjects.length}
        />

        <div className={wrapperClass} data-dev-id="5002">
          <div className="projects-track" role="list" ref={trackRef} onScroll={updateScrollButtons}>
            {filteredProjects.map((proj: ProjectItem, index: number) => (
              <m.article
                key={proj.id}
                className="card project-card"
                data-dev-id={`500${index}`}
                role="listitem"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                <div className="project-thumb" aria-hidden="true">
                  <Rocket size={56} />
                </div>
                <h3 className="text-xl font-bold mb-3">{proj.title}</h3>
                <p className="text-sm mb-4">{proj.description}</p>
                <div className="project-tags" role="list" aria-label="Tecnologías del proyecto">
                  {proj.tags.map(tag => (
                    <span key={tag} className="skill-badge" role="listitem">
                      {tag}
                    </span>
                  ))}
                </div>
                {proj.link && isValidHttpUrl(proj.link) && (
                  <a
                    href={proj.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm font-bold hover:underline"
                  >
                    <ExternalLink size={24} aria-hidden="true" />
                    {data.lang === 'en' ? 'View project' : 'Ver proyecto'}
                  </a>
                )}
              </m.article>
            ))}
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
      </div>
    </section>
  );
}
