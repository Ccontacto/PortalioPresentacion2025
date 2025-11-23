import { ContactForm } from '@components/ContactForm/ContactForm';
import Icon from '@components/icons/VectorIcon';
import { WhatsappGlyph } from '@components/icons/WhatsappGlyph';
import { useLanguage } from '@contexts/LanguageContext';
import { usePortfolioContent } from '@contexts/PortfolioSpecContext';
import { useToast } from '@contexts/ToastContext';
import { Card } from '@design-system/primitives/Card';
import { SectionWrapper } from '@design-system/primitives/SectionWrapper';
import { useSectionTelemetry } from '@telemetry/useSectionTelemetry';
import { openSafeUrl } from '@utils/urlValidation';

import type { ReactNode } from 'react';

type ContactAction = {
  id: 'whatsapp' | 'email' | 'copy';
  icon: ReactNode;
  action: () => void;
  srLabel: string;
};

export default function Contact() {
  const { data } = useLanguage();
  const { showToast } = useToast();
  useSectionTelemetry('contact');
  const contactSpec = usePortfolioContent('contact');
  const invalidUrlMessage = data.toasts?.invalid_url ?? 'Enlace no disponible';

  const contactTitle = stripBraces(contactSpec?.title) || (data.lang === 'en' ? 'Contact' : 'Contacto');
  const contactSubtitle =
    stripBraces(contactSpec?.subtitle) ||
    (data.lang === 'en'
      ? 'Project, collaboration or just want to chat architecture? Write me.'
      : '¿Proyecto, colaboración o simplemente quieres platicar de arquitectura? Escríbeme.');

  const openEmail = () => {
    window.location.href = `mailto:${data.email}`;
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(data.email);
      showToast(data.toasts.email_copy_success, 'success');
    } catch {
      showToast(data.toasts.email_copy_error, 'error');
    }
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

  const contactActions: ContactAction[] = [
    {
      id: 'whatsapp',
      icon: <WhatsappGlyph className="h-5 w-5" />,
      action: openWhatsApp,
      srLabel: data.lang === 'en' ? `WhatsApp ${data.whatsapp}` : `WhatsApp ${data.whatsapp}`
    },
    {
      id: 'email',
      icon: <Icon name="mail" size={20} aria-hidden />,
      action: openEmail,
      srLabel: data.lang === 'en' ? `Email ${data.email}` : `Correo ${data.email}`
    },
    {
      id: 'copy',
      icon: <Icon name="copy" size={18} aria-hidden />,
      action: copyEmail,
      srLabel: data.lang === 'en' ? `Copy ${data.email}` : `Copiar ${data.email}`
    }
  ];

  return (
    <SectionWrapper id="contact" aria-labelledby="contact-heading">
      <div className="contact-mosaic">
        <Card className="contact-panel contact-panel--info" as="section">
          <div className="contact-panel__tab">{data.lang === 'en' ? 'Contact sheet' : 'Ficha de contacto'}</div>
          <header className="contact-panel__header">
            <span className="contact-panel__eyebrow">{data.lang === 'en' ? 'Let’s connect' : 'Conectemos'}</span>
            <h2 id="contact-heading" className="contact-panel__title">
              {contactTitle}
            </h2>
            <p className="contact-panel__subtitle">{contactSubtitle}</p>
          </header>
          <p className="contact-panel__lead">
            {data.lang === 'en'
              ? 'Pick a channel to start the conversation and I will get back within 24h.'
              : 'Elige un canal para iniciar la conversación y respondo en menos de 24h.'}
          </p>
          <div className="contact-quick-actions">
            {contactActions.map(action => (
              <button
                key={action.id}
                type="button"
                className={`contact-quick-action contact-quick-action--${action.id}`}
                onClick={action.action}
                aria-label={action.srLabel}
              >
                {action.icon}
              </button>
            ))}
          </div>
          <div className="contact-status-block">
            <span className="contact-status-pill">
              <Icon name="sparkles" size={16} aria-hidden />
              {data.badge}
            </span>
          </div>
        </Card>

        <Card className="contact-panel contact-panel--form" as="section">
          <div className="contact-panel__form-header">
            <h3>{data.lang === 'en' ? 'Let me know about your idea' : 'Cuéntame tu idea'}</h3>
            <p>{data.lang === 'en' ? 'Name, email and the context you want to explore.' : 'Nombre, email y el contexto que te gustaría explorar.'}</p>
          </div>
          <ContactForm />
        </Card>
      </div>
    </SectionWrapper>
  );
}

function stripBraces(value?: string) {
  if (!value) return '';
  return value.replace(/^\{|\}$/g, '').replace(/^[^:]+:\s*/, '');
}
