
import HorizontalScroller from '@components/HorizontalScroller';
import { useLanguage } from '@contexts/LanguageContext';
import { usePortfolioContent } from '@contexts/PortfolioSpecContext';
import { Card } from '@design-system/primitives/Card';
import { Chip } from '@design-system/primitives/Chip';
import { SectionHeader as DsSectionHeader } from '@design-system/primitives/SectionHeader';
import { SectionWrapper } from '@design-system/primitives/SectionWrapper';
import { useSectionTelemetry } from '@telemetry/useSectionTelemetry';
import { m } from 'framer-motion';
import { Bot, Cloud, Cpu, Smartphone } from 'lucide-react';
import { type ReactElement } from 'react';

import type { SkillCategory } from '@portfolio-types';

type SkillItem = SkillCategory['items'][number];

const iconMap: Record<string, ReactElement> = {
  device: <Smartphone size={32} />,
  robot: <Bot size={32} />,
  cloud: <Cloud size={32} />
};

export default function Skills() {
  const { data } = useLanguage();
  const skillsSpec = usePortfolioContent('skills');
  useSectionTelemetry('skills');
  const sectionTitle = data.sections.skills.title || stripBraces(skillsSpec?.title);
  const sectionSubtitle =
    'Herramientas y frameworks con los que construyo soluciones móviles e IA de forma integral.';

  return (
    <SectionWrapper id="skills" aria-labelledby="skills-heading" data-dev-id="3100">
      <div className="ds-stack">
        <DsSectionHeader
          eyebrow={stripBraces(skillsSpec?.title) || (data.lang === 'en' ? 'Core stack' : 'Stack principal')}
          title={sectionTitle}
          subtitle={sectionSubtitle}
        />
      </div>

      <div className="page-section__body" data-dev-id="3103">
        <HorizontalScroller
          itemCount={data.sections.skills.categories.length}
          itemSelector=".skills-card"
          prevLabelKey="prevSkills"
          nextLabelKey="nextSkills"
        >
          {data.sections.skills.categories.map((cat: SkillCategory) => (
            <m.article
              key={cat.id}
              className="skills-card card"
              data-dev-id={`310${String(cat.id ?? '').slice(-1) || '5'}`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              role="listitem"
            >
              <Card as="div">
                <div className="skill-card__icon" aria-hidden="true">
                  {iconMap[cat.icon] ?? <Cpu size={32} />}
                </div>
                <h3 className="text-lg font-bold mb-4">{cat.title}</h3>
                <ul className="skill-card__chips" aria-label={`Habilidades de ${cat.title}`}>
                  {cat.items.map((item: SkillItem) => (
                    <li key={item}>
                      <Chip>{item}</Chip>
                    </li>
                  ))}
                </ul>
              </Card>
            </m.article>
          ))}
        </HorizontalScroller>
      </div>
    </SectionWrapper>
  );
}

function stripBraces(value?: string) {
  if (!value) return '';
  return value.replace(/^\{|\}$/g, '').replace(/^[^:]+:\s*/, '');
}
