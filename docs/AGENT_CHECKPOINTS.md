# Agent Playbook & Checkpoints

Este documento es la guía rápida para cualquier agente (humano o automatizado) que intervenga en **PortalioPresentacion2025**. Resume el contexto actual, los archivos críticos y los puntos de control que deben completarse antes de declarar cualquier tarea como “done”. Mantiene viva la narrativa del proyecto tras el ajuste de diseño “konami” y evita que se reinstalen dependencias o patrones antiguos.

---

## 0. Contexto inmediato

| Tema                          | Detalle                                                                                                            |
|------------------------------|---------------------------------------------------------------------------------------------------------------------|
| Entrada / rutas               | `/` → `LandingPlaceholder` (“en progreso”). `/portafolio/JoseCarlos` → App completa (controlado por `VITE_PORTFOLIO_MOUNT`). |
| Iconografía                   | Se usa **solo** `VectorIcon` (`src/components/icons/VectorIcon.tsx`) + `navIconFor`. `lucide-react` está desinstalado. |
| Temas                         | `ThemeContext` suporta light/dark/oled/high-contrast + konami (retro). Tokens en `src/index.css` / `src/styles/themes.css`. |
| Datos                         | `PortfolioSpecProvider` + `usePortfolioContent`. Texto duro solo vive en `src/data/es|en.ts`.                         |
| QA básica                     | `npm run lint`, `npm run test -- --run`, `npm run build` (build aún advierte del gradiente legacy en `.hero-cta-row`). |
| Deploy Cloudflare             | `npm run build:cloudflare` fija `PORTFOLIO_BASE_PATH=/portafolio/JoseCarlos/`.                                     |

---

## 1. Flujo del agente (macro)

1. **Reconocer contexto**  
   - Leer `README.md`, `docs/design-system.md`, esta guía y el issue/tarea actual.  
   - Identificar qué pilar afecta (ver tabla de la sección 2).

2. **Planear**  
   - Enumerar pasos concretos (lectura, refactor, docs, pruebas).  
   - Señalar si necesita tocar tokens, contexts o despliegue.

3. **Implementar**  
   - Usar el stack existente (React 19 + TS).  
   - Reutilizar tokens, `VectorIcon`, providers y hooks.  
   - Si agrega contenido, leerlo desde los `data` o `PortfolioSpec`.

4. **Validar**  
   - Siempre: `npm run lint` + `npm run test -- --run`.  
   - Si afecta build/rutas: `npm run build` o `npm run build:cloudflare`.  
   - Revisar que `/` siga mostrando el landing y `/portafolio/JoseCarlos` el app completo.

5. **Documentar**  
   - Actualizar los MD relevantes (README, design-system, este archivo, etc.).  
   - Registrar supuestos, riesgos y próximos pasos en los comentarios del PR.

---

## 2. Pilares y puntos de control

La tabla siguiente enlaza los 16 pilares solicitados por el equipo. Cada punto tiene: archivo(s), verificación y notas para agentes.

| Pilar | Descripción / Archivos claves | Punto de control |
|-------|-------------------------------|------------------|
| **I. DESIGN_SYSTEM** | `src/index.css`, `src/styles/themes.css`, `tokens/*.json`, `docs/design-system.md` | - Usar tokens existentes (colores OKLCH, motion). <br> - No agregar colores hardcodeados sin pasar por tokens. |
| **II. ROUTES** | `src/main.tsx`, `src/App.tsx`, `vite.config.ts`, `scripts/build-cloudflare.mjs` | - Mantener el gating `/` vs `/portafolio/JoseCarlos`. <br> - Actualizar doc si se agrega otro mount path. |
| **III. ATOMIC_LIBRARY** | `src/design-system/primitives/*`, `src/components/atoms` | - Nuevos componentes deben basarse en las primitivas o añadir una nueva con doc. |
| **IV. SCREENS** | `src/sections/*`, `src/components/organisms/*` | - Cada sección debe consumir `usePortfolioContent` y tokens. <br> - Iconos → `VectorIcon`. |
| **V. FLOWS** | `docs/AGENT_CHECKPOINTS.md` (este), `PROJECT_ANALYSIS.md` | - Registrar cambios de UX en docs al terminar. |
| **VI. DATOS** | `src/data/es.ts`, `src/data/en.ts`, `PortfolioSpecProvider` | - No duplicar textos. Extraer strings reutilizables aquí o en el spec. |
| **VII. A11Y_SEO_PWA** | `SkipToContent`, `global focus styles`, `public/manifest.webmanifest`, `docs/AUDIT.md` | - Focus-visible intacto, skip link funciona, metatags no se rompen. |
| **VIII. SECURITY_PRIVACY** | `firebase.*`, `scripts/audit.sh`, `TelemetryConsent` | - No exponer secrets. Consentimiento y storage versionado al día. |
| **IX. MOCKS** | `specs/portfolio-spec.json`, `src/content/portfolioSpec.ts` | - Si se agregan secciones, actualizar spec + `docs/design-system.md`. |
| **X. I18N_UX_COPY** | `LanguageContext`, `data/es|en.ts`, `i18n` helpers | - Cada string nuevo necesita ES/EN. Revisar `ui` en datasets. |
| **XI. EVAL** | `scripts/audit.sh`, `docs/AUDIT.md`, Vitest suites | - Mantener/crear pruebas al tocar hooks o secciones críticas. |
| **XII. TELEMETRIA** | `TelemetryProvider`, `useSectionTelemetry`, `docs/telemetry.md` | - Registrar nuevas secciones o eventos en `events.ts`. |
| **XIII. RUNTIME** | `src/main.tsx`, `vite.config.ts`, `public/_redirects`, `dist/` | - Probar `npm run build` y `npm run preview` si afecta runtime. |
| **XIV. PRIORIDADES** | `STACK_2025_ROADMAP.md`, issues vigentes | - Antes de iniciar, consultar la prioridad en roadmap/issue. |
| **XV. DoD** | Este documento + `docs/AUDIT.md` | - Al cerrar una tarea, cumplir la sección 3 y añadir notas en docs si aplican. |
| **XVI. VIOLATIONS** | `docs/TECH_DEBT.md`, `PROJECT_ANALYSIS.md` | - Registrar cualquier deuda o disipar la existente tras arreglarla. |

---

## 3. Checklist DoD (Definition of Done)

1. **Plan documentado** en el issue/PR (pasos, riesgos).  
2. **Implementación** respeta tokens, contexts, `VectorIcon`.  
3. **Validación técnica**: `npm run lint`, `npm run test -- --run` (y build cuando aplique).  
4. **Validación funcional**:  
   - `/` muestra LandingPlaceholder.  
   - `/portafolio/JoseCarlos` carga App entera sin errores en consola.  
5. **Documentación actualizada**: README, docs de diseño/telemetría/este archivo según corresponda.  
6. **Registro de deuda** (si queda algo pendiente) en `docs/TECH_DEBT.md` con fecha y plan.  
7. **Notas para agentes futuros**: si cambias flujos clave, adjunta un resumen en `.github/agents/*.md`.

---

## 4. Apuntes finales

- **No reinstalar librerías removidas** (ej. `lucide-react`). Cualquier ícono o animación va por el sistema actual.  
- **Cualquier cambio en rutas o basepath** debe probarse tanto en `npm run dev` como en `npm run preview` y dejar constancia en `docs/design-system.md`.  
- **Mantén esta guía al día**: tras cada refactor mayor, revisa si los puntos de control siguen siendo correctos y actualiza enlaces o comandos.
