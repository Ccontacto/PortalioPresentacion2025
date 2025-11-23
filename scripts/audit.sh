#!/usr/bin/env bash
set -euo pipefail

echo "🚀 Audit PortalioPresentacion2025"
echo "================================"

echo "\n1) ESLint"
npm run lint

echo "\n2) Tests"
npm run test -- --run

echo "\n3) Build"
npm run build

echo "\n4) PWA assets"
if [[ ! -f public/manifest.webmanifest ]]; then
  echo "❌ Falta public/manifest.webmanifest"
  exit 1
fi
if [[ ! -f public/sw.js ]]; then
  echo "❌ Falta public/sw.js"
  exit 1
fi
echo "✅ Manifest y service worker presentes"

echo "\n5) Gradients legacy"
if rg -n "closest-side" src public >/dev/null 2>&1; then
  echo "⚠️ Detectado uso de syntax legacy en gradients (closest-side)"
else
  echo "✅ Sin gradients legacy conocidos"
fi

echo "\nAudit finalizada"
