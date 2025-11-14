import { useCallback, useRef } from 'react';

import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';
import { generatePdf } from '../utils/pdfGenerator';
import { isValidLang, type Lang } from '../utils/typeGuards';

import type { PortfolioData } from '../types/portfolio';

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

      const requestedLang = payload?.lang;
      const fallbackLang = isValidLang(targetData.lang) ? targetData.lang : 'es';
      const targetLang = isValidLang(requestedLang) ? requestedLang : fallbackLang;

      if (requestedLang && !isValidLang(requestedLang) && import.meta.env.DEV) {
        console.warn('Descarga de CV recibió un idioma no soportado:', requestedLang);
      }

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
