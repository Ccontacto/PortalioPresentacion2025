import { Github, Linkedin, Mail } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from '../components/atoms/Button';

// Un prompt de ejemplo, podrías obtenerlo del contexto o de un archivo de datos.
const semanticPrompt = "explorando la intersección entre diseño generativo y sistemas adaptativos";

export default function Contact() {
  const { data, t } = useLanguage();
  const { theme } = useTheme();

  return (
    <>
      <section id="contact" className="page-section bg-surface-alt" aria-labelledby="contact-heading">
        <div className="container mx-auto text-center flex flex-col items-center gap-6">
          <h2 id="contact-heading" className="text-3xl md:text-4xl font-bold">
            {t('contact.title', 'Hablemos')}
          </h2>
          <p className="max-w-2xl text-lg text-text-muted">
            {t('contact.subtitle', 'Estoy disponible para colaboraciones y nuevos proyectos. No dudes en contactarme.')}
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            <Button as="a" href={`mailto:${data.email}`} size="lg">
              <Mail className="mr-2 h-5 w-5" />
              {t('contact.email', 'Enviar Email')}
            </Button>
            <Button as="a" href={data.social?.linkedin ?? '#'} target="_blank" rel="noopener noreferrer" variant="secondary" size="lg">
              <Linkedin className="mr-2 h-5 w-5" />
              LinkedIn
            </Button>
            <Button as="a" href={data.social?.github ?? '#'} target="_blank" rel="noopener noreferrer" variant="secondary" size="lg">
              <Github className="mr-2 h-5 w-5" />
              GitHub
            </Button>
          </div>
        </div>
      </section>

      <footer role="contentinfo" className="py-8 text-center text-sm text-text-muted border-t border-border-subtle">
        <p>
          © {new Date().getFullYear()} {data.name}. {t('footer.rights', 'Todos los derechos reservados.')}
        </p>
        <p className="text-xs opacity-75 mt-2">
          {t('footer.builtWith', 'Desarrollado con React, TypeScript, y un sistema de diseño atómico.')}
        </p>

        {/* Elemento de texto semántico final */}
        <p className="mt-8 text-xs font-mono tracking-widest uppercase">
          {theme === 'dark'
            ? <span className="text-white/10 hover:text-white/30 transition-colors duration-slow">{semanticPrompt}</span>
            : <span className="text-black/10 hover:text-black/30 transition-colors duration-slow">{semanticPrompt}</span>
          }
        </p>
      </footer>
    </>
  );
}
