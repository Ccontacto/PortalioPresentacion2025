#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';

const TIMEOUT_MS = 20_000; // salir en 20 segundos si se atasca
const GRACE_MS = 10_000;   // esperar 10 segundos y luego monitorear

function runStep(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: 'inherit', env: process.env, ...opts });
    const t = setTimeout(() => {
      console.error(`\n[ci-check] Paso atascado > ${cmd} ${args.join(' ')} (>${TIMEOUT_MS}ms). Matando proceso...`);
      child.kill('SIGKILL');
      reject(new Error('timeout'));
    }, TIMEOUT_MS);

    child.on('exit', (code) => {
      clearTimeout(t);
      if (code === 0) resolve(undefined);
      else reject(new Error(`${cmd} exited with code ${code}`));
    });
  });
}

async function main() {
  try {
    console.log('[ci-check] Ejecutando tests...');
    const vitestRunner = ['scripts/run-vitest.mjs', 'run', '--reporter=dot'];
    const testPromise = runStep(process.execPath, vitestRunner);
    await delay(GRACE_MS);
    console.log('[ci-check] Monitoreando tests...');
    await testPromise;
    console.log('[ci-check] ✔ Tests OK');

    console.log('[ci-check] Compilando TypeScript...');
    // Usar tsc desde TypeScript instalado por pnpm
    const tscPath = 'node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/bin/tsc';
    const tscArgs = [tscPath, '-p', 'tsconfig.json'];
    const tscPromise = runStep(process.execPath, tscArgs);
    await delay(GRACE_MS);
    console.log('[ci-check] Monitoreando tsc...');
    await tscPromise;
    console.log('[ci-check] ✔ TypeScript OK');

    console.log('[ci-check] Ejecutando build de Vite...');
    const vitePromise = runStep(process.execPath, ['scripts/run-vite.mjs', 'build']);
    await delay(GRACE_MS);
    console.log('[ci-check] Monitoreando build...');
    await vitePromise;
    console.log('[ci-check] ✔ Build OK');
  } catch (err) {
    console.error('[ci-check] ✖ Error:', err?.message || err);
    process.exit(1);
  }
}

main();

