import { useCallback, useRef } from 'react';

import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';
import { generatePdf } from '../utils/pdfGenerator';

import type { PortfolioData } from '../types/portfolio';

const VALID_LANGS = ['es', 'en'] as const;
type Lang = (typeof VALID_LANGS)[number];

const isValidLang = (value: unknown): value is Lang => {
  return typeof value === 'string' && VALID_LANGS.includes(value as Lang);
};

export function useCvDownload() {
  const { showToast } = useToast();
  const { data } = useLanguage();
  const isGeneratingRef = useRef(false);

  const handleError = useCallback(
    (error: unknown) => {
      if (import.meta.env.DEV) {
        console.error('CV generation failed', error);
      }
      showToast('No se pudo generar el CV. Inténtalo de nuevo.', 'error');
    },
    [showToast]
  );

  return useCallback(
    async (payload?: { data?: PortfolioData; lang?: Lang }) => {
      if (isGeneratingRef.current) {
        showToast('Tu CV se está generando. Espera un momento…', 'info');
        return;
      }

      const targetData = payload?.data ?? data;
      if (!targetData) {
        showToast('No hay datos disponibles para generar el CV.', 'error');
        return;
      }

      const rawLang = payload?.lang ?? targetData.lang;
      const targetLang = isValidLang(rawLang) ? rawLang : 'es';

      showToast('Generando CV...', 'info');
      isGeneratingRef.current = true;

      try {
        await generatePdf(targetData, targetLang);
        showToast('CV listo para descargar', 'success');
      } catch (error) {
        handleError(error);
      } finally {
        isGeneratingRef.current = false;
      }
    },
    [data, handleError, showToast]
  );
}
