export interface UrlValidationResult {
  isValid: boolean;
  sanitized: string | null;
  protocol: string | null;
  reason?: string;
}

const ALLOWED_PROTOCOLS = ['http:', 'https:'] as const;
const SUSPICIOUS_PATTERNS = [
  /javascript:/i,
  /vbscript:/i,
  /file:/i,
  /<script/i,
  /on\w+=/i
];

export function validateAndSanitizeUrl(input: string): UrlValidationResult {
  if (!input || typeof input !== 'string') {
    return {
      isValid: false,
      sanitized: null,
      protocol: null,
      reason: 'Empty or invalid input'
    };
  }

  const trimmed = input.trim();
  for (const pattern of SUSPICIOUS_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        isValid: false,
        sanitized: null,
        protocol: null,
        reason: `Suspicious pattern detected: ${pattern}`
      };
    }
  }

  const domainWithoutProtocol = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/i;
  let url: URL;

  try {
    if (/^https?:\/\//i.test(trimmed)) {
      url = new URL(trimmed);
    } else if (trimmed.startsWith('//')) {
      url = new URL(`https:${trimmed}`);
    } else if (domainWithoutProtocol.test(trimmed)) {
      url = new URL(`https://${trimmed}`);
    } else if (/^www\./i.test(trimmed)) {
      url = new URL(`https://${trimmed}`);
    } else {
      throw new Error('Invalid URL format');
    }
  } catch (error) {
    return {
      isValid: false,
      sanitized: null,
      protocol: null,
      reason: `Parse error: ${error instanceof Error ? error.message : 'unknown'}`
    };
  }

  if (!ALLOWED_PROTOCOLS.includes(url.protocol as typeof ALLOWED_PROTOCOLS[number])) {
    return {
      isValid: false,
      sanitized: null,
      protocol: url.protocol,
      reason: `Protocol not allowed: ${url.protocol}`
    };
  }

  if (!url.hostname) {
    return {
      isValid: false,
      sanitized: null,
      protocol: url.protocol,
      reason: 'Missing hostname'
    };
  }

  const isLocalhostOrLoopback = /^(localhost|127\.0\.0\.1|0\.0\.0\.0)$/i.test(url.hostname);
  if (import.meta.env.PROD && isLocalhostOrLoopback) {
    return {
      isValid: false,
      sanitized: null,
      protocol: url.protocol,
      reason: 'Localhost URLs are blocked in production'
    };
  }

  if (!import.meta.env.DEV && !url.hostname.includes('.')) {
    return {
      isValid: false,
      sanitized: null,
      protocol: url.protocol,
      reason: 'Hostname is missing a TLD'
    };
  }

  return {
    isValid: true,
    sanitized: url.href,
    protocol: url.protocol
  };
}

export function isSafeUrl(input: string): boolean {
  return validateAndSanitizeUrl(input).isValid;
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
