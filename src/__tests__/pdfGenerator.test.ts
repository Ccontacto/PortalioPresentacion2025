import { describe, it, expect } from 'vitest';
import { generateATSPdf } from '../utils/pdfGenerator.ats';
import { es } from '../data/es';

describe('pdfGenerator', () => {
  it('should run without errors', async () => {
    await expect(generateATSPdf(es, 'es')).resolves.not.toThrow();
  });
});
