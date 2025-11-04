import { useCallback } from 'react';

import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';
import { generatePdf } from '../utils/pdfGenerator';

import type { PortfolioData } from '../types/portfolio';

type Lang = 'es' | 'en';

export function useCvDownload() {
  const { showToast } = useToast();
  const { data } = useLanguage();

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
      const targetData = payload?.data ?? data;
      const targetLang = payload?.lang ?? (targetData.lang as Lang | undefined) ?? 'es';

      showToast('Generando CV...', 'info');

      try {
        await generatePdf(targetData, targetLang);
        showToast('CV listo para descargar', 'success');
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    [data, handleError, showToast]
  );
}
