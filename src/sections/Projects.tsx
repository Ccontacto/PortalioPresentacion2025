import { motion } from 'framer-motion';
import { ExternalLink, Rocket } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import type { ProjectItem } from '../types/portfolio';

type ProjectTag = ProjectItem['tags'][number];

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

  return (
    <section id="projects" className="page-section" aria-labelledby="projects-heading">
      <h2 id="projects-heading" className="text-4xl font-bold mb-12 text-center">
        {data.sections.projects.title}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl">
        {data.sections.projects.items.map((proj: ProjectItem, index: number) => (
          <motion.article
            key={proj.id}
            className="card"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="project-thumb" aria-hidden="true">
              <Rocket size={56} />
            </div>
            <h3 className="text-xl font-bold mb-3">{proj.title}</h3>
            <p className="text-sm mb-4">{proj.description}</p>
            <div className="flex flex-wrap gap-2 mb-4" role="list" aria-label="Tecnologías del proyecto">
              {proj.tags.map((tag: ProjectTag) => (
                <span
                  key={tag}
                  className="skill-badge"
                  role="listitem"
                >
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
                <ExternalLink size={16} aria-hidden="true" />
                Ver proyecto
              </a>
            )}
          </motion.article>
        ))}
      </div>
    </section>
  );
}
