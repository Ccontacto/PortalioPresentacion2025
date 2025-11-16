#!/usr/bin/env node
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const DEFAULT_SPEC = path.join(ROOT, 'specs', 'portfolio-spec.json');
const CONTENT_OUT = path.join(ROOT, 'src', 'content', 'portfolioSpec.ts');
const TOKENS_OUT = path.join(ROOT, 'src', 'design-system', 'tokens.ts');

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

  console.log('Portfolio spec build complete.');
}

const inputPath = process.argv[2];
build(inputPath).catch(error => {
  console.error('[spec:build] Failed:', error);
  process.exitCode = 1;
});
