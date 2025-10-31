import type { ReactElement } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Bot, Cloud, Cpu } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useReducedMotion } from '../hooks/useReducedMotion';
import type { SkillCategory } from '../types/portfolio';

const iconMap: Record<string, ReactElement> = {
  device: <Smartphone size={24} />,
  robot: <Bot size={24} />,
  cloud: <Cloud size={24} />,
  cpu: <Cpu size={24} />,
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
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Skills() {
  const { data, t } = useLanguage();
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="skills" className="page-section" aria-labelledby="skills-heading">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-16">
          <h2 id="skills-heading" className="text-3xl md:text-4xl font-bold">
            {t('skills.title', 'Habilidades y Stack Tecnológico')}
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-text-muted">
            {t('skills.subtitle', 'Herramientas con las que construyo soluciones robustas, desde el prototipo hasta el despliegue.')}
          </p>
        </header>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
          initial={shouldReduceMotion ? 'visible' : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={containerVariants}
        >
          {data.sections.skills.categories.map((cat: SkillCategory) => (
            <motion.div
              key={cat.id}
              className="bg-surface-raised p-6 rounded-lg border border-border-subtle shadow-md"
              variants={itemVariants}
              whileHover={shouldReduceMotion ? {} : { y: -5 }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-brand-primary/10 p-2 rounded-md text-brand-primary" aria-hidden="true">
                  {iconMap[cat.icon] ?? iconMap['cpu']}
                </div>
                <h3 className="text-lg font-semibold">{cat.title}</h3>
              </div>
              <div className="flex flex-wrap gap-2" role="list" aria-label={`Habilidades en ${cat.title}`}>
                {cat.items.map((item: string) => (
                  <span
                    key={item}
                    className="px-3 py-1 text-sm font-medium rounded-pill bg-surface-alt text-text-muted"
                    role="listitem"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
