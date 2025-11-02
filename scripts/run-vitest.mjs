#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

function findVitest() {
  const pnpmDir = join(process.cwd(), 'node_modules', '.pnpm');
  if (existsSync(pnpmDir)) {
    const entries = readdirSync(pnpmDir).filter((n) => n.startsWith('vitest@'));
    for (const entry of entries) {
      const cand = join(pnpmDir, entry, 'node_modules', 'vitest', 'vitest.mjs');
      if (existsSync(cand)) return cand;
    }
  }
  const fallback1 = join(process.cwd(), 'node_modules', 'vitest', 'vitest.mjs');
  if (existsSync(fallback1)) return fallback1;
  throw new Error('Could not locate vitest.mjs. Ensure devDependencies are installed.');
}

const vitestPath = findVitest();
const args = process.argv.slice(2);

const child = spawn(process.execPath, [vitestPath, ...args], {
  stdio: 'inherit',
  env: process.env,
});

child.on('exit', (code) => process.exit(code ?? 1));
