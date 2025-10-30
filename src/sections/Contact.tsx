import { useState } from 'react';
import { Copy, Mail } from 'lucide-react';
import { WhatsappGlyph } from '../components/icons/WhatsappGlyph';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';

type FormStatus = 'idle' | 'sending' | 'success' | 'error';

export default function Contact() {
  const { data } = useLanguage();
  const { showToast } = useToast();
  const [status, setStatus] = useState<FormStatus>('idle');
  const linkedinUrl = data.social?.linkedin ?? '';
  const linkedinLabel = linkedinUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');

  const copyEmail = async () => {
    if (!navigator.clipboard) {
      showToast(data.toasts.email_copy_error, 'error');
      return;
    }
    try {
      await navigator.clipboard.writeText(data.email);
      showToast(data.toasts.email_copy_success, 'success');
      setStatus('success');
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Clipboard copy failed', error);
      }
      showToast(data.toasts.email_copy_error, 'error');
      setStatus('error');
    }
  };

  const openEmail = () => {
    setStatus('sending');
    window.location.href = `mailto:${data.email}`;
  };

  const openWhatsApp = () => {
    setStatus('sending');
    window.open(
      `https://wa.me/${data.whatsapp}?text=${encodeURIComponent('Hola José Carlos!')}`,
      '_blank',
      'noopener,noreferrer'
    );
    showToast(data.toasts.whatsapp_open, 'info');
  };

  return (
    <>
      <section id="contact" className="page-section" aria-labelledby="contact-heading">
        <div className="max-w-2xl text-center">
          <h2 id="contact-heading" className="text-4xl font-bold mb-4">
            {data.sections.contact.title}
          </h2>
          <p className="text-2xl sm:text-3xl font-black tracking-tight mb-10">
            {data.sections.contact.subtitle}
          </p>

          {/* MEJORA 5: aria-live para feedback de contacto */}
          <div
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className="sr-only"
          >
            {status === 'sending' && 'Enviando mensaje...'}
            {status === 'success' && 'Mensaje enviado correctamente'}
            {status === 'error' && 'Error al enviar. Intenta de nuevo.'}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-12 justify-center">
            <button
              onClick={openWhatsApp}
              className="contact-cta contact-cta--whatsapp"
              aria-label="Contactar por WhatsApp"
            >
              <WhatsappGlyph className="h-7 w-7" aria-hidden="true" />
              <span className="sr-only">WhatsApp</span>
            </button>
            <button
              onClick={openEmail}
              className="contact-cta contact-cta--email"
              aria-label="Contactar por Email"
            >
              <Mail className="h-7 w-7" aria-hidden="true" />
              <span className="sr-only">Email</span>
            </button>
            <button
              onClick={copyEmail}
              className="contact-cta contact-cta--copy"
              aria-label="Copiar dirección de email"
            >
              <Copy className="h-7 w-7" aria-hidden="true" />
              <span className="sr-only">Copiar correo</span>
            </button>
          </div>

          <div className="contact-card">
            <h3 className="contact-card__title">
              {data.name}
            </h3>
            <p className="contact-card__subtitle">IA &amp; App Solutions</p>
            <div className="contact-card__item">
              <span className="contact-card__label">Email</span>
              <a href={`mailto:${data.email}`} className="contact-card__value">
                {data.email}
              </a>
            </div>
            {linkedinUrl ? (
              <div className="contact-card__item">
                <span className="contact-card__label">LinkedIn</span>
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-card__value"
                >
                  {linkedinLabel}
                </a>
              </div>
            ) : null}
            <div className="contact-card__item">
              <span className="contact-card__label">Ubicación</span>
              <span className="contact-card__value">{data.location}</span>
            </div>
            <p className="contact-card__closing">
              {data.sections.contact.closing}
            </p>
            <span className="contact-card__signature">
              {data.sections.contact.signature}
            </span>
          </div>
        </div>
      </section>

      {/* MEJORA 1: footer con role="contentinfo" */}
      <footer
        role="contentinfo"
        className="py-8 text-center text-sm border-t-2 border-black dark:border-white"
      >
        <p className="mb-2">© 2025 José Carlos Torres Rivera. Todos los derechos reservados.</p>
        <p className="text-xs opacity-70">
          Desarrollado con React, TypeScript, Tailwind CSS y Framer Motion
        </p>
      </footer>
    </>
  );
}
