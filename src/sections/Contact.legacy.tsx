
import { ContactForm } from '@components/ContactForm/ContactForm';
import Icon from '@components/icons/VectorIcon';
import { WhatsappGlyph } from '@components/icons/WhatsappGlyph';
import { PrivacyPanel } from '@components/PrivacyPanel';
import { useLanguage } from '@contexts/LanguageContext';
import { usePortfolioContent } from '@contexts/PortfolioSpecContext';
import { useToast } from '@contexts/ToastContext';
import { Card } from '@design-system/primitives/Card';
import { SectionHeader } from '@design-system/primitives/SectionHeader';
import { SectionWrapper } from '@design-system/primitives/SectionWrapper';
import { useSectionTelemetry } from '@telemetry/useSectionTelemetry';
import { openSafeUrl } from '@utils/urlValidation';
import { useCallback } from 'react';

export default function Contact() {
  const { data } = useLanguage();
  const { showToast } = useToast();
  useSectionTelemetry('contact');
  const contactSpec = usePortfolioContent('contact');
  const contactTitle = data.lang === 'en' ? 'Contact' : 'Contacto';
  const contactSubtitle =
    data.lang === 'en'
      ? 'Project, collaboration or just want to chat architecture? Write me.'
      : '¿Proyecto, colaboración o simplemente quieres platicar de arquitectura? Escríbeme.';
  const invalidUrlMessage = data.toasts?.invalid_url ?? 'Enlace no disponible';

  const contactTitleHtml = contactTitle.replace(
    /(IA|AI)/gi,
    '<span class="contact-hero__accent">$1</span>'
  );

  const contactSubtitleHtml = contactSubtitle
    .replace(/IA/gi, '<span class="contact-hero__accent">IA</span>')
    .replace(/iOS/gi, '<span class="contact-hero__accent">iOS</span>');

  const infoPanelCopy =
    data.lang === 'en'
      ? {
          eyebrow: 'How we collaborate',
          title: '30-minute tactical kickoff',
          description: 'We align context, metrics and clear next steps so the roadmap is ready to execute from call one.'
        }
      : {
          eyebrow: 'Cómo colaboramos',
          title: 'Kickoff táctico en 30 minutos',
          description: 'Alineamos contexto, métricas y siguientes pasos listos para ejecutar desde la primera sesión.'
        };

  const scrollToForm = useCallback(() => {
    const target = document.getElementById('contact-form-panel');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const openEmail = () => {
    window.location.href = `mailto:${data.email}`;
  };

  const openWhatsApp = () => {
    const message = encodeURIComponent('Hola José Carlos! Vi tu portfolio y me gustaría conversar.');
    const whatsappUrl = `https://wa.me/${data.whatsapp}?text=${message}`;
    if (!openSafeUrl(whatsappUrl)) {
      showToast(invalidUrlMessage, 'error');
      return;
    }
    showToast(data.toasts.whatsapp_open, 'info');
  };

  const copyEmail = async () => {
    if (!navigator.clipboard) {
      showToast(data.toasts.email_copy_error, 'error');
      return;
    }
    try {
      await navigator.clipboard.writeText(data.email);
      showToast(data.toasts.email_copy_success, 'success');
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Clipboard copy failed', error);
      }
      showToast(data.toasts.email_copy_error, 'error');
    }
  };

  const contactMethods = [
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      value: data.whatsapp,
      icon: <WhatsappGlyph className="h-6 w-6" />,
      action: openWhatsApp,
      actionLabel: data.lang === 'en' ? 'Open WhatsApp' : 'Abrir WhatsApp'
    },
    {
      id: 'email',
      label: data.lang === 'en' ? 'Email' : 'Correo',
      value: data.email,
      icon: <Icon name="mail" size={22} aria-hidden />,
      action: openEmail,
      actionLabel: data.lang === 'en' ? 'Open Email' : 'Abrir correo'
    },
    {
      id: 'copy',
      label: data.lang === 'en' ? 'Copy' : 'Copiar',
      value: data.email,
      icon: <Icon name="copy" size={20} aria-hidden />,
      action: copyEmail,
      actionLabel: data.lang === 'en' ? 'Copy email' : 'Copiar correo'
    }
  ];

  return (
    <>
      <SectionWrapper id="contact" aria-labelledby="contact-heading" data-dev-id="9000">
        <div className="contact-wrapper" data-dev-id="9001">
          <div className="contact-panel">
            <section className="contact-hero-card" data-dev-id="9002">
              <header className="contact-hero">
                <div className="contact-hero__badge-group">
                  <span className="contact-hero__eyebrow">{data.lang === 'en' ? 'Let’s connect' : 'Conectemos'}</span>
                  <span className="contact-status-pill">
                    <Icon name="sparkles" size={16} aria-hidden />
                    {data.badge}
                  </span>
                </div>
                <div className="contact-hero__headline">
                  <h2
                    id="contact-heading"
                    className="contact-hero__title"
                    dangerouslySetInnerHTML={{ __html: contactTitleHtml }}
                  />
                  <p
                    className="contact-hero__subtitle"
                    dangerouslySetInnerHTML={{ __html: contactSubtitleHtml }}
                  />
                </div>
                <p className="contact-hero__support">
                  <span className="contact-hero__support-eyebrow">{infoPanelCopy.title}</span>
                  {infoPanelCopy.description}
                </p>
              </header>

              <div className="contact-hero__chant" aria-hidden="true">
                <span>Contacto</span>
                <span>Contacto</span>
                <span>Contacto</span>
              </div>
              <p className="contact-hero__chant-caption">
                {stripBraces(contactSpec?.subtitle) || contactSubtitle}
              </p>

              <div className="contact-folder">
                <div className="contact-folder__tab">
                  <span>{data.lang === 'en' ? 'Contact sheet' : 'Ficha de contacto'}</span>
                </div>
                <div className="contact-folder__body">
                  <p className="contact-folder__lead">
                    {data.lang === 'en'
                      ? 'Pick a channel to start the conversation and I will get back within 24h.'
                      : 'Elige un canal para iniciar la conversación y respondo en menos de 24h.'}
                  </p>
                  <ul className="contact-folder__methods">
                    {contactMethods.map(method => (
                      <li key={method.id} className="contact-method">
                        <span className="contact-method__icon" aria-hidden="true">
                          {method.icon}
                        </span>
                        <div className="contact-method__copy">
                          <span className="contact-method__label">{method.label}</span>
                          <span className="contact-method__value">{method.value}</span>
                        </div>
                        <button type="button" className="contact-method__action" onClick={method.action}>
                          {method.actionLabel}
                          <Icon name="arrowRight" size={16} aria-hidden />
                        </button>
                      </li>
                    ))}
                  </ul>
                  <button type="button" className="contact-folder__submit" onClick={scrollToForm}>
                    {data.lang === 'en' ? 'Go to form' : 'Ir al formulario'}
                  </button>
                </div>
              </div>
            </section>
          </div>

          <div className="contact-form-panel">
            <Card className="contact-form-card" as="div" id="contact-form-panel">
              <SectionHeader
                title={stripBraces(contactSpec?.title) || contactTitle}
                subtitle={stripBraces(contactSpec?.subtitle) || contactSubtitle}
              />
              <ContactForm />
            </Card>
            <PrivacyPanel />
          </div>
        </div>
      </SectionWrapper>

    </>
  );
}

function stripBraces(value?: string) {
  if (!value) return '';
  return value.replace(/^\{|\}$/g, '').replace(/^[^:]+:\s*/, '');
}
