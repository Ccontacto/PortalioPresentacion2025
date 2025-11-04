import { useCallback, useRef } from 'react';

import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';
import { generatePdf } from '../utils/pdfGenerator';

import type { PortfolioData } from '../types/portfolio';

type Lang = 'es' | 'en';

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
      const targetLang = payload?.lang ?? (targetData.lang as Lang | undefined) ?? 'es';

      showToast('Generando CV...', 'info');
      isGeneratingRef.current = true;

      try {
        await generatePdf(targetData, targetLang);
        showToast('CV listo para descargar', 'success');
      } catch (error) {
        handleError(error);
        throw error;
      } finally {
        isGeneratingRef.current = false;
      }
    },
    [data, handleError, showToast]
  );
}
