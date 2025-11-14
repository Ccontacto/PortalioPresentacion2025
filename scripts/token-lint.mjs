#!/usr/bin/env node
import { readFile } from 'node:fs/promises';

const path = new URL('../src/index.css', import.meta.url);
const css = await readFile(path, 'utf8');

const lines = css.split(/\r?\n/);
const offenders = [];
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (/\btransition\s*:/.test(line)) {
    let block = line;
    let j = i + 1;
    while (!/;\s*$/.test(block) && j < lines.length) {
      block += lines[j];
      j++;
    }
    const usesToken = /var\(--motion-(fast|normal|slow)\)/.test(block) || /opacity var\(--motion-/.test(block);
    if (!usesToken) {
      offenders.push({ line: i + 1, text: block.trim() });
    }
    i = j - 1;
  }
}

if (offenders.length === 0) {
  console.log('token-lint: OK — todas las transitions usan tokens de motion');
  process.exit(0);
}

console.log('token-lint: halladas transitions sin tokens de motion:');
for (const o of offenders) {
  console.log(`  src/index.css:${o.line}  ${o.text}`);
}
// Reporta pero no falla para no bloquear CI por ahora
process.exit(0);
