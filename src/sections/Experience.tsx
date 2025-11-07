import { m } from 'framer-motion';

import { useLanguage } from '../contexts/LanguageContext';

import type { ExperienceJob } from '../types/portfolio';

type JobTag = ExperienceJob['tags'][number];

export default function Experience() {
  const { data } = useLanguage();

  return (
    <section id="experience" className="page-section" aria-labelledby="experience-heading">
      <header className="experience-header">
        <span className="experience-header__eyebrow">Trayectoria destacada</span>
        <h2 id="experience-heading" className="experience-header__title">
          {data.sections.experience.title}
        </h2>
        <p className="experience-header__subtitle">
          Dirección técnica, liderazgo de squads y exploración de IA generativa aplicadas a productos reales.
        </p>
      </header>

      <div className="experience-track">
        {data.sections.experience.jobs.map((job: ExperienceJob, index: number) => {
          const isLast = index === data.sections.experience.jobs.length - 1;
          return (
            <m.article
              key={job.id}
              className={`experience-node${isLast ? ' experience-node--last' : ''}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
            >
              <span className="experience-node__marker" aria-hidden="true"></span>
              <aside className="experience-node__meta">
                <time className="experience-node__period">{job.period}</time>
                <span className="experience-node__company">{job.company}</span>
              </aside>

              <div className="experience-node__body">
                <h3 className="experience-node__role">{job.role}</h3>
                <p className="experience-node__description">{job.description}</p>
                <div className="experience-node__tags" role="list" aria-label="Tecnologías utilizadas">
                  {job.tags.map((tag: JobTag) => (
                    <span key={tag} className="skill-badge experience-node__tag" role="listitem">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </m.article>
          );
        })}
      </div>
    </section>
  );
}
