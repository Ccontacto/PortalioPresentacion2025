import { m } from 'framer-motion';
import { useEffect, useRef, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Smartphone, Bot, Cloud, Cpu } from 'lucide-react';

import { useLanguage } from '../contexts/LanguageContext';

import type { SkillCategory } from '../types/portfolio';
import type { ReactElement } from 'react';

type SkillItem = SkillCategory['items'][number];

const iconMap: Record<string, ReactElement> = {
  device: <Smartphone size={32} />,
  robot: <Bot size={32} />,
  cloud: <Cloud size={32} />
};

export default function Skills() {
  const { data } = useLanguage();
  const gridRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollButtons = useCallback(() => {
    const el = gridRef.current;
    if (!el) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
  }, []);

  const getCardSpan = useCallback(() => {
    const el = gridRef.current;
    if (!el) return 0;
    const card = el.querySelector<HTMLElement>('.card');
    const width = card?.clientWidth ?? el.clientWidth;
    let gap = 0;
    if (typeof window !== 'undefined') {
      const styles = window.getComputedStyle(el);
      gap = parseFloat(styles.columnGap || styles.gap || '0');
    }
    return width + gap;
  }, []);

  // Asegura que el grid horizontal inicie en 0,0
  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    if (typeof el.scrollTo === 'function') {
      el.scrollTo({ left: 0 });
    } else {
      el.scrollLeft = 0;
    }
    const raf = requestAnimationFrame(updateScrollButtons);
    return () => cancelAnimationFrame(raf);
  }, [data.sections.skills.categories.length, updateScrollButtons]);

  useEffect(() => {
    updateScrollButtons();
    const handleResize = () => updateScrollButtons();
    window.addEventListener('resize', handleResize);
    const el = gridRef.current;
    el?.addEventListener('scroll', updateScrollButtons);
    return () => {
      window.removeEventListener('resize', handleResize);
      el?.removeEventListener('scroll', updateScrollButtons);
    };
  }, [updateScrollButtons]);

  const scrollByCard = useCallback(
    (direction: -1 | 1) => {
      const el = gridRef.current;
      if (!el) return;
      const delta = getCardSpan() || el.clientWidth;
      const atStart = el.scrollLeft <= 0 && direction < 0;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1 && direction > 0;
      if (atStart || atEnd) return;
      if (typeof el.scrollBy === 'function') {
        el.scrollBy({ left: direction * delta, behavior: 'smooth' });
      } else {
        el.scrollLeft += direction * delta;
        updateScrollButtons();
      }
    },
    [getCardSpan, updateScrollButtons]
  );

  return (
    <section id="skills" className="page-section" aria-labelledby="skills-heading" data-dev-id="3100">
      <header className="experience-header" data-dev-id="3101">
        <span className="experience-header__eyebrow">Stack principal</span>
        <h2 id="skills-heading" className="experience-header__title">
          {data.sections.skills.title}
        </h2>
        <p className="experience-header__subtitle">
          Herramientas y frameworks con los que construyo soluciones móviles e IA de forma integral.
        </p>
      </header>

      <div className={[
        'projects-track-wrapper',
        canScrollLeft ? 'projects-track-wrapper--left' : '',
        canScrollRight ? 'projects-track-wrapper--right' : ''
      ].filter(Boolean).join(' ')}>
        <div ref={gridRef} className="skills-grid" data-dev-id="3102" role="list" onScroll={updateScrollButtons}>
          {data.sections.skills.categories.map((cat: SkillCategory) => (
            <m.article
              key={cat.id}
              className="card"
              data-dev-id={`310${String(cat.id ?? '').slice(-1) || '5'}`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              role="listitem"
            >
              <div className="skill-card__icon" aria-hidden="true">
                {iconMap[cat.icon] ?? <Cpu size={32} />}
              </div>
              <h3 className="text-lg font-bold mb-4">{cat.title}</h3>
              <div className="skill-card__chips" role="list" aria-label={`Habilidades de ${cat.title}`}>
                {cat.items.map((item: SkillItem) => (
                  <span key={item} className="skill-badge" role="listitem">
                    {item}
                  </span>
                ))}
              </div>
            </m.article>
          ))}
        </div>

        {canScrollLeft ? (
          <button
            type="button"
            className="projects-scroll-btn projects-scroll-btn--left"
            aria-label={data.lang === 'en' ? 'View previous skills' : 'Ver habilidades anteriores'}
            onClick={() => scrollByCard(-1)}
          >
            <ChevronLeft size={18} />
          </button>
        ) : null}

        {canScrollRight ? (
          <button
            type="button"
            className="projects-scroll-btn projects-scroll-btn--right"
            aria-label={data.lang === 'en' ? 'View next skills' : 'Ver siguientes habilidades'}
            onClick={() => scrollByCard(1)}
          >
            <ChevronRight size={18} />
          </button>
        ) : null}
      </div>
    </section>
  );
}
