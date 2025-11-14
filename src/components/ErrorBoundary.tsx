import React from 'react';

import { logAppError } from '../utils/telemetry';

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

    return (
      <div className="page-section" role="alert" aria-live="assertive" aria-atomic="true">
        <div className="card max-w-xl">
          <h2 className="text-2xl font-bold mb-2">{heading}</h2>
          <p className="mb-4">{body}</p>
          <pre className="text-xs overflow-auto p-4 bg-gray-100 dark:bg-gray-800 rounded">
            {this.state.err?.stack ?? this.state.err?.message ?? 'Error desconocido'}
          </pre>
          <button className="mt-4 icon-btn" onClick={() => window.location.reload()} aria-label={button}>
            {button}
          </button>
        </div>
      </div>
    );
  }
}
