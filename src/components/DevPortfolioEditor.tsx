import { useLanguage } from '@contexts/LanguageContext';
import { createZip } from '@utils/zip';
import { PenSquare } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import type { PortfolioData } from '@portfolio-types';

const WATERMARK_TEXT = 'PortalioPresentacion2025 dev build';
const PLACEHOLDER = '<<edita solo el valor>>';
const EMPTY_OVERRIDES: Record<PortfolioData['lang'], Partial<PortfolioData>> = {
  es: {},
  en: {}
};

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

type LanguageOverridesApi = {
  overrides: Record<PortfolioData['lang'], Partial<PortfolioData>>;
  updateOverrides: (lang: PortfolioData['lang'], patch: Partial<PortfolioData>) => void;
};

export default function DevPortfolioEditor() {
  const language = useLanguage() as ReturnType<typeof useLanguage> & Partial<LanguageOverridesApi>;
  const { data, currentLang } = language;
  const overridesMap = useMemo(
    () => language.overrides ?? EMPTY_OVERRIDES,
    [language.overrides]
  );
  const updateOverrides = language.updateOverrides;
  const supportsOverrides = typeof updateOverrides === 'function';
  const template = useMemo(() => createTemplate(data) ?? {}, [data]);
  const [open, setOpen] = useState(false);
  const [payload, setPayload] = useState(() =>
    JSON.stringify((supportsOverrides && overridesMap[currentLang]) ?? template, null, 2)
  );
  const [status, setStatus] = useState<string | null>(null);
  const [statusVariant, setStatusVariant] = useState<'success' | 'error' | null>(null);

  useEffect(() => {
    setPayload(JSON.stringify((supportsOverrides && overridesMap[currentLang]) ?? template, null, 2));
  }, [currentLang, overridesMap, supportsOverrides, template]);

  const applyOverrides = () => {
    if (!supportsOverrides || !updateOverrides) {
      setStatus('Overrides no soportados en este build.');
      setStatusVariant('error');
      return;
    }
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
    if (!supportsOverrides || !updateOverrides) {
      setStatus('Overrides no soportados en este build.');
      setStatusVariant('error');
      return;
    }
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
            <div className="dev-editor-panel__body">
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
                <p
                  className={`dev-editor-panel__status${
                    statusVariant ? ` dev-editor-panel__status--${statusVariant}` : ''
                  }`}
                >
                  {status}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
