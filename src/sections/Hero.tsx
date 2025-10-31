import { motion } from 'framer-motion';
import { ArrowDownToLine, MessageCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { Button } from '../components/atoms/Button';
import type { Stat } from '../types/portfolio';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Hero() {
  const { data, t } = useLanguage();
  const [ref, visible] = useIntersectionObserver<HTMLDivElement>({ threshold: 0.2 });
  const shouldReduceMotion = useReducedMotion();

  const heroTitleHtml = t('title', 'Generative AI & iOS')
    .replace('Generative AI', '<span class="text-gradient">Generative AI</span>')
    .replace('iOS', '<span class="text-gradient">iOS</span>');

  return (
    <section id="home" className="page-section min-h-screen flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-5 gap-12 items-center"
          initial={shouldReduceMotion ? 'visible' : 'hidden'}
          animate={visible ? 'visible' : 'hidden'}
          variants={containerVariants}
        >
          {/* Columna Izquierda: Texto y Botones */}
          <div className="md:col-span-3 text-center md:text-left">
            <motion.h1
              className="text-5xl md:text-6xl font-extrabold uppercase tracking-tight"
              dangerouslySetInnerHTML={{ __html: heroTitleHtml }}
              variants={itemVariants}
            />
            <motion.p className="mt-6 max-w-xl mx-auto md:mx-0 text-lg text-text-muted" variants={itemVariants}>
              {t('description', 'Consultor independiente con +12 años de experiencia, transformando ideas en productos excepcionales. Mi especialidad es la integración de IA generativa en aplicaciones móviles nativas.')}
            </motion.p>
            <motion.div className="mt-8 flex justify-center md:justify-start gap-4" variants={itemVariants}>
              <Button size="lg">
                <MessageCircle className="mr-2 h-5 w-5" />
                {t('contactMe', 'Contáctame')}
              </Button>
              <Button variant="secondary" size="lg">
                <ArrowDownToLine className="mr-2 h-5 w-5" />
                {t('downloadCv', 'Descargar CV')}
              </Button>
            </motion.div>
          </div>

          {/* Columna Derecha: Avatar y Estadísticas */}
          <motion.div className="md:col-span-2 flex flex-col items-center gap-8" variants={itemVariants}>
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-br from-brand-primary to-state-info rounded-full blur-md" />
              <div className="relative w-40 h-40 flex items-center justify-center bg-surface-raised rounded-full border-2 border-border-subtle text-5xl font-bold text-text-primary">
                JC
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {data.stats.map((stat: Stat) => (
                <div key={stat.id} className="flex items-center gap-4">
                  <p className="text-3xl font-bold text-gradient">{stat.value}</p>
                  <p className="text-sm text-text-muted">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
