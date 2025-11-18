#!/usr/bin/env node
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const CORE_SRC = new URL('../tokens/core.json', import.meta.url);
const DTCG_SRC = new URL('../tokens/dtcg-system-2025.json', import.meta.url);

const toOklch = (obj) => `oklch(${obj.L} ${obj.C} ${obj.h})`;
const toOklchFromSpace = (v) =>
  v && typeof v === 'object' && v.colorSpace === 'oklch' && Array.isArray(v.components)
    ? `oklch(${v.components[0]} ${v.components[1]} ${v.components[2]})`
    : null;
const isObj = (v) => typeof v === 'object' && v !== null;
const tokenVal = (entry) => (entry?.$value ?? entry?.value ?? entry);

const rem = (n) => `calc(1rem * ${Number(n).toFixed(4)})`;
const px = (n) => `${Math.round(Number(n))}px`;
const shadowStr = (dx, dy, blur, alpha) =>
  `${Math.round(dx)}px ${Math.round(dy)}px ${Math.round(blur)}px rgba(0,0,0,${alpha})`;

const normalizeVarName = (pathStr) =>
  `--dt-${pathStr.replace(/[^a-zA-Z0-9]+/g, '-').replace(/-+/g, '-').toLowerCase()}`;

const flattenDtcg = (node, prefix = [], target = new Map()) => {
  if (!node || typeof node !== 'object') return target;
  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith('$') || key === 'meta' || key === 'description') continue;
    if (!value || typeof value !== 'object') continue;
    if ('$value' in value) {
      const tokenPath = [...prefix, key].join('.');
      target.set(tokenPath, { value: value.$value, type: value.$type ?? null });
      continue;
    }
    flattenDtcg(value, [...prefix, key], target);
  }
  return target;
};

const REF_REGEX = /^\{(.+)\}$/;

const resolveTokenValue = (path, baseMap, overrideMap, stack = new Set()) => {
  const entry = overrideMap?.get(path) ?? baseMap.get(path);
  if (!entry) return undefined;
  const resolveValue = (raw) => {
    if (typeof raw === 'string') {
      const match = raw.match(REF_REGEX);
      if (match) {
        const refPath = match[1].trim();
        if (stack.has(refPath)) return raw;
        stack.add(refPath);
        const resolved = resolveTokenValue(refPath, baseMap, overrideMap, stack);
        stack.delete(refPath);
        return resolved ?? raw;
      }
      return raw;
    }
    if (Array.isArray(raw)) {
      return raw.map((item) => resolveValue(item));
    }
    if (raw && typeof raw === 'object') {
      const result = {};
      for (const [k, v] of Object.entries(raw)) {
        result[k] = resolveValue(v);
      }
      return result;
    }
    return raw;
  };
  return resolveValue(entry.value);
};

const formatShadow = (value) => {
  if (Array.isArray(value)) {
    return value.map((entry) => formatShadow(entry)).join(', ');
  }
  if (value && typeof value === 'object') {
    const parts = [];
    if (value.inset) parts.push('inset');
    parts.push(value.offsetX ?? '0px');
    parts.push(value.offsetY ?? '0px');
    parts.push(value.blur ?? '0px');
    if (value.spread !== undefined) parts.push(value.spread);
    parts.push(value.color ?? 'rgba(0,0,0,0.25)');
    return parts.join(' ');
  }
  return String(value);
};

const formatForCss = (value, type) => {
  if (type === 'shadow') {
    return formatShadow(value);
  }
  if (type === 'fontFamily' && Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item !== 'string') return String(item);
        return item.includes(' ') && !item.includes('"') && !item.includes("'") ? `"${item}"` : item;
      })
      .join(', ');
  }
  if (type === 'cubicBezier' && Array.isArray(value)) {
    return `cubic-bezier(${value.join(',')})`;
  }
  if (Array.isArray(value)) {
    return value.map((item) => formatForCss(item)).join(', ');
  }
  if (value && typeof value === 'object') {
    return JSON.stringify(value);
  }
  if (typeof value === 'boolean') {
    return value ? '1' : '0';
  }
  return String(value);
};

const buildDtcgBlocks = (dtcgJson) => {
  const baseTokens = flattenDtcg(dtcgJson);
  const modes = dtcgJson?.$extensions?.modes ?? {};
  const modeOverrides = new Map();

  for (const [modeName, modeConfig] of Object.entries(modes)) {
    const overrides = new Map();
    const rawOverrides = modeConfig?.overrides ?? {};
    for (const [rawPath, rawValue] of Object.entries(rawOverrides)) {
      const cleanedPath = rawPath.replace(/\.?\$value$/, '');
      overrides.set(cleanedPath, {
        value: rawValue,
        type: baseTokens.get(cleanedPath)?.type ?? null
      });
    }
    if (overrides.size) {
      modeOverrides.set(modeName, overrides);
    }
  }

  const baseLines = [];
  const resolvedBase = new Map();

  for (const [path, entry] of baseTokens.entries()) {
    const resolved = resolveTokenValue(path, baseTokens, null, new Set());
    if (resolved === undefined) continue;
    resolvedBase.set(path, resolved);
    const cssValue = formatForCss(resolved, entry.type);
    baseLines.push(`  ${normalizeVarName(path)}: ${cssValue};`);
  }

  const modeBlocks = [];
  for (const [modeName, overrides] of modeOverrides.entries()) {
    const blockLines = [];
    for (const [path, entry] of overrides.entries()) {
      const resolved = resolveTokenValue(path, baseTokens, overrides, new Set());
      if (resolved === undefined) continue;
      const cssValue = formatForCss(resolved, entry.type ?? baseTokens.get(path)?.type);
      blockLines.push(`  ${normalizeVarName(path)}: ${cssValue};`);
    }
    if (blockLines.length) {
      modeBlocks.push(`[data-theme='${modeName}']{\n${blockLines.join('\n')}\n}`);
    }
  }

  return { baseLines, modeBlocks };
};

const emit = async () => {
  const coreRaw = await readFile(CORE_SRC, 'utf8');
  const coreJson = JSON.parse(coreRaw);
  const t = coreJson.tokens ?? coreJson;

  const dtcgRaw = await readFile(DTCG_SRC, 'utf8');
  const dtcgJson = JSON.parse(dtcgRaw);
  const dtcgBlocks = buildDtcgBlocks(dtcgJson);

  const lines = [];
  lines.push(':root{');

  // neutrals
  const neutrals = t?.color?.neutral ?? {};
  for (const k of Object.keys(neutrals)) {
    const v = tokenVal(neutrals[k]);
    if (isObj(v) && 'L' in v && 'C' in v && 'h' in v) {
      lines.push(`  --neutral-${k}: ${toOklch(v)};`);
    } else {
      const alt = toOklchFromSpace(v);
      lines.push(`  --neutral-${k}: ${alt ?? v};`);
    }
    const vv = isObj(v) ? (toOklchFromSpace(v) ?? (('L' in v) ? toOklch(v) : v)) : v;
    lines.push(`  --u-color-neutral-${k}: ${vv};`);
  }

  // accents
  const accents = t?.color?.accent ?? {};
  for (const k of Object.keys(accents)) {
    const v = tokenVal(accents[k]);
    if (isObj(v) && 'L' in v && 'C' in v && 'h' in v) {
      lines.push(`  --accent-${k}: ${toOklch(v)};`);
    } else {
      const alt = toOklchFromSpace(v);
      lines.push(`  --accent-${k}: ${alt ?? v};`);
    }
    const vv = isObj(v) ? (toOklchFromSpace(v) ?? (('L' in v) ? toOklch(v) : v)) : v;
    lines.push(`  --u-color-accent-${k}: ${vv};`);
  }

  // roles (t0/t1) → variables u-roles-* y alias por tema
  const roles = t?.roles ?? {};
  const roleSets = {};
  for (const setKey of Object.keys(roles)) {
    if (String(setKey).startsWith('$')) continue;
    const set = roles[setKey];
    if (!isObj(set)) continue;
    roleSets[setKey] = {};
    for (const roleKey of Object.keys(set)) {
      if (String(roleKey).startsWith('$')) continue;
      const v = tokenVal(set[roleKey]);
      const alt = toOklchFromSpace(v);
      const out = alt ?? v;
      roleSets[setKey][roleKey] = out;
      lines.push(`  --u-roles-${setKey}-${roleKey}: ${out};`);
    }
  }

  if (roleSets['t0']) {
    const r = roleSets['t0'];
    if (r.bg) lines.push(`  --u-role-bg: ${r.bg};`);
    if (r.fg) lines.push(`  --u-role-fg: ${r.fg};`);
    if (r.ax) lines.push(`  --u-role-ax: ${r.ax};`);
    if (r.ol) lines.push(`  --u-role-ol: ${r.ol};`);
  }

  // typography sizes
  const sizes = t?.typography?.size ?? {};
  for (const k of Object.keys(sizes)) {
    const v = tokenVal(sizes[k]);
    const n = typeof v === 'string' && v.endsWith('px') ? parseFloat(v) / 16 : Number(v);
    if (!Number.isNaN(n)) lines.push(`  --type-size-${k}: ${rem(n)};`);
    if (!Number.isNaN(n)) lines.push(`  --u-type-size-${k}: ${rem(n)};`);
  }

  // spacing
  const spacing = t?.spacing ?? t?.space ?? {};
  for (const k of Object.keys(spacing)) {
    const v = tokenVal(spacing[k]);
    const n = typeof v === 'string' && v.endsWith('px') ? parseFloat(v) / 16 : Number(v);
    if (!Number.isNaN(n)) lines.push(`  --space-${k}: ${rem(n)};`);
    if (!Number.isNaN(n)) lines.push(`  --u-space-${k}: ${rem(n)};`);
  }

  // radius
  const radius = t?.radius ?? {};
  for (const k of Object.keys(radius)) {
    const v = tokenVal(radius[k]);
    const n = typeof v === 'string' && v.endsWith('px') ? parseFloat(v) : Number(v);
    if (!Number.isNaN(n)) lines.push(`  --radius-${k}: ${px(n)};`);
    if (!Number.isNaN(n)) lines.push(`  --u-radius-${k}: ${px(n)};`);
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
    if (k.startsWith('$')) continue;
    const v = String(tokenVal(dur[k]));
    const ms = v.endsWith('ms') ? v : `${v}`;
    lines.push(`  --motion-${k}: ${ms};`);
  }
  const easing = motion?.easing ?? {};
  for (const k of Object.keys(easing)) {
    if (k.startsWith('$')) continue;
    const val = tokenVal(easing[k]);
    const ease = Array.isArray(val) ? `cubic-bezier(${val.join(',')})` : String(val);
    lines.push(`  --ease-${k}: ${ease};`);
  }

  // Append resolved DTCG tokens
  lines.push(...dtcgBlocks.baseLines);
  lines.push('}');

  if (roleSets['t1']) {
    const r1 = roleSets['t1'];
    const dark = [];
    if (r1.bg) dark.push(`  --u-role-bg: ${r1.bg};`);
    if (r1.fg) dark.push(`  --u-role-fg: ${r1.fg};`);
    if (r1.ax) dark.push(`  --u-role-ax: ${r1.ax};`);
    if (r1.ol) dark.push(`  --u-role-ol: ${r1.ol};`);
    if (dark.length) {
      lines.push("[data-theme='dark']{");
      lines.push(...dark);
      lines.push('}');
    }
  }

  if (dtcgBlocks.modeBlocks.length) {
    lines.push(...dtcgBlocks.modeBlocks);
  }

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

emit().catch((e) => {
  console.error(e);
  process.exit(1);
});
