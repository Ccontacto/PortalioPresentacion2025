import { useEffect, useState } from 'react';

import { useLanguage } from '../contexts/LanguageContext';
import { createZip } from '../utils/zip';

import type { CSSProperties } from 'react';

const WATERMARK_TEXT = 'PortalioPresentacion2025 dev build';

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

export default function DevPortfolioEditor() {
  const { data, currentLang, overrides, updateOverrides } = useLanguage();
  const [open, setOpen] = useState(false);
  const [payload, setPayload] = useState(() => JSON.stringify(overrides[currentLang] ?? {}, null, 2));
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    setPayload(JSON.stringify(overrides[currentLang] ?? {}, null, 2));
  }, [currentLang, overrides]);

  const applyOverrides = () => {
    try {
      const parsed = payload ? JSON.parse(payload) : {};
      updateOverrides(currentLang, parsed);
      setStatus('Overrides aplicados.');
    } catch {
      setStatus('JSON inválido. Corrige y vuelve a aplicar.');
    }
  };

  const resetOverrides = () => {
    updateOverrides(currentLang, {});
    setPayload('{}');
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
              Edita el JSON de overrides para el idioma actual y haz clic en aplicar. Genera el ZIP para descargar tu
              propia versión con marca de agua.
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
