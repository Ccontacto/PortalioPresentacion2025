import { useEffect, useMemo, useState } from 'react';

import { useLanguage } from '../contexts/LanguageContext';
import { createZip } from '../utils/zip';

import type { PortfolioData } from '../types/portfolio';
import type { CSSProperties } from 'react';

const WATERMARK_TEXT = 'PortalioPresentacion2025 dev build';
const PLACEHOLDER = '<<edita solo el valor>>';

const buttonStyle: CSSProperties = {
  position: 'fixed',
  bottom: 16,
  right: 16,
  zIndex: 2000,
  padding: '0.35rem 0.8rem',
  fontSize: '0.85rem',
  borderRadius: 999,
  background: '#050505',
  color: '#fff',
  border: 'none',
  cursor: 'pointer'
};

const overlayStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0,0,0,0.45)',
  zIndex: 2100,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
};

const panelStyle: CSSProperties = {
  background: '#fff',
  color: '#0f0f0f',
  maxWidth: 720,
  width: '90vw',
  maxHeight: '80vh',
  borderRadius: 12,
  padding: 16,
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
  overflow: 'hidden'
};

const textareaStyle: CSSProperties = {
  width: '100%',
  flex: 1,
  minHeight: '240px',
  fontFamily: 'monospace',
  fontSize: '0.85rem',
  padding: 8,
  borderRadius: 6,
  border: '1px solid rgba(0,0,0,0.15)'
};

const footerStyle: CSSProperties = {
  display: 'flex',
  gap: 8,
  flexWrap: 'wrap'
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

export default function DevPortfolioEditor() {
  const { data, currentLang, overrides, updateOverrides } = useLanguage();
  const template = useMemo(() => createTemplate(data) ?? {}, [data]);
  const [open, setOpen] = useState(false);
  const [payload, setPayload] = useState(() =>
    JSON.stringify(overrides[currentLang] ?? template, null, 2)
  );
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    setPayload(JSON.stringify(overrides[currentLang] ?? template, null, 2));
  }, [currentLang, overrides, template]);

  const applyOverrides = () => {
    try {
      const parsed = payload ? JSON.parse(payload) : {};
      const sanitized = sanitizePatch(template, parsed);
      updateOverrides(currentLang, sanitized as Partial<PortfolioData>);
      setStatus('Overrides aplicados.');
    } catch {
      setStatus('JSON inválido. Corrige y vuelve a aplicar.');
    }
  };

  const resetOverrides = () => {
    updateOverrides(currentLang, {});
    setPayload(JSON.stringify(template, null, 2));
    setStatus('Overrides reseteados.');
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
      <button style={buttonStyle} type="button" onClick={() => setOpen(true)} data-dev-id="dev-portafolio">
        Editor Dev
      </button>
      {open ? (
        <div style={overlayStyle} role="dialog" aria-label="Editor del portafolio">
          <div style={panelStyle}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>Editor en vivo</h3>
              <button type="button" onClick={() => setOpen(false)} aria-label="Cerrar editor">
                ✕
              </button>
            </header>
            <p style={{ margin: 0, fontSize: '0.85rem' }}>
              Edita los valores del JSON sin renombrar llaves y luego haz clic en aplicar. Este módulo solo está habilitado
              en modo desarrollo.
            </p>
            <textarea
              style={textareaStyle}
              aria-label="Overrides JSON"
              value={payload}
              onChange={event => setPayload(event.target.value)}
            />
            <div style={footerStyle}>
              <button type="button" onClick={applyOverrides}>
                Aplicar Overrides
              </button>
              <button type="button" onClick={resetOverrides}>
                Limpiar Overrides
              </button>
              <button type="button" onClick={downloadZip}>
                Generar ZIP (dev)
              </button>
            </div>
            {status ? <p style={{ margin: 0, fontSize: '0.85rem' }}>{status}</p> : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
