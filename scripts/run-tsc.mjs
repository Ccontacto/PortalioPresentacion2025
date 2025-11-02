#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

function findTsc() {
  const pnpmDir = join(process.cwd(), 'node_modules', '.pnpm');
  if (existsSync(pnpmDir)) {
    const entries = readdirSync(pnpmDir).filter((n) => n.startsWith('typescript@'));
    for (const entry of entries) {
      const cand = join(pnpmDir, entry, 'node_modules', 'typescript', 'bin', 'tsc');
      if (existsSync(cand)) return cand;
      const candJs = join(pnpmDir, entry, 'node_modules', 'typescript', 'lib', 'tsc.js');
      if (existsSync(candJs)) return candJs;
    }
  }
  const fallback = join(process.cwd(), 'node_modules', 'typescript', 'bin', 'tsc');
  if (existsSync(fallback)) return fallback;
  throw new Error('Could not locate TypeScript (tsc). Ensure devDependencies are installed.');
}

const tscPath = findTsc();
const args = process.argv.slice(2);

const child = spawn(process.execPath, [tscPath, ...args], {
  stdio: 'inherit',
  env: process.env,
});

child.on('exit', (code) => process.exit(code ?? 1));

