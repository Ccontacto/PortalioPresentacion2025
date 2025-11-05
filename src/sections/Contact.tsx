import { Copy, Mail } from 'lucide-react';
import { useState } from 'react';

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

  const contactTitleHtml = data.sections.contact.title.replace(
    /IA/i,
    '<span class="contact-hero__accent">IA</span>'
  );

  const contactSubtitleHtml = data.sections.contact.subtitle
    .replace('IA', '<span class="contact-hero__accent">IA</span>')
    .replace('iOS', '<span class="contact-hero__accent">iOS</span>');

  return (
    <>
      <section id="contact" className="page-section" aria-labelledby="contact-heading">
        <div className="contact-wrapper">
          <header className="contact-hero">
            <span className="contact-hero__eyebrow">Conectemos</span>
            <h2
              id="contact-heading"
              className="contact-hero__title"
              dangerouslySetInnerHTML={{ __html: contactTitleHtml }}
            />
            <p
              className="contact-hero__subtitle"
              dangerouslySetInnerHTML={{ __html: contactSubtitleHtml }}
            />
          </header>

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

          <div className="contact-actions">
            <button
              type="button"
              onClick={openWhatsApp}
              className="contact-cta contact-cta--whatsapp"
            >
              <span className="contact-cta__icon" aria-hidden="true">
                <WhatsappGlyph className="h-8 w-8" />
              </span>
              <span className="contact-cta__label">WhatsApp</span>
            </button>
            <button
              type="button"
              onClick={openEmail}
              className="contact-cta contact-cta--email"
            >
              <span className="contact-cta__icon" aria-hidden="true">
                <Mail className="h-8 w-8" />
              </span>
              <span className="contact-cta__label">Email</span>
            </button>
            <button
              type="button"
              onClick={copyEmail}
              className="contact-cta contact-cta--copy"
            >
              <span className="contact-cta__icon" aria-hidden="true">
                <Copy className="h-8 w-8" />
              </span>
              <span className="contact-cta__label">Copiar correo</span>
            </button>
          </div>

          <section className="contact-info">
            <header className="contact-info__header">
              <h3 className="contact-info__title">{data.name}</h3>
              <p className="contact-info__tagline">Líder Técnico iOS · Arquitectura IA</p>
              <span className="contact-info__location">Basado en {data.location}</span>
            </header>

            <dl className="contact-info__list">
              <div className="contact-info__row">
                <dt>Email</dt>
                <dd>
                  <a href={`mailto:${data.email}`}>
                    {data.email}
                  </a>
                </dd>
              </div>

              {linkedinUrl ? (
                <div className="contact-info__row">
                  <dt>LinkedIn</dt>
                  <dd>
                    <a href={linkedinUrl} target="_blank" rel="noopener noreferrer">
                      {linkedinLabel}
                    </a>
                  </dd>
                </div>
              ) : null}
            </dl>

            <footer className="contact-info__footer">
              <p>{data.sections.contact.closing}</p>
              <span>{data.sections.contact.signature}</span>
            </footer>
          </section>
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
