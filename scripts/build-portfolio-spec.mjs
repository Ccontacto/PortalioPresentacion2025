#!/usr/bin/env node
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const DEFAULT_SPEC = path.join(ROOT, 'specs', 'portfolio-spec.json');
const CONTENT_OUT = path.join(ROOT, 'src', 'content', 'portfolioSpec.ts');
const TOKENS_OUT = path.join(ROOT, 'src', 'design-system', 'tokens.ts');
const CSS_OUT = path.join(ROOT, 'public', 'spec-tokens.css');

const HEADER = `/* AUTO-GENERATED FILE — DO NOT EDIT MANUALLY.
   Run \`npm run spec:build\` after updating specs/portfolio-spec.json */`;

const requiredKeys = ['tokens', 'components', 'structure', 'contentPlaceholders', 'projectModel', 'forms'];

async function ensureDir(dirPath) {
  await mkdir(dirPath, { recursive: true });
}

function validateSpec(spec) {
  if (typeof spec !== 'object' || spec === null) {
    throw new Error('Spec root must be an object');
  }
  requiredKeys.forEach(key => {
    if (!(key in spec)) {
      throw new Error(`Spec is missing required key "${key}"`);
    }
  });
}

async function build(specPath = DEFAULT_SPEC) {
  const resolvedSpec = path.isAbsolute(specPath) ? specPath : path.resolve(process.cwd(), specPath);
  const raw = await readFile(resolvedSpec, 'utf8');
  const spec = JSON.parse(raw);
  validateSpec(spec);

  await ensureDir(path.dirname(CONTENT_OUT));
  const serialized = JSON.stringify(spec, null, 2);
  const contentModule = `${HEADER}

export const portfolioSpec = ${serialized} as const;
export type PortfolioSpec = typeof portfolioSpec;
`;
  await writeFile(CONTENT_OUT, contentModule, 'utf8');

  await ensureDir(path.dirname(TOKENS_OUT));
  const tokensModule = `${HEADER}

import type { PortfolioSpec } from '../content/portfolioSpec';
import { portfolioSpec } from '../content/portfolioSpec';

export const portfolioTokens = portfolioSpec.tokens;
export type PortfolioTokens = PortfolioSpec['tokens'];

export const portfolioComponents = portfolioSpec.components;
export type PortfolioComponents = PortfolioSpec['components'];
`;
  await writeFile(TOKENS_OUT, tokensModule, 'utf8');

  const css = generateCssFromSpec(spec);
  await ensureDir(path.dirname(CSS_OUT));
  await writeFile(CSS_OUT, css, 'utf8');

  console.log('Portfolio spec build complete.');
}

const inputPath = process.argv[2];
build(inputPath).catch(error => {
  console.error('[spec:build] Failed:', error);
  process.exitCode = 1;
});

function kebabCase(value) {
  return String(value)
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

function flattenTokens(obj, path = [], target = []) {
  Object.entries(obj).forEach(([key, value]) => {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      flattenTokens(value, [...path, key], target);
      return;
    }
    if (typeof value === 'string' || typeof value === 'number') {
      const varName = `--dt-${[...path, key].map(kebabCase).join('-')}`;
      target.push({ name: varName, value: resolveValue(value) });
    }
  });
  return target;
}

function flattenColorModeEntries(entries, path = [], target = []) {
  Object.entries(entries).forEach(([key, value]) => {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      flattenColorModeEntries(value, [...path, key], target);
      return;
    }
    if (typeof value === 'string' || typeof value === 'number') {
      target.push({ path: [...path, key], value: resolveValue(value) });
    }
  });
  return target;
}

function generateCssFromSpec(spec) {
  const tokens = spec.tokens ?? {};
  const baseMode = spec.meta?.baseMode ?? 'dark';
  const globalTokens = flattenTokens(tokens);

  const lines = [
    `${HEADER}`,
    '',
    ':root {'
  ];
  globalTokens.forEach(token => {
    lines.push(`  ${token.name}: ${token.value};`);
  });
  lines.push('}');
  lines.push('');

  // color modes
  const modes = tokens.color?.mode ?? {};
  Object.entries(modes).forEach(([modeName, modeValues]) => {
    const declarations = flattenColorModeEntries(modeValues);
    const selector = modeName === baseMode ? ':root' : `html[data-theme='${modeName}']`;
    lines.push(`${selector} {`);
    declarations.forEach(entry => {
      const varName = `--dt-color-${entry.path.map(kebabCase).join('-')}`;
      lines.push(`  ${varName}: ${entry.value};`);
    });
    lines.push('}');
    lines.push('');
  });

  // component tokens
  const componentEntries = flattenTokens(spec.components ?? {}, ['component']);
  if (componentEntries.length) {
    lines.push(':root {');
    componentEntries.forEach(token => {
      lines.push(`  ${token.name}: ${token.value};`);
    });
    lines.push('}');
    lines.push('');
  }

  return `${lines.join('\n')}\n`;
}

function resolveValue(value) {
  if (typeof value === 'number') {
    return value;
  }
  if (typeof value !== 'string') {
    return value;
  }
  const trimmed = value.trim();
  const tokenMatch = trimmed.match(/^\{(.+?)\}$/);
  if (tokenMatch) {
    const tokenPath = tokenMatch[1]
      .split('.')
      .map(part => part.trim())
      .filter(Boolean)
      .map(kebabCase)
      .join('-');
    return `var(--dt-${tokenPath})`;
  }
  return value;
}
