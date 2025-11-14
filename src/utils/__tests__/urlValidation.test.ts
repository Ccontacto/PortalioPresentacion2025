import { describe, expect, it } from 'vitest';

import { getSafeUrl, isSafeUrl, validateAndSanitizeUrl } from '../urlValidation';

describe('URL validation utilities', () => {
  describe('valid URLs', () => {
    it('accepts a standard HTTPS URL', () => {
      const result = validateAndSanitizeUrl('https://example.com');
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBe('https://example.com/');
    });

    it('accepts HTTP URLs', () => {
      expect(isSafeUrl('http://example.com')).toBe(true);
    });

    it('resolves subdomains, paths, and ports', () => {
      expect(isSafeUrl('https://api.example.com/path')).toBe(true);
      expect(isSafeUrl('https://example.com:8080')).toBe(true);
    });
  });

  describe('auto repair', () => {
    it('normalizes plain domains', () => {
      const result = validateAndSanitizeUrl('example.com');
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBe('https://example.com/');
    });

    it('handles www-prefixed domains without protocol', () => {
      const result = validateAndSanitizeUrl('www.example.com');
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBe('https://www.example.com/');
    });

    it('fills in protocol for protocol-relative URLs', () => {
      const result = validateAndSanitizeUrl('//example.com');
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBe('https://example.com/');
    });
  });

  describe('malicious URLs', () => {
    it('rejects javascript: schemes', () => {
      expect(isSafeUrl('javascript:alert(1)')).toBe(false);
    });

    it('rejects inline HTML payloads', () => {
      expect(isSafeUrl('text/html,<script>alert(1)</script>')).toBe(false);
    });

    it('rejects vbscript', () => {
      expect(isSafeUrl('vbscript:msgbox(1)')).toBe(false);
    });

    it('rejects file protocol references', () => {
      expect(isSafeUrl('file:///etc/passwd')).toBe(false);
    });

    it('rejects inline event handlers', () => {
      expect(isSafeUrl('https://example.com" onclick="alert(1)')).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('returns null for invalid URLs', () => {
      expect(getSafeUrl('not a url')).toBeNull();
    });

    it('blocks localhost in production builds', () => {
      const result = validateAndSanitizeUrl('https://localhost');
      if (import.meta.env.PROD) {
        expect(result.isValid).toBe(false);
      } else {
        expect(result.isValid).toBe(true);
      }
    });

    it('rejects empty strings', () => {
      expect(isSafeUrl('')).toBe(false);
    });
  });
});
