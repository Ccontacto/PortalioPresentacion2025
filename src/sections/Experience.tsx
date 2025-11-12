import { m } from 'framer-motion';

import { useLanguage } from '../contexts/LanguageContext';

import type { ExperienceJob } from '../types/portfolio';

export default function Experience() {
  const { data } = useLanguage();
  const jobs = data.sections.experience.jobs as ExperienceJob[];

  return (
    <section id="experience" className="page-section" aria-labelledby="experience-heading" data-dev-id="4000">
      <header className="experience-header" data-dev-id="4001">
        <span className="experience-header__eyebrow">Trayectoria destacada</span>
        <h2 id="experience-heading" className="experience-header__title">
          {data.sections.experience.title}
        </h2>
        <p className="experience-header__subtitle">
          Dirección técnica, liderazgo de squads y exploración de IA generativa aplicadas a productos reales.
        </p>
      </header>

      <div className="experience-track experience-track--horizontal" data-dev-id="4002" role="list">
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
    </section>
  );
}
