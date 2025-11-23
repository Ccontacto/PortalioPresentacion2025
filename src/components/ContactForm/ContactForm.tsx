import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '../atoms/Button';
import './ContactForm.css';

const contactSchema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres').max(80, 'Máximo 80 caracteres'),
  email: z.string().email('Email inválido'),
  message: z.string().min(10, 'Mínimo 10 caracteres').max(500, 'Máximo 500 caracteres')
});

type ContactFormValues = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [serverStatus, setServerStatus] = useState<'idle' | 'success' | 'error'>('idle');
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
    try {
      await new Promise(resolve => setTimeout(resolve, 900));
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });
      reset();
      setServerStatus('success');
    } catch {
      setServerStatus('error');
    }
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="input-wrapper">
        <input
          id="contact-name"
          className="form-input"
          placeholder=" "
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? 'contact-name-error' : undefined}
          {...register('name')}
        />
        <label htmlFor="contact-name" className="input-label">
          Nombre
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
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'contact-email-error' : undefined}
          {...register('email')}
        />
        <label htmlFor="contact-email" className="input-label">
          Email
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
          Mensaje
        </label>
        {errors.message ? (
          <p className="input-error" id="contact-message-error">
            {errors.message.message}
          </p>
        ) : null}
      </div>

      <div className="form-actions">
        <Button type="submit" disabled={!isValid || isSubmitting} variant="ghost">
          {isSubmitting ? 'Enviando…' : 'Enviar mensaje'}
        </Button>
        {serverStatus === 'success' ? (
          <p className="form-status form-status--success">¡Gracias! Responderé pronto.</p>
        ) : null}
        {serverStatus === 'error' ? (
          <p className="form-status form-status--error">Ocurrió un error. Intenta más tarde.</p>
        ) : null}
      </div>
    </form>
  );
}
