# Mapa de carpetas y responsabilidades

Esta guía resume cómo está organizado el repositorio y cuál es el rol de cada carpeta/archivo relevante. Úsala como referencia rápida antes de tocar rutas o crear componentes nuevos.

---

## Raíz del repo

| Ruta | Descripción |
|------|-------------|
| `package.json`, `package-lock.json`, `pnpm-lock.yaml` | Scripts y dependencias. Recordar que el paquete externo de íconos fue removido; los íconos viven en `VectorIcon`. |
| `README.md` | Introducción rápida + enlaces a docs clave. |
| `docs/` | Documentación operativa (`design-system`, `TECH_DEBT`, `AGENT_CHECKPOINTS`, etc.). |
| `scripts/` | Utilidades de build (`tokens-build`, `build-cloudflare.mjs`, `audit.sh`). |
| `public/` | Manifest, `_redirects`, tokens CSS generados y SW para PWA. |
| `dist/` | Salida de `npm run build`. Ignorar en commits. |
| `tokens/` | Fuente de los design tokens (JSON DTCG). |
| `specs/` | Esquema del portfolio (contenido + formularios) consumido por `PortfolioSpecProvider`. |

---

## `src/` (código de la app)

| Carpeta / Archivo | Rol |
|-------------------|-----|
| `main.tsx` | Entrada. Gestiona `LandingPlaceholder` (home) vs App completa bajo `VITE_PORTFOLIO_MOUNT`, registra el SW en producción. |
| `App.tsx` | Define la jerarquía de providers (`Language`, `Theme`, `Telemetry`, `Toast`, etc.) y renderiza las secciones principales. |
| `index.css` | Tokens globales + estilos base (focus-visible, skip-link, Dock, hamburguesa, etc.). |
| `styles/themes.css`, `styles/global.css` | Overrides puntuales para temas y reglas globales. |
| `components/` | Piezas de UI (átomos → organismos). Ver tabla siguiente. |
| `contexts/` | Providers (`Language`, `Theme`, `Navigation`, `Telemetry`, `Dev`, `Toast`). Persisten preferencias en `localStorage`. |
| `hooks/` | Hooks compartidos (`useHorizontalScroll`, `useKonamiCode`, `useKeyboardShortcuts`, `useConfettiCooldown`, etc.). |
| `sections/` | Secciones de la página (Hero, Experience, Skills, FocusAreas, Projects, Contact). Consumen primitivos/tokens. |
| `design-system/` | Primitivas (`SectionWrapper`, `SectionHeader`, `Badge`, `Card`, `Chip`) y tokens TS generados. |
| `data/` | Datasets `es`/`en` con copy, metadata y strings `ui`. Mantener sincronizados ambos idiomas. |
| `content/` | Archivos derivados del spec JSON (`portfolioSpec.ts`). |
| `telemetry/` | `TelemetryProvider`, hooks para registrar secciones y eventos. |
| `types/` | Tipos compartidos (`PortfolioData`, `HeroMeta`, etc.). Se importan como `@portfolio-types`. |
| `utils/` | Helpers (validación de URLs, logger, design tokens, storage). |
| `dataconnect-generated/` | Código generado por Firebase DataConnect (actualmente no usado en runtime). |

### `src/components/` en detalle

| Ruta | Descripción |
|------|-------------|
| `components/atoms/` | Botones, badges u otros átomos puros. |
| `components/icons/VectorIcon.tsx` | Única fuente de íconos SVG (usa tokens + currentColor). `navIconFor` (en `utils`) delega en este archivo. |
| `components/header/` | Elementos del header legado (p. ej. `AvailabilityBadge`). |
| `components/Navbar/`, `components/organisms/` | Contienen la navegación clásica y organismos (hero shell, cards, etc.). |
| `components/quick-actions/` | Hook `useQuickActionsData` y tipos para `HamburgerMenu` / `CommandPalette`. |
| `CommandPalette.tsx`, `HamburgerMenu.tsx`, `Dock.tsx`, `SearchBar.tsx` | Menús flotantes y buscador. Reutilizan `VectorIcon`, `useQuickActionsData` y `useHorizontalScroll`. |
| `LandingPlaceholder.tsx` | Vista de “En progreso” mostrada en `/`. |
| `DevPortfolioEditor.tsx` | Editor JSON (solo en `import.meta.env.DEV`) para alterar contenido en vivo. |
| `PrivacyPanel.tsx`, `TelemetryConsent.tsx`, `ToastContainer.tsx`, `ConfettiCanvas.tsx`, `PageProgress.tsx`, `SkipToContent.tsx` | Utilidades/overlays globales. |
| `ContactForm/` | Formulario basado en `react-hook-form + zod`. |

### `src/sections/`

| Sección | Claves |
|---------|--------|
| `Hero.tsx` | Tokens hero, `AvailabilityBadge`, CTA row, `VectorIcon` para meta. |
| `FocusAreas.tsx`, `Skills.tsx`, `Projects.tsx` | Usan `HorizontalScroller` (botones prev/next via `VectorIcon`). |
| `Experience.tsx` | Carrusel horizontal con chips y `Chip` del design system. |
| `Contact.tsx` | `ContactForm`, `PrivacyPanel`, CTA buttons (WhatsApp, Email, Copiar). |

---

## `docs/` relevantes

| Archivo | Contenido |
|---------|-----------|
| `docs/AGENT_CHECKPOINTS.md` | Playbook + DoD para agentes (gating Landing ↔ portfolio, pilares, checklist). |
| `docs/design-system.md` | Tokens, `VectorIcon`, microinteracciones y despliegue Cloudflare. |
| `docs/TECH_DEBT.md` | Registro de deuda histórica (Dock, overlay remoto, tokens generados). |
| `docs/AUDIT.md`, `PROJECT_ANALYSIS.md` | Auditorías de calidad previas (referencia de hallazgos). |
| `.github/agents/my-agent.agent.md` | Briefing específico para Copilot Agents (Atomic design, icon rules, rutas). |

---

## Scripts útiles

| Comando | Acción |
|---------|--------|
| `npm run dev` | Dev server (Landing ↔ App). |
| `npm run lint` | ESLint. |
| `npm run test -- --run` | Vitest en modo CI. |
| `npm run build` | `tsc && vite build` (advierte del gradiente legacy). |
| `npm run build:cloudflare` | Build con `PORTFOLIO_BASE_PATH=/portafolio/JoseCarlos/`. |
| `npm run spec:build` | Regenera tokens y contenido desde `specs/`. |

Mantén este documento actualizado si cambian rutas críticas, se agrega un submódulo importante o se reestructura la navegación.
