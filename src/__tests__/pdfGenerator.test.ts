import { describe, it, expect } from 'vitest';

import { es } from '../data/es';
import { generatePdf } from '../utils/pdfGenerator';

describe('pdfGenerator', () => {
  it('should run without errors', async () => {
    await expect(generatePdf(es, 'es')).resolves.not.toThrow();
  });
});
