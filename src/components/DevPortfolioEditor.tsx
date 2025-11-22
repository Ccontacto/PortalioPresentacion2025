import Icon from '@components/icons/VectorIcon';
import { useLanguage } from '@contexts/LanguageContext';
import { createZip } from '@utils/zip';
import { useEffect, useState } from 'react';

import type { PortfolioData } from '@portfolio-types';

const WATERMARK_TEXT = 'PortalioPresentacion2025 dev build';

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
  const updateOverrides = language.updateOverrides;
  const supportsOverrides = typeof updateOverrides === 'function';
  const [open, setOpen] = useState(false);
  const [payload, setPayload] = useState(() => JSON.stringify(data, null, 2));
  const [status, setStatus] = useState<string | null>(null);
  const [statusVariant, setStatusVariant] = useState<'success' | 'error' | null>(null);

  useEffect(() => {
    setPayload(JSON.stringify(data, null, 2));
  }, [data]);

  const applyOverrides = () => {
    if (!supportsOverrides || !updateOverrides) {
      setStatus('Overrides no soportados en este build.');
      setStatusVariant('error');
      return;
    }
    try {
      const parsed = payload ? JSON.parse(payload) : {};
      const sanitized = sanitizePatch(data, parsed);
      updateOverrides(currentLang, sanitized as Partial<PortfolioData>);
      setStatus('Contenido actualizado.');
      setStatusVariant('success');
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Invalid JSON payload', error);
      }
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
    setPayload(JSON.stringify(data, null, 2));
    setStatus('Overrides reseteados.');
    setStatusVariant('success');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(payload);
      setStatus('JSON copiado al portapapeles.');
      setStatusVariant('success');
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Clipboard copy failed', error);
      }
      setStatus('No se pudo copiar. Intenta manualmente.');
      setStatusVariant('error');
    }
  };

  const downloadJson = () => {
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `portfolio-${currentLang}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
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
      <button type="button" className="dev-editor-trigger" onClick={() => setOpen(true)} data-dev-id="dev-portafolio">
        <Icon name="penSquare" size={16} aria-hidden />
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
                Edita todo el contenido del portfolio en JSON. Solo se habilita en modo desarrollo y no afecta producción.
              </p>
              <textarea
                className="dev-editor-panel__textarea"
                aria-label="JSON del portafolio"
                value={payload}
                onChange={event => setPayload(event.target.value)}
              />
              <div className="dev-editor-panel__footer">
                <button type="button" className="dev-editor-panel__button" onClick={applyOverrides}>
                  Aplicar JSON
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
                <button type="button" className="dev-editor-panel__button dev-editor-panel__button--ghost" onClick={handleCopy}>
                  Copiar JSON
                </button>
                <button type="button" className="dev-editor-panel__button dev-editor-panel__button--ghost" onClick={downloadJson}>
                  Descargar JSON
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
