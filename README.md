# PortalioPresentacion2025

Portfolio React + Vite listo para desarrollo local, testing y despliegue en Cloudflare Pages.

## Requisitos
- Node 20 LTS (para builds en Cloudflare Pages) o Node 22+ para desarrollo local
- Dependencias instaladas (`npm install` / `pnpm install`)

## Stack 2025
- React 19.2 + React DOM 19.2 (renderizado SPA con Suspense y server hints opcionales)
- Vite 7.1 como bundler/dev server con TypeScript 5.9 y compatibilidad ESM nativa
- Tailwind CSS 4.1 + utilidades personalizadas (`src/index.css`) más PostCSS 8.5 via `@tailwindcss/postcss`
- Framer Motion 12.23 para animaciones, Lucide 0.552 para iconografía, jsPDF 3.0 para exportar CV
- Vitest 4 + Testing Library para pruebas de componentes, ESLint 9 + Prettier 3 para lint/format
- Deploy automatizado en Cloudflare Pages (build `npm run build`, directorio `dist`)

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
- `.hit-44` garantiza targets ≥44px. Se aplica a triggers y botones del menú de acciones.
- Focus visible con box-shadow (ver `:focus-visible` en `src/index.css`).
- Las “Acciones rápidas” aparecen como una página del menú hamburguesa; el buscador interno filtra opciones, se puede navegar con teclado y se cierra con backdrop o `Esc`.

## Menú de acciones global
- La página “Acciones rápidas” dentro del menú hamburguesa opera en todo el sitio; muestra las secciones (`data.nav`) y preferencias (tema, idioma, Konami, confetti, IDs de depuración, descarga de CV) y permite filtrar o ejecutar rápidamente esas acciones.
- El listado se puede filtrar, activa el easter egg (secuencia Konami) desde el input y devuelve el foco al cerrar.
- Las mismas acciones están disponibles en el Command Palette (`⌘/Ctrl + K`) para usuarios de desktop.

## Despliegue en Cloudflare Pages
1. Ejecuta `npm run build` (generará `dist`).
2. Configura Cloudflare Pages:
   - Framework preset: **Vite**
   - Build command: `npm run build`
   - Output directory: `dist`
   - Variable de entorno `NODE_VERSION=20` (Cloudflare expone Node 20.x en los builds 2025)
3. (Opcional) CLI Wrangler: `npx wrangler pages deploy dist --project-name <tu-proyecto>`.

## CI/CD
- [![CI](https://github.com/Ccontacto/PortalioPresentacion2025/actions/workflows/ci.yml/badge.svg)](https://github.com/Ccontacto/PortalioPresentacion2025/actions/workflows/ci.yml) ejecuta `npm ci`, lint, tests con cobertura (`vitest --coverage`) y build en cada push/PR.
- [![Deploy (Cloudflare Pages)](https://github.com/Ccontacto/PortalioPresentacion2025/actions/workflows/deploy-cloudflare-pages.yml/badge.svg)](https://github.com/Ccontacto/PortalioPresentacion2025/actions/workflows/deploy-cloudflare-pages.yml) publica automáticamente a Cloudflare Pages tras un build exitoso en `main`.
- Las acciones cachean dependencias vía `package-lock.json`; si cambias dependencias, recuerda commitear el lockfile para mantener instalaciones deterministas.
- Para reproducir el pipeline localmente ejecuta `npm run lint && npm run check:ci`.
- El job de CI adjunta un artefacto `coverage-report`. Descárgalo desde la run más reciente para revisar el HTML detallado de cobertura.
- Sitio publicado: [https://portalio-presentacion-2025.pages.dev](https://portalio-presentacion-2025.pages.dev) (actualizado después de cada merge en `main`).

## Deuda técnica rastreada
- `docs/TECH_DEBT.md` agrupa los experimentos que se quitaron del runtime (p. ej. el antiguo “control remoto” del modal y la documentación histórica). Revisa ese archivo antes de reactivar features en pausa.

## Flujo Git recomendado
1. `git status`
2. `npm run check:ci`
3. `git add . && git commit -m "feat: …"`
4. `git push origin <rama>`

## Estado actual
- Tests (`npm run test:ci`): ✅
- Build (`npm run build`): ✅
- caché Vite limpia (`rm -rf node_modules/.vite` antes de `npm run dev` si cambias bundling).

## Guía de diseño (menú flotante y disclosure progresivo)

- Menú flotante inferior derecha
  - Botón hamburguesa circular fijo abajo‑derecha (safe-area), abre panel con búsqueda, 5 secciones y “Acciones rápidas”.
  - Caret orientado al botón; panel se posiciona arriba/abajo con altura máxima dinámica y scroll interno.
  - z-index fijo `--z-floating: 15000` para sobresalir de overlays.

- Colocación de panel reutilizable
  - Hook `useFloatingPanelPlacement` calcula posición y `maxHeight`. Aplícalo en cualquier panel flotante para consistencia.

- Disclosure progresivo en secciones
  - Skills: muestra una fila de badges por defecto con `badges-clamp-1`; botón “Ver más/menos” para expandir/colapsar.
  - Projects: renderiza 4 proyectos por defecto, descripciones con `clamp-3` y botón “Ver más proyectos”.
  - Experience: 2 empleos por defecto, “Mostrar toda la experiencia” y “Ver más/menos” por descripción.

- Troubleshooting
- Si el panel no se ve: verifica `--z-floating` (15000) y que no haya contenedores padres con `overflow:hidden`.
- En móvil: usa `onTouchEnd` con `preventDefault()` en triggers para evitar double‑tap y ghost clicks.
- A11y: listas como `ul > li > button`, `nav[aria-label]`, triggers con `aria-expanded`/`aria-controls`.

## Hero backgrounds

- `.page-section--hero` ahora pinta un degradado crema muy tenue con las líneas de libreta embebidas; en el tema oscuro (baliza `data-theme="dark"` sobre el `<html>`) el mismo contenedor se transforma en un lienzo negro puro, dejando que `.hero-backdrop` añada únicamente los halos y estrellas puntuales.
- Conserva el `<div className="hero-backdrop" aria-hidden="true" />` dentro del `Hero` para que los halos se reactiven en modo oscuro sin sumar gradientes contradictorios sobre la base negra.
- Usa las utilidades `.hero-dark-gradient` y `.hero-retro-gradient` cuando quieras que CTAs o badges brillen con los tonos registrados en `--hero-dark-accent-*` y `--hero-retro-accent-*`; ya ajustan `color: var(--text-inverse)` para mantener contraste fuerte.
- Si reaplicas `.fx-chaos-bg` en otros paneles, hazlo con moderación: su nueva mezcla son lavados suaves (no gradientes saturados) pensados para no interferir con el fondo hero limpio.

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

## Utilidades y guardias introducidas
- `src/utils/storage.ts` expone un helper `storage` que valida disponibilidad, protege con `try/catch` y se combina con `ensureStorageVersion` (invocado desde `src/main.tsx`) para purgar claves legacy antes de arrancar los contextos con nueva estructura.
- `src/utils/urlValidation.ts` (más `src/utils/__tests__/urlValidation.test.ts`) formaliza la sanitización/normalización de enlaces externos; ahora `CommandPalette`, el listado de proyectos y cualquier futura apertura de URL pasan por esta capa para evitar `javascript:` o `file:` y forzamos `http[s]`.
- `useCvDownload` usa el guard `isValidLang` antes de disparar `generatePdf` y ejecuta la generación con timeout (15 s) para no dejar al usuario esperando indefinidamente.
- `ToastContext` mantiene como máximo cinco toasts en pantalla, utiliza IDs incrementales y limpia timers antiguos para evitar colisiones o leaks.
- Las funciones `useFloatingPanelPlacement` y `useBodyScrollLock` ahora usan listeners pasivos y un singleton de lock, respectivamente, para garantizar compatibilidad en móviles y evitar efectos secundarios en scroll.
