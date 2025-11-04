# PortalioPresentacion2025

Portfolio React + Vite listo para desarrollo local, testing y despliegue en Cloudflare Pages.

## Requisitos
- Node 22 o superior (ver `.nvmrc`)
- Dependencias instaladas (`npm install` / `pnpm install`)

## Scripts disponibles
- `npm run dev`: levanta Vite (0.0.0.0:5173). Si cambias deps, limpia cache con `rm -rf node_modules/.vite`.
- `npm run build`: ejecuta `tsc` y genera el bundle en `dist`.
- `npm run preview`: sirve el build en 0.0.0.0:5176.
- `npm run test`: Vitest en modo interactivo.
- `npm run test:ci`: Vitest en modo `run` con reporter compacto.
- `npm run tsc`: type-check aislado (`tsc --noEmit`).
- `npm run check:ci`: `npm run test:ci && npm run build` para pipelines.
- `npm run lint` / `npm run lint:fix`: reglas ESLint.
- `npm run format`: Prettier a todo el repo.
- `npm run check:ci`: flujo completo usado en CI (lint + tests con cobertura + build).

## Notas Tailwind v4
- `src/index.css` usa `@theme` solo con variables planas y custom props.
- @layer utilities declara clases semánticas (`bg-surface-base`, `hit-44`, etc.).
- Mantén `@tailwindcss/postcss` en `vite.config.ts` para que no falle el parser.

## A11y
- `.hit-44` garantiza targets ≥44px. Se aplica a triggers, cierres y dock.
- Focus visible con box-shadow (ver `:focus-visible` en `src/index.css`).

## Despliegue en Cloudflare Pages
1. Ejecuta `npm run build` (generará `dist`).
2. Configura Cloudflare Pages:
   - Framework preset: **Vite**
   - Build command: `npm run build`
   - Output directory: `dist`
3. (Opcional) CLI Wrangler: `npx wrangler pages deploy dist --project-name <tu-proyecto>`.

## CI/CD
- [![CI](https://github.com/Ccontacto/PortalioPresentacion2025/actions/workflows/ci.yml/badge.svg)](https://github.com/Ccontacto/PortalioPresentacion2025/actions/workflows/ci.yml) ejecuta `npm ci`, lint, tests con cobertura (`vitest --coverage`) y build en cada push/PR.
- [![Deploy (Cloudflare Pages)](https://github.com/Ccontacto/PortalioPresentacion2025/actions/workflows/deploy-cloudflare-pages.yml/badge.svg)](https://github.com/Ccontacto/PortalioPresentacion2025/actions/workflows/deploy-cloudflare-pages.yml) publica automáticamente a Cloudflare Pages tras un build exitoso en `main`.
- Las acciones cachean dependencias vía `package-lock.json`; si cambias dependencias, recuerda commitear el lockfile para mantener instalaciones deterministas.
- Para reproducir el pipeline localmente ejecuta `npm run lint && npm run check:ci`.
- El job de CI adjunta un artefacto `coverage-report`. Descárgalo desde la run más reciente para revisar el HTML detallado de cobertura.
- Sitio publicado: [https://portalio-presentacion-2025.pages.dev](https://portalio-presentacion-2025.pages.dev) (actualizado después de cada merge en `main`).

## Flujo Git recomendado
1. `git status`
2. `npm run check:ci`
3. `git add . && git commit -m "feat: …"`
4. `git push origin <rama>`

## Estado actual
- Tests (`npm run test:ci`): ✅
- Build (`npm run build`): ✅
- caché Vite limpia (`rm -rf node_modules/.vite` antes de `npm run dev` si cambias bundling).

## Setup rápido (Git + Cloudflare)

1. Configura las variables de entorno con tus credenciales:
   ```bash
   export GIT_USER_NAME="Tu Nombre"
   export GIT_USER_EMAIL="contacto@yosoymx.com"
   export CLOUDFLARE_ACCOUNT_ID="<tu-account-id>"
   export CLOUDFLARE_API_TOKEN="<tu-api-token>"
   export CLOUDFLARE_PROJECT="portalio-presentacion-2025"
   ```
2. Inicializa la configuración de Git en el repo:
   ```bash
   npm run setup:git
   ```
3. Despliega manualmente a Cloudflare Pages cuando quieras:
   ```bash
   npm run deploy:cf
   ```

> **Nota:** el script de deploy ejecuta `npm run build` y usa `wrangler` bajo el capó. Si no deseas exportar los secretos en la terminal, puedes ejecutarlo así: `CLOUDFLARE_API_TOKEN=... npm run deploy:cf`.

Para ejecución continua, los workflows de GitHub Actions ya están listos; sólo asegúrate de registrar los secretos `CLOUDFLARE_API_TOKEN` y `CLOUDFLARE_ACCOUNT_ID` en el repositorio.
