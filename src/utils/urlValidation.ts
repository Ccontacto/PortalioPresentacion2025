function validateAndSanitizeUrl(input: string): {
  isValid: boolean;
  sanitized: string | null;
  reason?: string;
} {
  if (!input || typeof input !== 'string') {
    return { isValid: false, sanitized: null, reason: 'Empty or invalid input' };
  }

  const trimmed = input.trim();
  if (/javascript:|vbscript:|file:|<script|on\w+=/i.test(trimmed)) {
    return { isValid: false, sanitized: null, reason: 'Suspicious pattern detected' };
  }

  try {
    const url = new URL(trimmed.startsWith('//') ? `https:${trimmed}` : trimmed);
    if (!['http:', 'https:'].includes(url.protocol)) {
      return { isValid: false, sanitized: null, reason: `Protocol not allowed: ${url.protocol}` };
    }
    return { isValid: true, sanitized: url.href };
  } catch (error) {
    return { isValid: false, sanitized: null, reason: 'URL parsing failed' };
  }
}

export function getSafeUrl(input: string): string | null {
  const result = validateAndSanitizeUrl(input);
  return result.isValid ? result.sanitized : null;
}

export function openSafeUrl(input: string, target = '_blank'): boolean {
  const result = validateAndSanitizeUrl(input);
  if (!result.isValid || !result.sanitized) {
    console.error('Blocked unsafe URL:', input, result.reason);
    return false;
  }
  if (typeof window === 'undefined') {
    return false;
  }
  window.open(result.sanitized, target, 'noopener,noreferrer');
  return true;
}
