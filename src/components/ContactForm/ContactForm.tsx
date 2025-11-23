import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useLanguage } from '@contexts/LanguageContext';
import { useTelemetry } from '@contexts/TelemetryContext';
import { useToast } from '@contexts/ToastContext';
import { Button } from '@design-system/primitives/Button';

import type { ContactFormCopy } from '../../types/portfolio';

import './ContactForm.css';

type ContactFormValues = {
  name: string;
  email: string;
  message: string;
};

type ContactFormProps = {
  copy?: ContactFormCopy;
  endpoint?: string;
};

export function ContactForm({ copy, endpoint }: ContactFormProps) {
  const [serverStatus, setServerStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const { data } = useLanguage();
  const { trackEvent } = useTelemetry();
  const { showToast } = useToast();

  const resolvedCopy = copy ?? data.contactForm;
  const submitEndpoint = endpoint ?? import.meta.env.VITE_CONTACT_ENDPOINT ?? '/api/contact';

  const contactSchema = useMemo(
    () =>
      z.object({
        name: z
          .string()
          .min(2, resolvedCopy.errors.nameTooShort)
          .max(80, resolvedCopy.errors.nameTooLong),
        email: z.string().email(resolvedCopy.errors.emailInvalid),
        message: z
          .string()
          .min(10, resolvedCopy.errors.messageTooShort)
          .max(500, resolvedCopy.errors.messageTooLong)
      }),
    [resolvedCopy.errors.emailInvalid, resolvedCopy.errors.messageTooLong, resolvedCopy.errors.messageTooShort, resolvedCopy.errors.nameTooLong, resolvedCopy.errors.nameTooShort]
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    mode: 'onChange'
  });

  const onSubmit = async (values: ContactFormValues) => {
    setServerStatus('idle');
    setStatusMessage(null);
    trackEvent('contact_submit_attempt', { lang: data.lang, hasMessage: Boolean(values.message) });

    try {
      await new Promise(resolve => setTimeout(resolve, 450));
      const response = await fetch(submitEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, lang: data.lang })
      });
      if (!response.ok) throw new Error(`Request failed with ${response.status}`);
      reset();
      setServerStatus('success');
      setStatusMessage(resolvedCopy.success);
      showToast(resolvedCopy.success, 'success');
      trackEvent('contact_submit_success', {
        lang: data.lang,
        messageLength: values.message?.length ?? 0
      });
    } catch (error) {
      console.error('[ContactForm] submit failed', error);
      setServerStatus('error');
      setStatusMessage(resolvedCopy.error);
      showToast(resolvedCopy.error, 'error');
      trackEvent('contact_submit_error', { lang: data.lang });
    }
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit(onSubmit)} noValidate aria-live="polite" aria-busy={isSubmitting}>
      <div className="input-wrapper">
        <input
          id="contact-name"
          className="form-input"
          placeholder=" "
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? 'contact-name-error' : undefined}
          autoComplete="name"
          {...register('name')}
        />
        <label htmlFor="contact-name" className="input-label">
          {resolvedCopy.nameLabel}
        </label>
        {errors.name ? (
          <p className="input-error" id="contact-name-error">
            {errors.name.message}
          </p>
        ) : null}
      </div>

      <div className="input-wrapper">
        <input
          id="contact-email"
          className="form-input"
          placeholder=" "
          type="email"
          inputMode="email"
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'contact-email-error' : undefined}
          {...register('email')}
        />
        <label htmlFor="contact-email" className="input-label">
          {resolvedCopy.emailLabel}
        </label>
        {errors.email ? (
          <p className="input-error" id="contact-email-error">
            {errors.email.message}
          </p>
        ) : null}
      </div>

      <div className="input-wrapper">
        <textarea
          id="contact-message"
          className="form-input form-input--textarea"
          placeholder=" "
          rows={4}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? 'contact-message-error' : undefined}
          {...register('message')}
        />
        <label htmlFor="contact-message" className="input-label">
          {resolvedCopy.messageLabel}
        </label>
        {errors.message ? (
          <p className="input-error" id="contact-message-error">
            {errors.message.message}
          </p>
        ) : null}
      </div>

      <div className="form-actions">
        <Button type="submit" disabled={!isValid || isSubmitting} variant="primary">
          {isSubmitting ? resolvedCopy.submittingLabel : resolvedCopy.submitLabel}
        </Button>
        {resolvedCopy.legalHint ? <p className="form-hint">{resolvedCopy.legalHint}</p> : null}
        {statusMessage ? (
          <p
            className={`form-status ${serverStatus === 'success' ? 'form-status--success' : 'form-status--error'}`}
            role="status"
          >
            {statusMessage}
          </p>
        ) : null}
      </div>
    </form>
  );
}
