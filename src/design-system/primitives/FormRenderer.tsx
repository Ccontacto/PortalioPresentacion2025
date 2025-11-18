import { useId, useState } from 'react';

import { portfolioSpec } from '../../content/portfolioSpec';
import { usePortfolioForm } from '../../contexts/PortfolioSpecContext';

import { Button } from './Button';

import type { ChangeEvent, FormEvent, InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import './styles.css';

type FieldValue = string;
type FormState = Record<string, FieldValue>;

type FormRendererProps = {
  formId: keyof typeof portfolioSpec.forms;
};

export function FormRenderer({ formId }: FormRendererProps) {
  const formSpec = usePortfolioForm(formId);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [values, setValues] = useState<FormState>(() =>
    formSpec.fields.reduce<FormState>((acc, field) => {
      acc[field.id] = '';
      return acc;
    }, {})
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const formIdAttr = useId();

  if (!formSpec) return null;

  const hasMinLength = (field: ContactField): field is ContactField & { minLength: number } =>
    Object.prototype.hasOwnProperty.call(field, 'minLength') && typeof (field as Record<string, unknown>).minLength === 'number';

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    formSpec.fields.forEach(field => {
      const value = values[field.id]?.trim() ?? '';
      if (field.required && !value) {
        nextErrors[field.id] = 'Este campo es requerido';
      }
      if (hasMinLength(field) && value.length < field.minLength) {
        nextErrors[field.id] = `Mínimo ${field.minLength} caracteres`;
      }
      if (field.type === 'email' && value) {
        const emailPattern = /\S+@\S+\.\S+/;
        if (!emailPattern.test(value)) {
          nextErrors[field.id] = 'Email inválido';
        }
      }
    });
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) {
      setStatus('error');
      return;
    }
    setStatus('success');
  };

  return (
    <form className="ds-form" aria-describedby={`${formIdAttr}-status`} onSubmit={handleSubmit}>
      {formSpec.fields.map(field => {
          const error = errors[field.id];
          const minLengthProps = hasMinLength(field) ? { minLength: field.minLength } : {};
          const sharedProps = {
            id: `${formIdAttr}-${field.id}`,
            name: field.id,
            value: values[field.id],
            onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
              setValues(prev => ({ ...prev, [field.id]: event.target.value })),
            'aria-invalid': Boolean(error),
            'aria-describedby': error ? `${formIdAttr}-${field.id}-error` : undefined,
          required: field.required,
          ...minLengthProps
        };
        return (
          <div className="ds-form__field" key={field.id}>
            <label className="ds-form__label" htmlFor={sharedProps.id}>
              {stripBraces(field.label)}
            </label>
            {renderControl(field, sharedProps)}
            {field.placeholder ? <p className="ds-form__helper">{stripBraces(field.placeholder)}</p> : null}
            {error ? (
              <span className="ds-form__error" id={`${formIdAttr}-${field.id}-error`} role="alert">
                {error}
              </span>
            ) : null}
          </div>
        );
      })}
      <div role="status" id={`${formIdAttr}-status`} aria-live="polite">
        {status === 'success' ? stripBraces(formSpec.submit.successMessage) : null}
        {status === 'error' ? stripBraces(formSpec.submit.errorMessage) : null}
      </div>
      <Button type="submit" variant="primary">
        {stripBraces(formSpec.submit.label)}
      </Button>
    </form>
  );
}

function stripBraces(value?: string) {
  if (!value) return '';
  return value.replace(/^\{|\}$/g, '').replace(/^[^:]+:\s*/, '');
}

type ContactField = (typeof portfolioSpec.forms)['contactForm']['fields'][number];

function renderControl(
  field: ContactField,
  props: InputHTMLAttributes<HTMLInputElement> & TextareaHTMLAttributes<HTMLTextAreaElement> & SelectHTMLAttributes<HTMLSelectElement>
) {
  const baseClass = field.type === 'textarea' ? 'ds-form__textarea' : field.type === 'select' ? 'ds-form__select' : 'ds-form__input';
  if (field.type === 'textarea') {
    return <textarea className={baseClass} rows={4} {...props} />;
  }
  if (field.type === 'select') {
    return (
      <select className={baseClass} {...props}>
        <option value="">Selecciona una opción</option>
        {field.options?.map(option => (
          <option key={option} value={stripBraces(option)}>
            {stripBraces(option)}
          </option>
        ))}
      </select>
    );
  }
  return <input className={baseClass} type={field.type === 'email' ? 'email' : 'text'} {...props} />;
}
