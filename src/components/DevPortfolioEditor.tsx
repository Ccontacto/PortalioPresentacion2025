import { PenSquare } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { useLanguage } from '../contexts/LanguageContext';
import { createZip } from '../utils/zip';

import type { PortfolioData } from '../types/portfolio';

const WATERMARK_TEXT = 'PortalioPresentacion2025 dev build';
const PLACEHOLDER = '<<edita solo el valor>>';

function createTemplate(value: unknown): unknown {
  if (typeof value === 'string') {
    return PLACEHOLDER;
  }
  if (typeof value === 'number' || typeof value === 'boolean' || value === null) {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(item => createTemplate(item));
  }
  if (typeof value === 'object' && value !== null) {
    const result: Record<string, unknown> = {};
    Object.entries(value).forEach(([key, val]) => {
      result[key] = createTemplate(val);
    });
    return result;
  }
  return PLACEHOLDER;
}

function sanitizePatch(base: unknown, patch: unknown): unknown {
  if (!patch || typeof patch !== 'object') {
    return patch;
  }
  if (!base || typeof base !== 'object') {
    return patch;
  }
  const result: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(patch as Record<string, unknown>)) {
    if (key in (base as Record<string, unknown>)) {
      const baseValue = (base as Record<string, unknown>)[key];
      if (typeof val === 'object' && val !== null && typeof baseValue === 'object' && baseValue !== null) {
        result[key] = sanitizePatch(baseValue, val);
      } else if (typeof val !== 'object') {
        result[key] = val;
      }
    }
  }
  return result;
}

export default function DevPortfolioEditor() {
  const { data, currentLang, overrides, updateOverrides } = useLanguage();
  const template = useMemo(() => createTemplate(data) ?? {}, [data]);
  const [open, setOpen] = useState(false);
  const [payload, setPayload] = useState(() =>
    JSON.stringify(overrides[currentLang] ?? template, null, 2)
  );
  const [status, setStatus] = useState<string | null>(null);
  const [statusVariant, setStatusVariant] = useState<'success' | 'error' | null>(null);

  useEffect(() => {
    setPayload(JSON.stringify(overrides[currentLang] ?? template, null, 2));
  }, [currentLang, overrides, template]);

  const applyOverrides = () => {
    try {
      const parsed = payload ? JSON.parse(payload) : {};
      const sanitized = sanitizePatch(template, parsed);
      updateOverrides(currentLang, sanitized as Partial<PortfolioData>);
      setStatus('Overrides aplicados.');
      setStatusVariant('success');
    } catch {
      setStatus('JSON inválido. Corrige y vuelve a aplicar.');
      setStatusVariant('error');
    }
  };

  const resetOverrides = () => {
    updateOverrides(currentLang, {});
    setPayload(JSON.stringify(template, null, 2));
    setStatus('Overrides reseteados.');
    setStatusVariant('success');
  };

  const downloadZip = () => {
    const portfolioJson = JSON.stringify(data, null, 2);
    const files = [
      { name: 'portfolio.json', content: new TextEncoder().encode(portfolioJson) },
      { name: 'watermark.txt', content: new TextEncoder().encode(WATERMARK_TEXT) }
    ];
    const blob = createZip(files);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `portfolio-${currentLang}.zip`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!import.meta.env.DEV) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        className="dev-editor-trigger"
        onClick={() => setOpen(true)}
        data-dev-id="dev-portafolio"
      >
        <PenSquare size={16} aria-hidden="true" />
        <span>Editor</span>
      </button>
      {open ? (
        <div className="dev-editor-overlay" role="dialog" aria-label="Editor del portafolio" aria-modal="true">
          <div className="dev-editor-panel" data-dev-id="dev-editor-panel">
            <header className="dev-editor-panel__header">
              <h3>Editor en vivo</h3>
              <button
                type="button"
                className="dev-editor-panel__close"
                onClick={() => setOpen(false)}
                aria-label="Cerrar editor"
              >
                ✕
              </button>
            </header>
            <p className="dev-editor-panel__description">
              Edita solo los valores y respeta la estructura JSON. Este módulo solo está habilitado en modo desarrollo.
            </p>
            <textarea
              className="dev-editor-panel__textarea"
              placeholder='{"llave": "<<edita solo el valor>>"}'
              aria-label="Overrides JSON"
              value={payload}
              onChange={event => setPayload(event.target.value)}
            />
            <div className="dev-editor-panel__footer">
              <button type="button" className="dev-editor-panel__button" onClick={applyOverrides}>
                Aplicar Overrides
              </button>
              <button
                type="button"
                className="dev-editor-panel__button dev-editor-panel__button--ghost"
                onClick={resetOverrides}
              >
                Limpiar Overrides
              </button>
              <button
                type="button"
                className="dev-editor-panel__button dev-editor-panel__button--accent"
                onClick={downloadZip}
              >
                Generar ZIP (dev)
              </button>
            </div>
            {status ? (
              <p className={`dev-editor-panel__status${statusVariant ? ` dev-editor-panel__status--${statusVariant}` : ''}`}>
                {status}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
