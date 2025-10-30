import { describe, it, expect } from 'vitest';
import { generatePdf } from '../utils/pdfGenerator';
import { es } from '../data/es';

describe('pdfGenerator', () => {
  it('should run without errors', async () => {
    await expect(generatePdf(es, 'es')).resolves.not.toThrow();
  });
});
