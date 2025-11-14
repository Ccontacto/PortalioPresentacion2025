import { m } from 'framer-motion';
import { Bot, Cloud, Cpu, Smartphone } from 'lucide-react';
import { type ReactElement } from 'react';

import HorizontalScroller from '../components/HorizontalScroller';
import SectionHeader from '../components/SectionHeader';
import { useLanguage } from '../contexts/LanguageContext';

import type { SkillCategory } from '../types/portfolio';

type SkillItem = SkillCategory['items'][number];

const iconMap: Record<string, ReactElement> = {
  device: <Smartphone size={32} />,
  robot: <Bot size={32} />,
  cloud: <Cloud size={32} />
};

export default function Skills() {
  const { data } = useLanguage();

  return (
    <section id="skills" className="page-section" aria-labelledby="skills-heading" data-dev-id="3100">
      <SectionHeader
        id="skills-heading"
        eyebrow="Stack principal"
        title={data.sections.skills.title}
        subtitle="Herramientas y frameworks con los que construyo soluciones móviles e IA de forma integral."
      />

      <div className="page-section__body" data-dev-id="3103">
        <HorizontalScroller
          itemCount={data.sections.skills.categories.length}
          itemSelector=".card"
          prevLabelKey="prevSkills"
          nextLabelKey="nextSkills"
        >
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
        </HorizontalScroller>
      </div>
    </section>
  );
}
