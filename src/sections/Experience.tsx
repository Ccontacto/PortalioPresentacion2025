import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import type { ExperienceJob } from '../types/portfolio';

type JobTag = ExperienceJob['tags'][number];

export default function Experience() {
  const { data } = useLanguage();

  return (
    <section id="experience" className="page-section" aria-labelledby="experience-heading">
      <h2 id="experience-heading" className="text-4xl font-bold mb-12 text-center">
        {data.sections.experience.title}
      </h2>

      <div className="max-w-3xl w-full timeline">
        {data.sections.experience.jobs.map((job: ExperienceJob, index: number) => (
          <motion.article
            key={job.id}
            className="card mb-10 timeline-item"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <h3 className="text-xl font-bold mb-2">{job.role}</h3>
            <p className="font-semibold mb-1">
              {job.company} | <time>{job.period}</time>
            </p>
            <p className="text-sm mb-4">{job.description}</p>
            <div className="flex flex-wrap gap-2" role="list" aria-label="Tecnologías utilizadas">
              {job.tags.map((tag: JobTag) => (
                <span
                  key={tag}
                  className="skill-badge"
                  role="listitem"
                >
                  {tag}
                </span>
              ))}
            </div>
            {index < data.sections.experience.jobs.length - 1 ? (
              <div className="timeline-connector" aria-hidden="true">
                <span>_ _ _ _ _ _ _ _ _ _</span>
              </div>
            ) : null}
          </motion.article>
        ))}
      </div>
    </section>
  );
}
