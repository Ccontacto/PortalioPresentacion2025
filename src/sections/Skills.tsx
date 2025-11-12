import { m } from 'framer-motion';
import { Smartphone, Bot, Cloud, Cpu } from 'lucide-react';

import { useLanguage } from '../contexts/LanguageContext';
import { useState } from 'react';

import type { SkillCategory } from '../types/portfolio';
import type { ReactElement } from 'react';

type SkillItem = SkillCategory['items'][number];

const iconMap: Record<string, ReactElement> = {
  device: <Smartphone size={32} />,
  robot: <Bot size={32} />,
  cloud: <Cloud size={32} />
};

export default function Skills() {
  const { data } = useLanguage();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  return (
    <section id="skills" className="page-section" aria-labelledby="skills-heading" data-dev-id="3100">
      <header className="experience-header" data-dev-id="3101">
        <span className="experience-header__eyebrow">Stack principal</span>
        <h2 id="skills-heading" className="experience-header__title">
          {data.sections.skills.title}
        </h2>
        <p className="experience-header__subtitle">
          Herramientas y frameworks con los que construyo soluciones móviles e IA de forma integral.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl" data-dev-id="3102">
        {data.sections.skills.categories.map((cat: SkillCategory) => (
          <m.article
            key={cat.id}
            className="card"
            data-dev-id={`310${String(cat.id ?? '').slice(-1) || '5'}`}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
          >
            <div className="skill-card__icon" aria-hidden="true">
              {iconMap[cat.icon] ?? <Cpu size={32} />}
            </div>
            <h3 className="text-lg font-bold mb-4">{cat.title}</h3>
            <div
              className={`flex flex-wrap gap-2 ${expanded[cat.id] ? '' : 'badges-clamp-1'}`}
              role="list"
              aria-label={`Habilidades de ${cat.title}`}
            >
              {(expanded[cat.id] ? cat.items : cat.items.slice(0, 8)).map((item: SkillItem) => (
                <span
                  key={item}
                  className="skill-badge"
                  role="listitem"
                >
                  {item}
                </span>
              ))}
            </div>
            {cat.items.length > 8 && (
              <button
                type="button"
                className="collapsible-toggle"
                aria-expanded={!!expanded[cat.id]}
                onClick={() => setExpanded(s => ({ ...s, [cat.id]: !s[cat.id] }))}
              >
                {expanded[cat.id] ? 'Ver menos' : 'Ver más'}
              </button>
            )}
          </m.article>
        ))}
      </div>
    </section>
  );
}
