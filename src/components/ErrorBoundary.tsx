import React from 'react';

type Props = { children: React.ReactNode };
type State = { hasError: boolean; err: Error | null };

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, err: null };
  }

  static getDerivedStateFromError(err: unknown) {
    return { hasError: true, err: err instanceof Error ? err : new Error(String(err)) };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught:', error, errorInfo);
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div
        className="page-section"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div className="card max-w-xl">
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p className="mb-4">Ocurrió un problema. Recarga la página.</p>
          <pre className="text-xs overflow-auto p-4 bg-gray-100 dark:bg-gray-800 rounded">
            {this.state.err?.stack ?? this.state.err?.message ?? 'Error desconocido'}
          </pre>
          <button
            className="mt-4 icon-btn"
            onClick={() => window.location.reload()}
            aria-label="Recargar página"
          >
            Recargar
          </button>
        </div>
      </div>
    );
  }
}
