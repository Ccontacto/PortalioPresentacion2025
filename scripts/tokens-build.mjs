#!/usr/bin/env node
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const SRC = new URL('../tokens/core.json', import.meta.url);

const toOklch = (obj) => `oklch(${obj.L} ${obj.C} ${obj.h})`;
const isObj = (v) => typeof v === 'object' && v !== null;
const tokenVal = (entry) => (entry?.$value ?? entry?.value ?? entry);

const rem = (n) => `calc(1rem * ${Number(n).toFixed(4)})`;
const px = (n) => `${Math.round(Number(n))}px`;

const shadowStr = (dx, dy, blur, alpha) => `${Math.round(dx)}px ${Math.round(dy)}px ${Math.round(blur)}px rgba(0,0,0,${alpha})`;

const emit = async () => {
  const raw = await readFile(SRC, 'utf8');
  const json = JSON.parse(raw);
  const t = json.tokens ?? json;

  const lines = [];
  lines.push(':root{');

  // neutrals
  const neutrals = t?.color?.neutral ?? {};
  for (const k of Object.keys(neutrals)) {
    const v = tokenVal(neutrals[k]);
    if (isObj(v) && 'L' in v && 'C' in v && 'h' in v) {
      lines.push(`  --neutral-${k}: ${toOklch(v)};`);
    } else {
      lines.push(`  --neutral-${k}: ${v};`);
    }
  }

  // accents
  const accents = t?.color?.accent ?? {};
  for (const k of Object.keys(accents)) {
    const v = tokenVal(accents[k]);
    if (isObj(v) && 'L' in v && 'C' in v && 'h' in v) {
      lines.push(`  --accent-${k}: ${toOklch(v)};`);
    } else {
      lines.push(`  --accent-${k}: ${v};`);
    }
  }

  // typography sizes
  const sizes = t?.typography?.size ?? {};
  for (const k of Object.keys(sizes)) {
    const v = tokenVal(sizes[k]);
    const n = typeof v === 'string' && v.endsWith('px') ? parseFloat(v) / 16 : Number(v);
    if (!Number.isNaN(n)) lines.push(`  --type-size-${k}: ${rem(n)};`);
  }

  // spacing
  const spacing = t?.spacing ?? t?.space ?? {};
  for (const k of Object.keys(spacing)) {
    const v = tokenVal(spacing[k]);
    const n = typeof v === 'string' && v.endsWith('px') ? parseFloat(v) / 16 : Number(v);
    if (!Number.isNaN(n)) lines.push(`  --space-${k}: ${rem(n)};`);
  }

  // radius
  const radius = t?.radius ?? {};
  for (const k of Object.keys(radius)) {
    const v = tokenVal(radius[k]);
    const n = typeof v === 'string' && v.endsWith('px') ? parseFloat(v) : Number(v);
    if (!Number.isNaN(n)) lines.push(`  --radius-${k}: ${px(n)};`);
  }

  // shadows (approximate using black base)
  const sh = t?.shadow ?? {};
  for (const k of Object.keys(sh)) {
    const v = tokenVal(sh[k]);
    if (isObj(v) && 'dx' in v) {
      lines.push(`  --shadow-${k}: ${shadowStr(v.dx, v.dy, v.blur, v.alpha)};`);
    } else {
      lines.push(`  --shadow-${k}: ${v};`);
    }
  }

  // motion (durations/easing)
  const motion = t?.motion ?? {};
  const dur = motion?.duration ?? {};
  for (const k of Object.keys(dur)) {
    const v = String(tokenVal(dur[k]));
    const ms = v.endsWith('ms') ? v : `${v}`;
    lines.push(`  --motion-${k}: ${ms};`);
  }
  const easing = motion?.easing ?? {};
  for (const k of Object.keys(easing)) {
    const val = tokenVal(easing[k]);
    const ease = Array.isArray(val) ? `cubic-bezier(${val.join(',')})` : String(val);
    lines.push(`  --ease-${k}: ${ease};`);
  }

  lines.push('}');

  const css = lines.join('\n') + '\n';

  const targets = [
    path.resolve(path.dirname(new URL(import.meta.url).pathname), '../public/tokens.css'),
    path.resolve(path.dirname(new URL(import.meta.url).pathname), '../build/web/tokens.css')
  ];

  for (const url of targets) {
    await mkdir(path.dirname(url), { recursive: true });
    await writeFile(url, css, 'utf8');
  }

  console.log('tokens-build: generated public/tokens.css and build/web/tokens.css');
};

emit().catch((e) => { console.error(e); process.exit(1); });
