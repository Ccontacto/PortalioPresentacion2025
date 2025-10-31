import { motion } from 'framer-motion';
import { ExternalLink, Rocket } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useReducedMotion } from '../hooks/useReducedMotion';
import type { ProjectItem } from '../types/portfolio';

const isValidHttpUrl = (value: string | undefined): value is string => {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0 },
};

export default function Projects() {
  const { data, t } = useLanguage();
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="projects" className="page-section" aria-labelledby="projects-heading">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-16">
          <h2 id="projects-heading" className="text-3xl md:text-4xl font-bold">
            {t('projects.title', 'Proyectos Destacados')}
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-text-muted">
            {t('projects.subtitle', 'Casos de estudio donde he aplicado mis habilidades para resolver problemas complejos.')}
          </p>
        </header>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
          initial={shouldReduceMotion ? 'visible' : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={containerVariants}
        >
          {data.sections.projects.items.map((proj: ProjectItem) => (
            <motion.article
              key={proj.id}
              className="bg-surface-raised rounded-lg border border-border-subtle overflow-hidden flex flex-col shadow-md"
              variants={itemVariants}
              whileHover={shouldReduceMotion ? {} : { y: -5 }}
            >
              <div className="bg-surface-alt h-40 flex items-center justify-center text-brand-primary">
                <Rocket size={48} strokeWidth={1.5} />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold mb-2">{proj.title}</h3>
                <p className="text-text-muted flex-grow">{proj.description}</p>
                <div className="flex flex-wrap gap-2 my-4" role="list" aria-label="Tecnologías">
                  {proj.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs font-medium rounded-pill bg-surface-alt text-text-muted"
                      role="listitem"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                {isValidHttpUrl(proj.link) && (
                  <a
                    href={proj.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-brand-primary hover:text-brand-hover transition-colors"
                  >
                    {t('projects.view', 'Ver proyecto')}
                    <ExternalLink size={16} />
                  </a>
                )}
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
