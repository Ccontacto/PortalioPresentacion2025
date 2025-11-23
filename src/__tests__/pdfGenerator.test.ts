import { describe, it, expect } from 'vitest';

import { es } from '../data/es';
import { generateATSPdf } from '../utils/pdfGenerator.ats';

describe('pdfGenerator', () => {
  it('should run without errors', async () => {
    await expect(generateATSPdf(es, 'es')).resolves.not.toThrow();
  });
});
