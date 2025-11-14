import { m } from 'framer-motion';
import { ExternalLink, Rocket } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';

import HorizontalScroller from '../components/HorizontalScroller';
import SearchBar from '../components/SearchBar';
import SectionHeader from '../components/SectionHeader';
import { useLanguage } from '../contexts/LanguageContext';
import { getSafeUrl } from '../utils/urlValidation';

import type { ProjectItem } from '../types/portfolio';

export default function Projects() {
  const { data } = useLanguage();
  const [currentSearchTerm, setCurrentSearchTerm] = useState('');
  const sectionRef = useRef<HTMLElement | null>(null);

  const filteredProjects = useMemo(() => {
    if (!currentSearchTerm) {
      return data.sections.projects.items;
    }
    return data.sections.projects.items.filter((proj: ProjectItem) =>
      proj.tags.some(tag => tag.toLowerCase().includes(currentSearchTerm.toLowerCase()))
    );
  }, [currentSearchTerm, data.sections.projects.items]);

  return (
    <section ref={sectionRef} id="projects" className="page-section" aria-labelledby="projects-heading" data-dev-id="5000">
      <SectionHeader
        id="projects-heading"
        eyebrow="Casos reales"
        title={data.sections.projects.title}
        subtitle="Lanzamientos y prototipos donde combiné iOS, liderazgo técnico e IA aplicada."
      />

      <div className="page-section__body" data-dev-id="5003">
        <SearchBar
          projectItems={data.sections.projects.items}
          onSearch={setCurrentSearchTerm}
          resultCount={filteredProjects.length}
        />

        <HorizontalScroller
          itemCount={filteredProjects.length}
          itemSelector=".project-card"
          bounceLeftClass="projects-track--bounce-left"
          bounceRightClass="projects-track--bounce-right"
          prevLabelKey="prevProjects"
          nextLabelKey="nextProjects"
        >
          {filteredProjects.map((proj: ProjectItem, index: number) => {
            const safeLink = proj.link ? getSafeUrl(proj.link) : null;
            return (
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
                {safeLink ? (
                  <a
                    href={safeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm font-bold hover:underline"
                  >
                    <ExternalLink size={24} aria-hidden="true" />
                    {data.lang === 'en' ? 'View project' : 'Ver proyecto'}
                  </a>
                ) : null}
              </m.article>
            );
          })}
        </HorizontalScroller>
      </div>
    </section>
  );
}
