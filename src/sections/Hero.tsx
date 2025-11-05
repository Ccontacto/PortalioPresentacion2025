import { motion } from 'framer-motion';

import { useLanguage } from '../contexts/LanguageContext';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { useReducedMotion } from '../hooks/useReducedMotion';

import type { Stat } from '../types/portfolio';

export default function Hero() {
  const { data, t } = useLanguage();
  const [ref, visible] = useIntersectionObserver<HTMLDivElement>({ threshold: 0.3 });
  const shouldReduceMotion = useReducedMotion();

  const heroTitleHtml = t('title')
    .replace(
      'Líder Técnico iOS',
      '<span class="hero-intro__accent hero-intro__accent--primary">Líder Técnico iOS</span>'
    )
    .replace(
      'Arquitecto de IA',
      '<span class="hero-intro__accent hero-intro__accent--secondary">Arquitecto de IA</span>'
    );

  const heroDescriptionHtml = t('description')
    .replace('Swift/SwiftUI', '<span class="hero-intro__gradient">Swift · SwiftUI</span>')
    .replace('Clean Architecture', '<span class="hero-intro__gradient">Clean Architecture</span>')
    .replace('IA generativa', '<span class="hero-intro__gradient">IA generativa</span>')
    .replace('RAG', '<span class="hero-intro__gradient">RAG</span>')
    .replace('LangChain', '<span class="hero-intro__gradient">LangChain</span>');

  const heroTaglineHtml = t('tagline')
    .replace('IA generativa', '<span class="hero-intro__gradient hero-intro__gradient--soft">IA generativa</span>')
    .replace('iOS', '<span class="hero-intro__gradient hero-intro__gradient--soft">iOS</span>');

  return (
    <section id="home" className="page-section" aria-labelledby="hero-heading">
      <motion.div
        ref={ref}
        className="w-full max-w-4xl text-center"
        initial={shouldReduceMotion ? undefined : { opacity: 0 }}
        animate={shouldReduceMotion ? undefined : { opacity: visible ? 1 : 0 }}
      >
        <motion.div
          className="hero-avatar"
          whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
          aria-hidden="true"
        >
          <span>JC</span>
        </motion.div>

        <div className="hero-intro">
          <p className="hero-intro__title" dangerouslySetInnerHTML={{ __html: heroTitleHtml }} />
          <p className="hero-intro__tagline" dangerouslySetInnerHTML={{ __html: heroTaglineHtml }} />
          <p className="hero-intro__body" dangerouslySetInnerHTML={{ __html: heroDescriptionHtml }} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-xl mx-auto" role="list">
          {data.stats.map((stat: Stat) => (
            <div key={stat.id} className="stat-card" role="listitem">
              <span className="stat-number">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </div>

        <h2 className="hero-name mt-10">
          <span className="hero-name__text">{t('name')}</span>
          <span className="hero-name__gradient-text">{t('title')}</span>
        </h2>
      </motion.div>
    </section>
  );
}
