import { motion } from 'framer-motion';
import { Smartphone, Bot, Cloud, Cpu } from 'lucide-react';

import { useLanguage } from '../contexts/LanguageContext';

import type { SkillCategory } from '../types/portfolio';
import type { ReactElement } from 'react';

type SkillItem = SkillCategory['items'][number];

const iconMap: Record<string, ReactElement> = {
  device: <Smartphone size={36} />,
  robot: <Bot size={36} />,
  cloud: <Cloud size={36} />
};

export default function Skills() {
  const { data } = useLanguage();

  return (
    <section id="skills" className="page-section" aria-labelledby="skills-heading">
      <header className="experience-header">
        <span className="experience-header__eyebrow">Stack principal</span>
        <h2 id="skills-heading" className="experience-header__title">
          {data.sections.skills.title}
        </h2>
        <p className="experience-header__subtitle">
          Herramientas y frameworks con los que construyo soluciones móviles e IA de forma integral.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
        {data.sections.skills.categories.map((cat: SkillCategory) => (
          <motion.article
            key={cat.id}
            className="card"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
          >
            <div className="text-4xl mb-4 text-neutral-900 dark:text-neutral-100" aria-hidden="true">
              {iconMap[cat.icon] ?? <Cpu size={36} />}
            </div>
            <h3 className="text-lg font-bold mb-4">{cat.title}</h3>
            <div className="flex flex-wrap gap-2" role="list" aria-label={`Habilidades de ${cat.title}`}>
              {cat.items.map((item: SkillItem) => (
                <span
                  key={item}
                  className="skill-badge"
                  role="listitem"
                >
                  {item}
                </span>
              ))}
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
