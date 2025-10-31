import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { useReducedMotion } from '../hooks/useReducedMotion';
import type { ExperienceJob } from '../types/portfolio';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0 },
};

const itemVariantsRight = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0 },
};

export default function Experience() {
  const { data, t } = useLanguage();
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="experience" className="page-section bg-surface-alt" aria-labelledby="experience-heading">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-16">
          <h2 id="experience-heading" className="text-3xl md:text-4xl font-bold">
            {t('experience.title', 'Experiencia Profesional')}
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-text-muted">
            {t('experience.subtitle', 'Liderazgo técnico, arquitectura y desarrollo de productos de alto impacto.')}
          </p>
        </header>

        <motion.div
          className="relative max-w-4xl mx-auto"
          initial={shouldReduceMotion ? 'visible' : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={containerVariants}
        >
          {/* Línea de tiempo visual */}
          <div className="absolute left-1/2 top-0 h-full w-0.5 bg-border-default -translate-x-1/2" aria-hidden="true" />

          {data.sections.experience.jobs.map((job: ExperienceJob, index: number) => {
            const isLeft = index % 2 === 0;
            return (
              <motion.div
                key={job.id}
                className="relative"
                variants={isLeft ? itemVariants : itemVariantsRight}
              >
                <div className={`flex ${isLeft ? 'flex-row-reverse' : 'flex-row'} items-start mb-12`}>
                  {/* Tarjeta de contenido */}
                  <div className={`w-full md:w-5/12 p-6 bg-surface-raised rounded-lg shadow-md border border-border-subtle`}>
                    <time className="block text-sm font-semibold uppercase tracking-wider text-brand-primary">
                      {job.period}
                    </time>
                    <h3 className="text-xl font-bold mt-1">{job.role}</h3>
                    <p className="text-sm text-text-muted mb-4">{job.company}</p>
                    <p className="text-text-muted">{job.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2" role="list" aria-label="Tecnologías">
                      {job.tags.map((tag: string) => (
                        <span key={tag} className="px-3 py-1 text-xs font-medium rounded-pill bg-surface-alt text-text-muted" role="listitem">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  {/* Círculo en la línea de tiempo */}
                  <div className="absolute left-1/2 top-2 -translate-x-1/2 w-4 h-4 rounded-full bg-brand-primary border-4 border-surface-alt" aria-hidden="true" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
