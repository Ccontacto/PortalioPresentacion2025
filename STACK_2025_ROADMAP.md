# Stack 2025 Alignment & October 2025 Roadmap

> **Objetivo:** documentar qué tenemos hoy (noviembre 2025), validar si el stack ya cumple la promesa "Stack 2025" y definir los sprints que deberíamos cubrir de aquí a octubre 2025 para maximizar valor.

## 1. Inventario actual (noviembre 2025)

| Capa | Evidencia en repo | Qué aporta |
| --- | --- | --- |
| Runtime & Tooling | React 19 + Vite 7 + TypeScript 5.5 + Tailwind 4 declarados en `package.json`. | Stack de frontend "bleeding edge" listo para Server Components y tooling moderno (pnpm/vite). |
| Design System | Variables CSS multi-modo + token semántico dentro de `src/index.css`. | Sistema de diseño atómico y accesible con acentos reusables, listo para theming 2025. |
| Token helpers | `src/utils/designTokens.ts` y consumo en `ConfettiCanvas`/`PageProgress`. | APIs para leer/resolver tokens en runtime y conectar animaciones con el DS. |
| Experiencia narrativa | Secciones Hero/Experience/Projects/Contact en `src/sections`. | Storytelling bilingüe con CTA claros, línea de tiempo y tarjetas de caso de uso. |
| Internacionalización | `LanguageContext` + datasets `src/data/es|en.ts`. | Switch en vivo ES/EN con persistencia y soporte para futuro RTL. |
| Accesibilidad & Tema | `ThemeContext` con ciclo light/dark/high-contrast. | Preferencias persistentes, focus ring tokens y soporte `prefers-color-scheme`. |
| Delight & confianza | `ConfettiCanvas`, `PageProgress`, `Contact` con meta texto. | Señales de calidad y micro-interacciones que refuerzan la propuesta premium.

## 2. Validación “Stack 2025”

| Expectativa 2025 | Situación actual | Gap |
| --- | --- | --- |
| **Capas modernas**: React 19 / Vite 7 / Tailwind 4. | Ya adoptado en `package.json`. | ✅
| **Tokens semánticos** listos para múltiples superficies. | Variables CSS + `@theme` config + helper TS. | ✅ (extender a tipografías y spacing).
| **Experiencias AI-nativas** narradas con casos reales. | Hero/Experience muestran IA generativa, pero los proyectos son estáticos. | ◻️ Falta storytelling profundo (demos, métricas live).
| **Contenido dinámico / orquestado** con pipelines (CMS/RAG). | Data hardcodeada en `src/data`. | ◻️ Falta headless CMS o integración de agentes.
| **Interacciones asistidas** (contact form inteligente, keyboard, PDF). | CTA actuales son enlaces; sin formularios ni agentes visibles. | ◻️ Debemos publicar features tangibles.

Conclusión: la base técnica sí es "stack 2025", pero debemos demostrar valor con experiencias asistidas y contenido dinámico antes de octubre 2025.

## 3. Roadmap recomendado hasta octubre 2025

### Fase 1 · Hardening + Autonomía del sistema (dic 2024 – feb 2025)
1. **Unificar assets de contenido**
   - Crear capa `content/` con tipados y loaders para reemplazar los literal objects en `src/data/*.ts`.
   - Añadir pruebas de regresión con Vitest en torno a `LanguageContext` para asegurar pluralización básica.
2. **Token pipeline & auditoría de accesibilidad**
   - Generar snapshot visual de `src/index.css` y publicar tokens en JSON (DTCG) para consumirlos desde Storybook/Tailwind.
   - Conectar `ThemeContext` con toggles dentro de Header para garantizar discoverability del modo alto contraste.
3. **PDF & automation**
   - Revisar los errores de `pnpm run build` ligados a `pdfGenerator` y Command Palette para que el build quede verde.

### Fase 2 · Experiencias demostrables (mar – jun 2025)
1. **Contact form con agente**
   - Evolucionar `src/sections/Contact.tsx` de CTA estáticos a un formulario serverless + webhook (Resend/Supabase) con resumen AI.
2. **Case studies interactivos**
   - Inyectar data enriquecida (métricas, videos, live sandboxes) en `src/sections/Projects.tsx`.
   - Integrar `react-intersection-observer` y `framer-motion` para mostrar narrativas paso a paso.
3. **Playground de tokens**
   - Reutilizar `src/utils/designTokens.ts` para renderizar un panel de control (sliders) donde los clientes prueben la paleta "Aurora" vs "Neon".

### Fase 3 · Go-to-market Q4 (jul – oct 2025)
1. **CMS / Graph RAG**
   - Montar Contentful/Sanity o un pipeline RAG ligero para sincronizar experiencias, asegurando despliegues sin redeploy.
2. **AI Advisory Hub**
   - Añadir sección nueva con plantillas/briefs descargables y un agente (LLM) que explique el stack sobre la marcha.
3. **Distribución multicanal**
   - Automatizar export a PDF (CV) + pitch deck + snippet LinkedIn.
   - Integrar métricas (Posthog/Umami) para cerrar el loop antes de octubre 2025.

## 4. Próximos pasos inmediatos
1. Socializar este roadmap con stakeholders para confirmar prioridades.
2. Agendar un spike de 1 sprint para resolver los errores de build y documentar KPIs base.
3. Preparar tablero (Linear/Jira) con epics por fase y dependencias (CMS, agentes, etc.).
