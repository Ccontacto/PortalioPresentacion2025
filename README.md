# PortalioPresentacion2025

Scripts de desarrollo y CI estandarizados (pnpm-first) y verificación rápida con timeouts.

## Requisitos
- Node 18+ (recomendado 20+)
- Paquetes instalados (ya incluidos en `node_modules`)

## Gestor de paquetes
- Proyecto alineado a pnpm (ver `packageManager` en package.json).
- Puedes usar los scripts sin pnpm gracias a los wrappers incluidos.

## Scripts
- `dev`: inicia Vite en `0.0.0.0:5173`.
- `build`: compila TypeScript y genera el build de Vite.
- `preview`: sirve el build en `0.0.0.0:5176`.
- `test`: ejecuta Vitest en modo CLI (sin depender de `.bin`).
- `test:ci`: Vitest con reporter compacto.
- `check:ci`: corre tests, typecheck y build con monitoreo; espera 10s y corta a los 20s si se atasca.

Ejemplos:

```
npm run test
npm run build
npm run check:ci
```

## Notas de build (Tailwind v4)
- El CSS usa `@import "tailwindcss"` y `@theme`. Si el build falla por PostCSS con mensajes del tipo “Missed semicolon” en `@theme`, asegúrate de tener activo el plugin `@tailwindcss/postcss`.
- Este repo integra el plugin desde `vite.config.ts`.

## Rama actual
- `feat-portfolio-redesign` (tracking origin).
