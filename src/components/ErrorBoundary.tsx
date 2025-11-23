import React from 'react';

import { logAppError } from '../telemetry';

import { SparkStars } from './SparkStars';

type Props = { children: React.ReactNode };
type State = { hasError: boolean; err: Error | null };

const ERROR_MESSAGES = {
  en: {
    heading: 'Something went wrong',
    body: 'A problem occurred. Reload the page.',
    button: 'Reload'
  },
  es: {
    heading: 'Error',
    body: 'Ocurrió un problema. Recarga la página.',
    button: 'Recargar'
  }
};

const getLocaleMessages = () => {
  const language =
    typeof navigator !== 'undefined' ? navigator.language.toLowerCase() : 'es';
  const locale = language.startsWith('en') ? 'en' : 'es';
  return ERROR_MESSAGES[locale];
};

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, err: null };
  }

  static getDerivedStateFromError(err: unknown) {
    return { hasError: true, err: err instanceof Error ? err : new Error(String(err)) };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    logAppError(error, errorInfo);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    const { heading, body, button } = getLocaleMessages();
    const stack = this.state.err?.stack ?? this.state.err?.message ?? 'Error desconocido';

    return (
      <div className="landing-shell spark-landing spark-error" role="alert" aria-live="assertive" aria-atomic="true">
        <SparkStars variant="classic" starCount={120} message="Translating human to computer." />
        <div className="landing-card landing-card--glass spark-error-card">
          <div className="landing-card__badge landing-card__badge--ghost">{heading}</div>
          <h2 className="landing-card__title landing-card__title--white">{heading}</h2>
          <p className="landing-card__description">{body}</p>
          <pre className="spark-error-card__stack" aria-label="Stack trace">
            {stack}
          </pre>
          <div className="landing-card__actions">
            <button className="landing-card__cta" onClick={() => window.location.reload()} aria-label={button}>
              {button}
            </button>
          </div>
        </div>
      </div>
    );
  }
}
