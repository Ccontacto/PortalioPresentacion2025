const TOKEN_PATTERN = /^\{(.+)\}$/;

const toCssVar = (path: string) => {
  const tokens = path
    .split('.')
    .map(part => part.trim())
    .filter(Boolean)
    .map(part => part.replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase());
  return `var(--dt-${tokens.join('-')})`;
};

export function resolveSpecValue(value?: string | number | null) {
  if (value === undefined || value === null) {
    return undefined;
  }
  if (typeof value === 'number') {
    return value;
  }
  const trimmed = value.trim();
  const match = trimmed.match(TOKEN_PATTERN);
  if (match) {
    return toCssVar(match[1]);
  }
  return value;
}
