
import { ContactForm } from '@components/ContactForm/ContactForm';
import { WhatsappGlyph } from '@components/icons/WhatsappGlyph';
import { PrivacyPanel } from '@components/PrivacyPanel';
import { useLanguage } from '@contexts/LanguageContext';
import { usePortfolioContent } from '@contexts/PortfolioSpecContext';
import { useToast } from '@contexts/ToastContext';
import { Card } from '@design-system/primitives/Card';
import { SectionHeader } from '@design-system/primitives/SectionHeader';
import { SectionWrapper } from '@design-system/primitives/SectionWrapper';
import { useSectionTelemetry } from '@telemetry/useSectionTelemetry';
import { getSafeUrl, openSafeUrl } from '@utils/urlValidation';
import { Copy, Mail } from 'lucide-react';
import { useState } from 'react';

type FormStatus = 'idle' | 'sending' | 'success' | 'error';

export default function Contact() {
  const { data, t } = useLanguage();
  const { showToast } = useToast();
  const [status, setStatus] = useState<FormStatus>('idle');
  useSectionTelemetry('contact');
  const contactSpec = usePortfolioContent('contact');
  const linkedinUrl = data.social?.linkedin ?? '';
  const linkedinLabel = linkedinUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
  const safeLinkedinUrl = linkedinUrl ? getSafeUrl(linkedinUrl) : null;
  const invalidUrlMessage = data.toasts?.invalid_url ?? 'Enlace no disponible';
  const contactTitle = data.lang === 'en' ? 'Contact' : 'Contacto';
  const contactSubtitle =
    data.lang === 'en'
      ? 'Project, collaboration or just want to chat architecture? Write me.'
      : '¿Proyecto, colaboración o simplemente quieres platicar de arquitectura? Escríbeme.';

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
    const message = encodeURIComponent('Hola José Carlos! Vi tu portfolio y me gustaría conversar.');
    const whatsappUrl = `https://wa.me/${data.whatsapp}?text=${message}`;
    if (!openSafeUrl(whatsappUrl)) {
      showToast(invalidUrlMessage, 'error');
      setStatus('error');
      return;
    }
    showToast(data.toasts.whatsapp_open, 'info');
    setStatus('success');
  };

  const contactTitleHtml = contactTitle.replace(
    /(IA|AI)/gi,
    '<span class="contact-hero__accent">$1</span>'
  );

  const contactSubtitleHtml = contactSubtitle
    .replace(/IA/gi, '<span class="contact-hero__accent">IA</span>')
    .replace(/iOS/gi, '<span class="contact-hero__accent">iOS</span>');

  return (
    <>
      <SectionWrapper id="contact" aria-labelledby="contact-heading" data-dev-id="9000">
        <div className="contact-wrapper" data-dev-id="9001">
          <div className="contact-column">
            <header className="contact-hero" data-dev-id="9002">
              <span className="contact-hero__eyebrow">{data.lang === 'en' ? 'Let’s connect' : 'Conectemos'}</span>
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

            <div
              role="status"
              aria-live="polite"
              aria-atomic="true"
              className="sr-only"
            >
              {status === 'sending' && (data.lang === 'en' ? 'Sending message...' : 'Enviando mensaje...')}
              {status === 'success' && (data.lang === 'en' ? 'Message sent' : 'Mensaje enviado correctamente')}
              {status === 'error' && (data.lang === 'en' ? 'Error. Try again.' : 'Error al enviar. Intenta de nuevo.')}
            </div>

            <div className="contact-actions" data-dev-id="9003">
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
                <span className="contact-cta__label">{data.lang === 'en' ? 'Copy email' : 'Copiar correo'}</span>
              </button>
            </div>

            <section className="contact-info" data-dev-id="9004">
              <header className="contact-info__header" data-dev-id="9005">
                <h3 className="contact-info__title">{data.name}</h3>
                <p className="contact-info__tagline">{data.title}</p>
                <span className="contact-info__location">
                  {data.lang === 'en' ? 'Based in' : 'Basado en'} {data.location}
                </span>
              </header>

              <dl className="contact-info__list">
                <div className="contact-info__row contact-info__row--primary">
                  <dt>Email</dt>
                  <dd>
                    <a href={`mailto:${data.email}`}>{data.email}</a>
                  </dd>
                </div>

                {safeLinkedinUrl ? (
                  <div className="contact-info__row">
                    <dt>LinkedIn</dt>
                    <dd>
                      <a href={safeLinkedinUrl} target="_blank" rel="noopener noreferrer">
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
          <Card className="contact-form-card" as="div">
            <SectionHeader
              title={stripBraces(contactSpec?.title) || contactTitle}
              subtitle={stripBraces(contactSpec?.subtitle) || contactSubtitle}
            />
            <ContactForm />
          </Card>
          <PrivacyPanel />
        </div>
      </SectionWrapper>

      {/* MEJORA 1: footer con role="contentinfo" */}
      <footer role="contentinfo" className="py-8 text-center text-sm border-t-2 border-black dark:border-white">
        <p className="mb-2">{t('footer', 'rights')}</p>
        <p className="text-xs opacity-70">{t('footer', 'builtWith')}</p>
      </footer>
    </>
  );
}

function stripBraces(value?: string) {
  if (!value) return '';
  return value.replace(/^\{|\}$/g, '').replace(/^[^:]+:\s*/, '');
}
