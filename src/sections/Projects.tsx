
import HorizontalScroller from '@components/HorizontalScroller';
import SearchBar from '@components/SearchBar';
import { useLanguage } from '@contexts/LanguageContext';
import { usePortfolioContent } from '@contexts/PortfolioSpecContext';
import { Badge } from '@design-system/primitives/Badge';
import { Card } from '@design-system/primitives/Card';
import { Chip } from '@design-system/primitives/Chip';
import { SectionHeader as DsSectionHeader } from '@design-system/primitives/SectionHeader';
import { SectionWrapper } from '@design-system/primitives/SectionWrapper';
import { useSectionTelemetry } from '@telemetry/useSectionTelemetry';
import { getSafeUrl } from '@utils/urlValidation';
import { m } from 'framer-motion';
import { ExternalLink, Rocket } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';

import type { ProjectItem } from '@portfolio-types';

export default function Projects() {
  const { data } = useLanguage();
  const projectsSpec = usePortfolioContent('featuredProjects');
  const [currentSearchTerm, setCurrentSearchTerm] = useState('');
  const sectionRef = useRef<HTMLElement | null>(null);
  useSectionTelemetry('projects');

  const filteredProjects = useMemo(() => {
    const allItems = data.sections.projects.items;
    if (!currentSearchTerm) {
      return allItems;
    }
    return allItems.filter((proj: ProjectItem) =>
      proj.tags.some(tag => tag.toLowerCase().includes(currentSearchTerm.toLowerCase()))
    );
  }, [currentSearchTerm, data.sections.projects.items]) as readonly ProjectItem[];

  return (
    <SectionWrapper ref={sectionRef} id="projects" aria-labelledby="projects-heading" data-dev-id="5000">
      <div className="ds-stack">
        <Badge>{projectsSpec?.title ? stripBraces(projectsSpec.title) : 'Casos reales'}</Badge>
        <DsSectionHeader
          title={data.sections.projects.title}
          subtitle="Lanzamientos y prototipos donde combiné iOS, liderazgo técnico e IA aplicada."
        />
      </div>

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
                className="project-card"
                data-dev-id={`500${index}`}
                role="listitem"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                <Card as="div">
                  <div className="project-thumb" aria-hidden="true">
                    <Rocket size={56} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{proj.title}</h3>
                  <p className="text-sm mb-4">{proj.description}</p>
                  <ul className="project-tags" aria-label="Tecnologías del proyecto">
                    {proj.tags.map(tag => (
                      <li key={tag}>
                        <Chip className="skill-badge">{tag}</Chip>
                      </li>
                    ))}
                  </ul>
                  {safeLink ? (
                    <a href={safeLink} target="_blank" rel="noopener noreferrer" className="project-card__link">
                      <ExternalLink size={24} aria-hidden="true" />
                      {data.lang === 'en' ? 'View project' : 'Ver proyecto'}
                    </a>
                  ) : null}
                </Card>
              </m.article>
            );
          })}
        </HorizontalScroller>
      </div>
    </SectionWrapper>
  );
}

function stripBraces(value?: string) {
  if (!value) return '';
  return value.replace(/^\{|\}$/g, '').replace(/^[^:]+:\s*/, '');
}
